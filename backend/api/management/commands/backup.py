# backend/api/management/commands/backup.py

import os
import shutil
import subprocess
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings

from api.models import BackupHistory, User

class Command(BaseCommand):
    help = 'Backs up MySQL DB and media files'

    def handle(self, *args, **kwargs):

        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        backup_dir = os.path.join(settings.BASE_DIR, "backups") 
        #backend/backups (THE FOLDER WHERE BACKUPS ARE STORED)
        db_backup_path = os.path.join(backup_dir, f"db_{timestamp}.sql")  
        #backend/backups.db_20231001-123456.sql
        media_backup_path = os.path.join(backup_dir, f"media_{timestamp}.zip")
        #backend/backups/media_20231001-123456.zip

        #like mkdir -p: create backup directory if it doesn't exist
        os.makedirs(backup_dir, exist_ok=True)

        self.stdout.write("Backing up MySQL database...")
        try:
            subprocess.run([
                "mysqldump",
                "-u", settings.DATABASES['default']['USER'],
                "--password=" + settings.DATABASES['default']['PASSWORD'],
                "--single-transaction",
                "--routines",
                "--triggers",
                "--no-tablespaces",
                settings.DATABASES['default']['NAME'],
                "--result-file=" + db_backup_path
            ], check=True, shell=True)  
        except Exception as e:
            self.stderr.write(f"Database backup failed: {str(e)}")
            return
        




        # Backup Media Folder
        self.stdout.write("Zipping media files...")
        try:
            shutil.make_archive(media_backup_path.replace(".zip", ""), 'zip', settings.MEDIA_ROOT)
        except Exception as e:
            self.stderr.write(f"Media backup failed: {str(e)}")
            return

        self.stdout.write(self.style.SUCCESS(f"Backup completed: {db_backup_path}, {media_backup_path}"))

        # Save backup to BackupHistory
        try:
            # Try to get system user, create if doesn't exist
            system_user, created = User.objects.get_or_create(
                user_id='system',
                defaults={
                    'role': 'Admin',
                    'department': 'System',
                    'email': 'system@backup.local',
                    'first_name': 'System',
                    'last_name': 'Backup',
                    'is_staff': True,
                    'is_active': True
                }
            )
            if created:
                self.stdout.write("Created system user for backups")
            
            BackupHistory.objects.create(
                backup_file=db_backup_path,
                media_backup=media_backup_path,
                performed_by=system_user,  
                notes='Automated backup'
            )
            self.stdout.write("Backup history record created")
        except Exception as e:
            self.stderr.write(f"Warning: Could not save backup history: {str(e)}")
            # Don't fail the backup if we can't save the history