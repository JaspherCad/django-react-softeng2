#THIS FILE IS ALL ABOUT DJANGO Q TASKS ASYNC.. cluster to be speicifc

#BUTTTTT where do we trigger these functions?? they are scheduled on APPS.py on def ready()

# tasks.py
from django_q.tasks import schedule, AsyncTask

#trigerred on apps.py AS async function
def generate_hourly_bed_charges():
    from api.models import BedAssignment
    active_assignments = BedAssignment.objects.filter(end_time__isnull=True)

    
    for assignment in active_assignments:
        hours = assignment.get_current_hours() - assignment.total_hours


        if hours >= 1:
            for _ in range(hours):
                assignment.create_billing_item() #inside models.py but acts like SERVICE.py