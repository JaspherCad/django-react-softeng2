# Generated by Django 4.2.19 on 2025-02-15 04:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="billing",
            old_name="services",
            new_name="patient_services",
        ),
    ]
