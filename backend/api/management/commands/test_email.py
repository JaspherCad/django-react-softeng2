from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from api.models import Patient

class Command(BaseCommand):
    help = 'Test email configuration by sending a test email'

    def add_arguments(self, parser):
        parser.add_argument(
            '--to',
            type=str,
            help='Email address to send test email to',
            required=True
        )
        parser.add_argument(
            '--patient-code',
            type=str,
            help='Patient code to use for testing (optional)',
            default='TEST123'
        )

    def handle(self, *args, **options):
        to_email = options['to']
        patient_code = options['patient_code']
        
        self.stdout.write(f"🧪 Testing email configuration...")
        self.stdout.write(f"📧 Sending to: {to_email}")
        self.stdout.write(f"🔧 Backend: {settings.EMAIL_BACKEND}")
        self.stdout.write(f"🏥 Hospital: {settings.HOSPITAL_NAME}")
        self.stdout.write(f"🌐 Frontend URL: {settings.FRONTEND_URL}")
        
        # Create a test patient object for template rendering
        test_patient = type('TestPatient', (), {
            'name': 'Test Patient',
            'code': patient_code,
            'email': to_email,
            'pk': 999
        })()
        
        try:
            # Test HTML email
            subject = f"🧪 Email Test - {settings.HOSPITAL_NAME}"
            html_message = render_to_string('emails/confirmation_email.html', {
                'patient': test_patient,
                'setup_url': f"{settings.FRONTEND_URL}/set-password/test123/test-token/",
                'hospital_name': settings.HOSPITAL_NAME
            })
            
            # Plain text fallback
            plain_message = f"""
🧪 This is a test email from {settings.HOSPITAL_NAME}

Email configuration is working properly!

Test Patient: {test_patient.name}
Patient Code: {test_patient.code}
Frontend URL: {settings.FRONTEND_URL}

If you received this email, your email configuration is set up correctly.
            """

            from django.core.mail import EmailMultiAlternatives
            
            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[to_email]
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send()
            
            self.stdout.write(
                self.style.SUCCESS(f"✅ Test email sent successfully to {to_email}")
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Failed to send test email: {str(e)}")
            )
            self.stdout.write(
                self.style.WARNING("\n🔧 Troubleshooting tips:")
            )
            self.stdout.write("1. Check your .env file has correct EMAIL_* settings")
            self.stdout.write("2. Verify Gmail app password is correct (16 characters)")
            self.stdout.write("3. Ensure 2-factor authentication is enabled on Gmail")
            self.stdout.write("4. Check if 'Less secure app access' is enabled (if not using app password)")
            self.stdout.write("5. Verify your Gmail account isn't locked or suspended")
