from django.apps import AppConfig
from django.db import OperationalError, ProgrammingError
from django.core.exceptions import AppRegistryNotReady


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    # def ready(self): 
    #     # connect signal handlers
    #     import api.signals  # noqa

    #     try:
    #         # schedule bed charges task only if django_q tables exist
    #         from .tasks import generate_hourly_bed_charges
    #         from django_q.tasks import schedule

    #         schedule(
    #             'api.tasks.generate_hourly_bed_charges',  # Task function path
    #             schedule_type='M',  # M = Minute
    #             minutes=1,          # Run every 1 minute
    #             repeats=-1          # Infinite repeats
    #         )

    #     except (OperationalError, ProgrammingError):
    #         # Tables not ready yet, skip scheduling
    #         pass



    def ready(self): #WORKING ready(self) 
        #if failed, remove try catch just plain.
        #signal handlers are connected
        import api.signals  # noqa

        try:

            from .tasks import generate_hourly_bed_charges
            from django_q.tasks import schedule

            schedule(
                'api.tasks.generate_hourly_bed_charges',  # Task function path
                schedule_type='M',  # M = Minute
                minutes=1,          # Run every 1 minute
                repeats=-1                              # Infinite repeats
            )   
        except AppRegistryNotReady:
            pass  # Allow Django to load before scheduling
        except (OperationalError, ProgrammingError):
            pass  # During initial migration

        

        # schedule( #ORIGINAL
        #     'api.tasks.generate_hourly_bed_charges',  # Task function path
        #     schedule_type='H',                        # Hourly
            
        #     repeats=-1                                # Infinite repeats
        # )

