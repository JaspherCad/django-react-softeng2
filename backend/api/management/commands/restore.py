# management/commands/restore.py

import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
import subprocess
import os
import zipfile

from api.models import BackupHistory

class Command(BaseCommand):
    help = 'Restores MySQL DB and media files from backup'

    def add_arguments(self, parser):
        parser.add_argument('backup_id', type=int)

    def handle(self, *args, **options):
        backup_id = options['backup_id']
        
        # Add confirmation prompt
        confirm = input(f"⚠️  WARNING: This will COMPLETELY REPLACE your current database and media files!\n"
                       f"Type 'CONFIRM' to proceed with restore of backup {backup_id}: ")
        
        if confirm != 'CONFIRM':
            self.stdout.write(self.style.ERROR("Restore cancelled"))
            return
        
        # PRESERVE BACKUP HISTORY - Get all backup records before restore
        self.stdout.write("Preserving backup history...")
        try:
            all_backups = list(BackupHistory.objects.all().values(
                'id', 'backup_file', 'media_backup', 'timestamp', 'performed_by_id'
            ))
            self.stdout.write(f"Found {len(all_backups)} backup records to preserve")
        except Exception as e:
            self.stderr.write(f"Could not preserve backup history: {e}")
            all_backups = []
        
        # Create automatic backup before restore
        self.stdout.write("Creating safety backup before restore...")
        try:
            from django.core.management import call_command
            call_command('backup')
            self.stdout.write(self.style.SUCCESS("Safety backup created"))
        except Exception as e:
            self.stderr.write(f"Could not create safety backup: {e}")
            confirm_anyway = input("Continue without safety backup? Type 'YES': ")
            if confirm_anyway != 'YES':
                return

        try:
            backup = BackupHistory.objects.get(id=backup_id)
        except BackupHistory.DoesNotExist:
            self.stderr.write(f"Backup {backup_id} not found")
            return

        # Clear media folder before restore
        media_root = settings.MEDIA_ROOT
        for filename in os.listdir(media_root):
            file_path = os.path.join(media_root, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                self.stderr.write(f"Error clearing media: {str(e)}")

        # Restore media
        try:
            with zipfile.ZipFile(backup.media_backup, 'r') as zip_ref:
                zip_ref.extractall(media_root)
        except Exception as e:
            self.stderr.write(f"Media restore failed: {str(e)}")
            return

        # Restore DB
        try:
            with open(backup.backup_file, 'r', encoding='utf-8') as f:
                subprocess.run([
                    "mysql",
                    "-u", settings.DATABASES['default']['USER'],
                    "--password=" + settings.DATABASES['default']['PASSWORD'],
                    settings.DATABASES['default']['NAME']
                ], stdin=f, check=True)
        except Exception as e:
            self.stderr.write(f"Database restore failed: {str(e)}")
            return

        # RESTORE BACKUP HISTORY - Re-create all backup records
        self.stdout.write("Restoring backup history...")
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            for backup_data in all_backups:
                # Skip if backup record already exists (from the restored database)
                if not BackupHistory.objects.filter(id=backup_data['id']).exists():
                    # Get user if exists, otherwise set to None
                    performed_by = None
                    if backup_data['performed_by_id']:
                        try:
                            performed_by = User.objects.get(id=backup_data['performed_by_id'])
                        except User.DoesNotExist:
                            pass
                    
                    BackupHistory.objects.create(
                        id=backup_data['id'],
                        backup_file=backup_data['backup_file'],
                        media_backup=backup_data['media_backup'],
                        timestamp=backup_data['timestamp'],
                        performed_by=performed_by
                    )
            
            self.stdout.write(self.style.SUCCESS(f"Restored {len(all_backups)} backup history records"))
        except Exception as e:
            self.stderr.write(f"Could not restore backup history: {str(e)}")

        self.stdout.write(self.style.SUCCESS("Restore completed successfully with backup history preserved"))