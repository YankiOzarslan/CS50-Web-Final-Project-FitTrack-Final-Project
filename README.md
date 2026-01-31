FitTrack | Personal Fitness & Nutrition Dashboard
Distinctiveness and Complexity
FitTrack is a comprehensive fitness management application that distinguishes itself from standard social network or e-commerce projects through its focus on real-time user interaction and data visualization.

Distinctiveness: Unlike a typical blog or social platform, FitTrack serves as a personal utility tool. It combines three distinct domains: Nutrition Tracking, Live Workout Sessions, and Personalized Health Analysis. It doesn't rely on simple text posts but rather on complex data relationships between users, workouts, individual exercises, and sets. The UI is designed as a modern Single Page Application (SPA) dashboard where panels expand and contract dynamically without page reloads.

Complexity: The project demonstrates technical complexity in several areas:

Dynamic Session Management: The "Quick Start" feature uses a complex JavaScript-driven engine that pulls data from a localized library, manages a real-time countdown timer, and handles interactive checklists for exercises.

Data Modeling: The backend uses a multi-level relational database schema. A single Workout object is linked to multiple Exercise objects, each of which is further linked to multiple ExerciseSet objects. Managing these nested relationships via Django's prefetch_related and JSON-based POST requests requires advanced knowledge of the ORM.

Frontend Logic: I implemented a custom "Personal Fitness Assistant" that performs real-time client-side analysis of user weight data to generate caloric goals and dietary recommendations dynamically.

UI/UX Sophistication: The integration of CSS animations (like the SVG-based success checkmark), local storage for calorie persistence, and a mobile-responsive grid system ensures a high-end user experience.

What’s Contained in Each File
Python Files (Backend)
views.py: Contains the core logic. It manages the index view (fetching relational data), the create_workout view (processing complex nested JSON to save workouts), and the delete_workout view.

models.py: Defines the Workout, Exercise, and ExerciseSet classes. It utilizes related_name attributes to allow the frontend to easily traverse deep database relationships.

urls.py: Maps the application routes, including parameterized paths for deleting specific workouts.

HTML/Templates
layout.html: The base template containing the Bootstrap 5 boilerplate, navigation bar, and the primary container for the application.

index.html: The heart of the project. It includes the Calorie Tracker, the Workout Preset grid, the Live Workout Panel, the Motivation Dashboard, and the Fitness Assistant.

create.html: A dedicated form for users to manually enter custom workout data, supporting dynamic row addition for exercises and sets.

Static Files
workout.js: Handles the heavy lifting for the "Create" page. It manages CSRF token retrieval, dynamic DOM manipulation for adding/removing sets, and sending AJAX fetch requests to the Django server.

styles.css: (Optional/Inline) Custom CSS for the success checkmark animations, gradient backgrounds, and card transitions.

How to Run Your Application
To get FitTrack running on your local machine, follow these steps:

Install Dependencies: Ensure you have Django installed.

Bash
pip install -r requirements.txt
Database Setup: Apply the migrations to create the database schema.

Bash
python manage.py makemigrations
python manage.py migrate
Create a User: Since the app tracks personal data, you must be logged in. Create a superuser or register via the Django auth system.

Bash
python manage.py createsuperuser
Run the Server: Start the development server.

Bash
python manage.py runserver
Access the App: Navigate to http://127.0.0.1:8000/ in your web browser.

Additional Information
Local Storage: The Calorie Tracker uses localStorage to persist your daily calorie count even if the page is refreshed or the browser is closed.

Responsive Design: The application is fully responsive. On mobile devices, the workout cards stack vertically, while on desktop, they form a clean 4-column grid.

Language: The entire interface has been localized to English to ensure accessibility for the staff.

Requirements
Django (6.0.1 or similar)

Python 3.x
