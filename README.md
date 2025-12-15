# (Antipolo) Centro De Medikal Hospital

A full-stack hospital management application built to streamline patient care workflows, from reception check-in to clinical documentation and billing. This system handles everything a modern hospital needs - patient admissions, laboratory results, billing management, room assignments, and much more.

## About This Project

We built this system to solve real workflow challenges in hospital operations. The application follows a multi-phase patient admission process that mirrors how hospitals actually work - starting with reception check-in, moving through clinical assessment, coding and bed assignment, and finally billing.

The system enforces role-based access control to ensure that receptionists, doctors, nurses, billing operators, and administrators each have access to exactly what they need, when they need it.

## Key Features

### Patient Management
- **Multi-phase admission workflow** - From reception to discharge
- **Patient verification system** - Email-based confirmation for patient data accuracy
- **Comprehensive patient records** - Demographics, medical history, images, and emergency contacts
- **Episode-based tracking** - Separate clinical episodes while maintaining patient identity

### Clinical Operations
- **Clinical documentation** - Vitals, diagnoses, treatment plans, and physician notes
- **ICD code mapping** - Automatic department routing based on diagnosis codes
- **Laboratory management** - Test ordering, result tracking, and file attachments
- **Inpatient room management** - Real-time bed availability and assignments

### Administrative Functions
- **User management** - Role-based permissions (Admin, Doctor, Nurse, Receptionist, Teller)
- **Billing system** - Service tracking, payment processing, and invoice generation
- **Reporting & analytics** - Dashboard with patient statistics and trends
- **Database backup system** - Automated backups with restore capabilities
- **Audit logging** - Complete user action tracking for compliance

### Security Features
- JWT-based authentication
- Security questions for password recovery
- Role-based route protection
- Password reset workflow with email verification

## Tech Stack

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Primary database
- **Django Channels** - WebSocket support for real-time features
- **Redis** - Caching and task queue (Django-Q)
- **JWT** - Token-based authentication

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Chart.js & Recharts** - Data visualization
- **jsPDF** - PDF generation for reports
- **Styled Components** - Component styling

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Production web server (frontend)
- **Gunicorn** - WSGI HTTP server (backend)

## HOW TO START???

### Prerequisites

Make sure you have these installed:
- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL** (or use Docker)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/JaspherCad/django-react-softeng2.git
cd django-react-softeng2
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv env

# On Windows
env\Scripts\activate

# On macOS/Linux
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure your database in backend/settings.py or use environment variables
# Create database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser account
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend/frontend-vite

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Configuration

#### Environment Variables

The application uses a centralized configuration system. Edit `shared.env` in the project root:

```env
API_HOST=localhost
API_PORT=8000
CLIENT_PORT=3000
```

For detailed configuration options, see [CONFIG_README.md](CONFIG_README.md)

#### Database Setup

Update your `backend/backend/settings.py` with your PostgreSQL credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hospital_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Docker Deployment

For production deployment or if you prefer containerized development:

```bash
# Make sure you're in the project root
docker-compose up --build
```

This will start both the backend and frontend in containers:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

## Project Structure

```
hospital-management-system/
├── backend/
│   ├── api/                      # Main application logic
│   │   ├── models.py            # Database models
│   │   ├── views.py             # API endpoints
│   │   ├── serializers.py       # Data serialization
│   │   ├── permissions.py       # Custom permissions
│   │   └── urls.py              # API routes
│   ├── backend/                  # Django project settings
│   ├── backups/                  # Database backups
│   ├── media/                    # Uploaded files
│   └── requirements.txt
│
├── frontend/
│   └── frontend-vite/
│       ├── src/
│       │   ├── components/      # React components
│       │   │   ├── AdminPage/
│       │   │   ├── Billing/
│       │   │   ├── Dashboard/
│       │   │   ├── Laboratory/
│       │   │   ├── Patients/
│       │   │   └── ...
│       │   ├── context/         # React context (Auth, etc.)
│       │   ├── config/          # Configuration utilities
│       │   └── MainApp.jsx      # Main routing component
│       └── package.json
│
├── docker-compose.yml
├── shared.env
└── README.md
```

## Default User Roles

The system supports five user roles, each with specific permissions:

| Role | Access | Primary Functions |
|------|--------|------------------|
| **Admin** | Full system access | User management, system configuration, backups |
| **Doctor** | Clinical & patient data | Clinical documentation, diagnosis, treatment orders |
| **Nurse** | Clinical & patient data | Vital signs, care documentation, assist doctors |
| **Receptionist** | Patient registration | Check-in, demographics, insurance info |
| **Teller** | Billing & payments | Process payments, generate invoices, manage billing |

## Patient Admission Workflow

The system implements a three-phase admission process:

### Phase 1: Reception Check-In
- Receptionist registers new patients or checks in existing ones
- Collects demographic and insurance information
- Patient status: **Pending**

### Phase 2: Clinical Documentation
- Doctors/nurses perform medical assessment
- Record vitals, diagnosis, and treatment plan
- Assign attending physician and department
- Patient status: **Ready for Coding**

### Phase 3: Coding & Bed Assignment
- Medical coder reviews clinical documentation
- Assigns final admission type (Inpatient/Outpatient/ER)
- For inpatients, assigns room and bed
- Patient status: **Active** or **Admitted**

For detailed workflow documentation, see [PATIENT_ADMISSION_WORKFLOW.md](PATIENT_ADMISSION_WORKFLOW.md)

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests (if configured)
cd frontend/frontend-vite
npm test
```

### Code Style

We try to maintain clean, readable code. The backend follows Django conventions, and the frontend uses modern React patterns with functional components and hooks.

### Database Migrations

After modifying models:

```bash
python manage.py makemigrations
python manage.py migrate
```

## API Documentation

The REST API is documented within the codebase. Key endpoints include:

- `/api/patients/` - Patient CRUD operations
- `/api/users/` - User management
- `/api/billing/` - Billing and payments
- `/api/laboratory/` - Lab results
- `/api/departments/` - Department management
- `/api/rooms/` - Room and bed management

Authentication requires JWT tokens obtained via `/api/token/` endpoint.

## Contributing

This is a learning project, but we welcome suggestions and improvements! If you find bugs or have ideas for features:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Built as a Software Engineering 2 project
- Thanks to everyone who tested and provided feedback
- Special thanks to the Django and React communities for excellent documentation

## 📞 Support

If you encounter issues or have questions:
- Check the [CONFIG_README.md](CONFIG_README.md) for configuration help
- Review [PATIENT_ADMISSION_WORKFLOW.md](PATIENT_ADMISSION_WORKFLOW.md) for workflow guidance
- Open an issue in the repository

## 🔮 Future Enhancements

We're always thinking about improvements:
- [ ] Mobile app for doctors and nurses
- [ ] Appointment scheduling system
- [ ] Pharmacy inventory management
- [ ] Telemedicine integration
- [ ] Advanced reporting and analytics
- [ ] SMS notifications for appointments
- [ ] Integration with medical devices

---

**Note**: This is a demonstration project. For production use in a real hospital, ensure compliance with healthcare regulations (HIPAA, local laws) and conduct thorough security audits.
