from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        #signal handlers are connected
        import api.signals  # noqa

        from .tasks import generate_hourly_bed_charges
        from django_q.tasks import schedule
        from datetime import timedelta

        schedule(
            'api.tasks.generate_hourly_bed_charges',  # Task function path
            schedule_type='M',  # M = Minute
            minutes=1,          # Run every 1 minute
            repeats=-1                              # Infinite repeats
        )

        # schedule( #ORIGINAL
        #     'api.tasks.generate_hourly_bed_charges',  # Task function path
        #     schedule_type='H',                        # Hourly
            
        #     repeats=-1                                # Infinite repeats
        # )

