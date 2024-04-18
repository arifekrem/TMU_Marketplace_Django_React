# TMU Marketplace

## Introduction

Welcome to TMU Marketplace - a advertisements platform tailored specifically for students of Toronto Metropolitan University.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setting Up a Python Virtual Environment

1. **Create Virtual Environment**

   To set up a new python3 virtual environment, run:

   ```bash
    python3 -m venv .venv
   ```

2. **Activate the Virtual Environment**

   On Unix or MacOS, run:

   ```bash
    source .venv/bin/activate
   ```
    Your command line will now indicate that you're working inside venv.

3. **Installing Python Dependencies**

    With your virtual environment active, install the project dependencies:

    ```bash
    pip install -r requirements.txt
    ```

    This command reads the requirements.txt file in your project directory and installs all the necessary Python packages.

### Database Migrations

Before running the server, you need to make sure the database schema is up to date. This is done through migrations.
   
1. **Navigate to the server Directory**
   ```bash
   cd server
   ```

2. **Create Migrations**
   ```bash
   python manage.py makemigrations
   ```

2. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

### Running the Server

After completing the migrations, you can start the server.

1. **Start the Django Server**
   ```bash
   python manage.py runserver
   ```

This command starts a development server on your local machine. By default, the server runs at http://127.0.0.1:8000/.

