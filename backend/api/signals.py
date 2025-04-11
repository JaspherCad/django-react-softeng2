# api/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Billing, BillingItem, Patient

@receiver(post_save, sender=BillingItem)
@receiver(post_delete, sender=BillingItem)
def update_billing_total(sender, instance, **kwargs):
    """
    Automatically update the Billing total_due when a BillingItem is added/updated/deleted.
    """
    #instance == this.
    instance.billing.update_total()
    instance.billing.save()
    print("SIGNAL WORKED! ORA!!!!!!!!!!!!!!!!")

@receiver(post_save, sender=Patient)
#when a Patient id has been viewed, print something or log it
def log_view_test(sender, instance, created, **kwargs):
    if created:
        print("WORKS!")
