# backend/Dockerfile
FROM python:3.9-slim

#DOCKER SPECFICI PATH. not local machine ko
WORKDIR /app

#This command copies your local requirements.txt file into the current working directory (/app) in the container.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt



#This command copies all the files from your local directory (the build context) into the container’s working directory (/app).
COPY . .

#The CMD instruction defines the default command that will run when a container is started from this image.
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]