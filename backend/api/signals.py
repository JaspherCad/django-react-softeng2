# api/signals.py
from django.db.models.signals import post_save, post_delete, pre_save, post_delete
from django.dispatch import receiver
from .models import Billing, BillingItem, Patient, BillingOperatorLog, UserActionLog
from .middleware import get_current_user
from django.contrib.contenttypes.models import ContentType

#COMPARED TO MIDDLEWARE.py that runs on every HTTP request (before & after your views)	
#THIS signals.py only runs whenever certain model events fire

@receiver(post_save, sender=BillingItem)
@receiver(post_delete, sender=BillingItem)
def update_billing_total(sender, instance, **kwargs):
    """
    Automatically update the Billing total_due when a BillingItem is added/updated/deleted.

    LATEST UPDATE 29/04/2025
        add current user to billing operators using thread (MIDDLEWARE)
    """
    #instance == this.

    #billingItem.Billing.updateTotal
    instance.billing.update_total()
    instance.billing.save()


    # Get current user
    user = get_current_user()
    print(user)
    if user and user.is_authenticated:
        print(f"{user.user_id} IS AUTHENTICATED")
        # 3. Avoid duplicate entries in operators
        if not instance.billing.operator.filter(id=user.id).exists():
            instance.billing.operator.add(user)
            print(f"{user.user_id} has been added as operator")

        # 4. Create a log entry
        action = (
            "Billing Item Added/Updated"
            if kwargs.get('created') else "Billing Item Deleted"
        )

        BillingOperatorLog.objects.create(
            billing=instance.billing,
            user=user,
            action=action
        )

    print("SIGNAL WORKED! ORA!!!!!!!!!!!!!!!!")




@receiver(post_save, sender=Patient)
#when a Patient id has been viewed, print something or log it
def log_view_test(sender, instance, created, **kwargs):
    if created:
        print("WORKS!")










@receiver(pre_save, sender=Patient)
def log_patient_update(sender, instance, **kwargs):
    if instance.pk:  # Update
        old_instance = Patient.objects.get(pk=instance.pk)
        changes = {
            field: (getattr(old_instance, field), getattr(instance, field))
            for field in ['name', 'status', 'address']
        }
        UserActionLog.objects.create(
            # user=instance.updated_by,  # Ensure this field exists in your model
            action_type='UPDATE',
            content_type=ContentType.objects.get_for_model(instance),
            object_id=instance.pk,
            object_repr=str(instance),
            details={'changes': changes}
        )

@receiver(post_delete, sender=Patient)
def log_patient_delete(sender, instance, **kwargs):
    UserActionLog.objects.create(
        # user=instance.updated_by,  # Ensure this field exists in your model
        action_type='DELETE',
        content_type=ContentType.objects.get_for_model(instance),
        object_id=instance.pk,
        object_repr=str(instance)
    )