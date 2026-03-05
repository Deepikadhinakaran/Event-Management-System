🎉 Event Management System

A full-featured web application for managing college/university events with role-based access, event verification, and real-time notifications.

![login](https://github.com/user-attachments/assets/d7649adb-dd1c-49a4-b209-b09b93a2a956)


✨ Features

Multi-Role Authentication - Separate login for Students, Staff, and HOD
Event Registration - Create and submit new events
Admin Verification - Approve/review events before publishing
Calendar View - See all verified events in organized format
Participation System - Confirm or decline event attendance
Real-Time Notifications - Get updates on event verifications and confirmations
Query System - Ask questions about events
Persistent Storage - All data saved locally in browser


💻 Tech Stack

Frontend: HTML5, CSS3, Vanilla JavaScript
Storage: LocalStorage API, SessionStorage API
Design: Modern CSS with gradients and animations
Architecture: Modular JavaScript with MVC pattern


🚀 Quick Start
Installation

Clone the repository
Navigate to project directory
Start a local server:

Python: python -m http.server 5500
Node.js: npx http-server -p 5500
VS Code: Use Live Server extension


Open http://127.0.0.1:5500/login/login.html

First Steps

Login with any username/password (demo mode)
Navigate to Verification page
Click "Verify" on any event
Check Calendar, Participation, and Notifications pages


📁 Project Structure
event-management-system/
├── home/                    # Landing page
├── login/                   # Authentication
├── verification/            # Event approval
├── calendar/                # Event calendar
├── participation/           # User participation
├── notification/            # Notification center
└── regi/                    # Event registration

🔄 System Flow
User Journey:
Login → Home → Registration → Verification → Calendar/Participation/Notifications
Event Lifecycle:

User creates event (Registration)
Admin approves event (Verification)
Event appears in Calendar and Participation
Users confirm attendance (Yes/No)
System sends notifications


📖 How It Works
Login Page

Choose Student, Staff, or HOD role
Enter credentials (accepts any in demo mode)
Session stored for navigation

Verification Page

View pending events
Click "Verify" to approve
Query button to ask questions
Approved events propagate to all pages

Calendar Page

Shows all verified events
Displays: Name, Date, Time, Venue, Guest, Year, Section
Auto-refreshes every 5 seconds

Participation Page

Yes Button: Confirms attendance, shows "✓ Participating"
No Button: Declines and removes event from list
Cancel Button: Undo participation decision
Auto-updates every 10 seconds

Notification Page

Event verification alerts
Participation confirmations
Click to mark as read
Time ago display (e.g., "5 minutes ago")


💾 Data Storage
All data stored in browser's LocalStorage:

verifiedEvents - All approved events
userParticipations - User Yes/No decisions
notifications - All system notifications
calendarEvents - Calendar data
participationEvents - Participation data
eventQueries - User questions

Session data in SessionStorage:

username, userRole, isLoggedIn


🎨 Key Features
Authentication

Multi-role login system
Session persistence
Auto-redirect after login

Event Management

Admin approval workflow
Prevents duplicate verifications
Automatic data synchronization

Participation Tracking

Binary Yes/No system
Instant feedback
Cancellation support
User-specific tracking

Notifications

Real-time updates
Read/unread status
Event details included
Auto-refresh


🔧 Configuration
Refresh Intervals:

Calendar: 5 seconds
Participation: 10 seconds
Notifications: 10 seconds

Color Scheme:

Primary: Pink (#CF2E9A) and Purple (#B749D3)
Success: Green (#28a745)
Danger: Red (#dc3545)


🐛 Troubleshooting
Buttons not working?

Check browser console for errors (F12)
Verify JavaScript files are linked
Clear cache and reload

Events not appearing?

First verify an event on Verification page
Check localStorage in DevTools
Clear storage and retry

Data not persisting?

Don't use Incognito mode
Enable localStorage in browser settings

Reset System:
Open console and run: localStorage.clear(); sessionStorage.clear(); location.reload();

📚 Main Functions
Verification System

loadEvents() - Display events
verifyEvent() - Approve event
openQueryModal() - Ask questions

Participation System

loadParticipationEvents() - Load events
confirmParticipation() - Say Yes
declineParticipation() - Say No
cancelParticipation() - Undo decision

Notification System

loadNotifications() - Display notifications
markAsRead() - Mark as read
getTimeAgo() - Time calculation


🧪 Testing Checklist

 Login with different roles
 Create and verify events
 Check events in Calendar
 Confirm participation (Yes)
 Decline participation (No)
 Cancel participation
 View notifications
 Mark notifications as read
 Test auto-refresh
 Test across browsers


🚀 Deployment
GitHub Pages: Push to gh-pages branch, enable in Settings
Netlify: Connect repo, deploy with default settings
Vercel: Install CLI, run vercel command

📈 Future Enhancements

Backend API with Node.js/Express
Database integration (MongoDB/PostgreSQL)
JWT authentication
Email notifications
Calendar integration
Export to PDF/Excel
Mobile app version
Analytics dashboard


🤝 Contributing

Fork the repository
Create feature branch
Commit changes
Push and open Pull Request


🙏 Acknowledgments

Modern event management platforms for inspiration
MDN Web Docs for technical reference
Open source community


⭐ If you find this project helpful, please give it a star!
Made with ❤️ for efficient event management
