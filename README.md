# Toosiye

Toosiye is an application that connects clients with their desired technicians. It is built using vanilla JavaScript, Django, MySQL, HTML, and Tailwind CSS.

## Table of Contents

- [Setup Guide](#setup-guide)
- [Feature List](#feature-list)
  - [User Roles](#user-roles)
  - [Authentication](#authentication)
  - [Professional Profile (Advanced)](#professional-profile-advanced)
  - [Search System (Advanced Filtering)](#search-system-advanced-filtering)
  - [Contact Professional](#contact-professional)
  - [Ratings & Reviews](#ratings--reviews)
  - [Admin Panel](#admin-panel)

## Setup Guide

1. **Create a Directory**:
   - Set up a directory for your project.
2. **Set Up Django App**:
   - Initialize your Django application within the created directory.
3. **Run Virtual Environments**:
   - Activate your virtual environment to manage dependencies.
4. **Run Server**:
   - Start the Django development server.
5. **Copy the Entire Frontend**:
   - Copy the complete frontend files to your created directory.

## Feature List

### User Roles

- **Professional**: Service provider.
- **Client**: Service requester.
- **Hybrid**: Can act as both using a single account.

### Authentication

- **Registration/Login**: Users can register or log in using a username, email, and password.
- **Role Selection**: Choose between "I’m a Professional", "I’m a Client", or "Both".
- **Secure Login**: Includes logout and session control.
- **Profile Image Upload**: Professionals can upload their profile images.
- **Password Security**: Passwords are hashed using bcrypt or a similar method.

### Professional Profile (Advanced)

- **Full Name**: Display the professional's full name.
- **Profession Type**: Specify profession (e.g., Electrician, Mechanic, Developer).
- **Phone Number**: Visible to clients.
- **Location**: City and zone details.
- **Years of Experience**: Indicate years in the profession.
- **Services Offered**: Multi-select or comma-separated tags for services.
- **About/Bio**: Detailed personal introduction.
- **Portfolio Images**: Upload up to 5 portfolio pictures.
- **Optional Social Links**: Include links to WhatsApp, Telegram, and Facebook.

### Search System (Advanced Filtering)

- Users can:

  - Search by keyword.
  - Filter by profession (dropdown).
  - Filter by city/zone.
  - Sort by recently joined or top-rated.

- **Results Display**:
  - Profile picture, name, profession, and location.
  - Buttons for:
    - "View Profile"
    - "Show Phone Number"

### Contact Professional

- On the profile page:
  - Clients can click “Reveal Phone” to display the full number.
  - Optionally, log the number of times the phone number was viewed.

### Ratings & Reviews

- Logged-in users can:
  - Leave a rating from 1 to 5 stars.
  - Add review comments.
- Average rating displayed on professional profiles.

### Admin Panel

- **User Management**: View all users.
- **Approval System**: Approve or disapprove professional accounts.
- **Account Management**: Ban accounts if necessary.
- **Site Statistics**: View active users, top-rated professionals, and most viewed profiles.

---

This README provides a structured overview of the Toosiye application, including setup instructions and a detailed feature list to help users understand its functionality.
