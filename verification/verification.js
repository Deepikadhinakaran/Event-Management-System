// Sample events data - Replace with data from Registration page or API
let events = [
    { name: 'Tech Talk', date: '2024-10-20', time: '10:00 AM', venue: 'Auditorium', year: '3', section: 'A', guest: 'Dr. John Doe' },
    { name: 'Cultural Fest', date: '2024-11-02', time: '5:00 PM', venue: 'Main Ground', year: '2', section: 'B', guest: 'Mr. Michael Smith' },
    { name: 'Hackathon 2024', date: '2024-12-15', time: '9:00 AM', venue: 'Computer Lab', year: '4', section: 'C', guest: 'Ms. Sarah Johnson' }
];

// Load events from localStorage if available (from Registration page)
const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];
console.log('Loaded registered events:', registeredEvents);

if (registeredEvents.length > 0) {
    events = [...registeredEvents, ...events]; // Put newly registered events first
}

// Global variable for query modal
let currentQueryEventIndex = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Verification system loaded');
    console.log('Total events to display:', events.length);
    loadEvents();
    initializeModalHandlers();
});

// Populate the table with events
function loadEvents() {
    const tableBody = document.getElementById('event-table-body');
    
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }
    
    tableBody.innerHTML = ''; // Clear existing rows

    const verifiedEvents = JSON.parse(localStorage.getItem('verifiedEvents')) || [];

    if (events.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" style="text-align: center; padding: 20px;">No events to display. Register an event first!</td>';
        tableBody.appendChild(row);
        return;
    }

    events.forEach((event, index) => {
        // Check if this event is already verified
        const isVerified = verifiedEvents.some(ve => 
            ve.eventName === event.name && 
            ve.date === event.date && 
            ve.time === event.time
        );

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.venue}</td>
            <td>${event.year}</td>
            <td>${event.section}</td>
            <td>${event.guest}</td>
            <td>
                <button class="verify-btn" data-index="${index}" ${isVerified ? 'disabled' : ''} 
                    style="background: ${isVerified ? '#28a745' : 'rgb(207, 46, 154)'}; 
                           color: white; 
                           border: none; 
                           padding: 8px 20px; 
                           border-radius: 5px; 
                           cursor: ${isVerified ? 'default' : 'pointer'}; 
                           margin-right: 5px;
                           opacity: 1;
                           font-weight: bold;">
                    ${isVerified ? 'Verified ✓' : 'Verify'}
                </button>
                <button class="query-btn" data-index="${index}" ${isVerified ? 'disabled' : ''}
                    style="background: rgb(183, 73, 211); 
                           color: white; 
                           border: none; 
                           padding: 8px 20px; 
                           border-radius: 5px; 
                           cursor: ${isVerified ? 'not-allowed' : 'pointer'};
                           opacity: ${isVerified ? '0.5' : '1'};
                           font-weight: bold;">
                    Query
                </button>
            </td>
        `;
        
        if (isVerified) {
            row.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        }
        
        tableBody.appendChild(row);
    });

    // Add event listeners after rows are created
    attachEventListeners();
}

// Attach event listeners to Verify and Query buttons
function attachEventListeners() {
    // Verify buttons
    const verifyBtns = document.querySelectorAll('.verify-btn');
    verifyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                verifyEvent(this);
            }
        });
    });

    // Query buttons
    const queryBtns = document.querySelectorAll('.query-btn');
    queryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const index = this.getAttribute('data-index');
                openQueryModal(index);
            }
        });
    });
}

// Verify Event Function
function verifyEvent(button) {
    console.log('Verify button clicked');
    
    const index = button.getAttribute('data-index');
    const event = events[index];

    if (!event) {
        alert('Error: Event not found');
        return;
    }

    const eventData = {
        eventName: event.name,
        date: event.date,
        time: event.time,
        venue: event.venue,
        yearOfStudy: event.year,
        section: event.section,
        guestPerson: event.guest,
        status: 'Verified',
        verifiedDate: new Date().toISOString(),
        verifiedBy: sessionStorage.getItem('username') || 'Admin'
    };

    console.log('Event data to verify:', eventData);

    // Get existing verified events
    let verifiedEvents = JSON.parse(localStorage.getItem('verifiedEvents')) || [];

    // Check if already verified
    const isAlreadyVerified = verifiedEvents.some(ve => 
        ve.eventName === eventData.eventName && 
        ve.date === eventData.date &&
        ve.time === eventData.time
    );

    if (isAlreadyVerified) {
        alert('This event has already been verified!');
        return;
    }

    // Add to verified events
    verifiedEvents.push(eventData);
    localStorage.setItem('verifiedEvents', JSON.stringify(verifiedEvents));
    console.log('Saved to verifiedEvents');

    // Save to calendar
    let calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    calendarEvents.push(eventData);
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    console.log('Saved to calendarEvents');

    // Save to participation
    let participationEvents = JSON.parse(localStorage.getItem('participationEvents')) || [];
    participationEvents.push(eventData);
    localStorage.setItem('participationEvents', JSON.stringify(participationEvents));
    console.log('Saved to participationEvents');

    // Create notification
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.unshift({
        id: Date.now(),
        type: 'event_verified',
        title: 'Event Verified',
        message: `${eventData.eventName} has been verified and scheduled for ${eventData.date} at ${eventData.time}`,
        eventData: eventData,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    console.log('Notification created');

    // Show success message
    alert(`✅ Event "${eventData.eventName}" has been verified successfully!\n\n📅 Date: ${eventData.date}\n⏰ Time: ${eventData.time}\n📍 Venue: ${eventData.venue}\n\nThe event will now appear in:\n• Calendar\n• Participation\n• Notifications`);

    // Reload the table to reflect changes
    loadEvents();
}

// Query Modal Functions
function openQueryModal(index) {
    currentQueryEventIndex = index;
    const event = events[index];
    
    const modal = document.getElementById('query-modal');
    const eventNameElement = document.getElementById('query-event-name');
    
    if (eventNameElement) {
        eventNameElement.textContent = `Event: ${event.name}`;
    }
    
    if (modal) {
        modal.style.display = 'block';
    }
}

// Initialize modal handlers
function initializeModalHandlers() {
    const modal = document.getElementById('query-modal');
    const closeBtn = document.querySelector('#query-modal .close');
    const submitBtn = document.getElementById('submit-query');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.getElementById('query-question').value = '';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.getElementById('query-question').value = '';
        }
    });

    // Handle submit query
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const query = document.getElementById('query-question').value.trim();
            
            if (!query) {
                alert('Please enter a question.');
                return;
            }

            if (currentQueryEventIndex === null) {
                alert('Error: No event selected');
                return;
            }

            const event = events[currentQueryEventIndex];

            // Save query to localStorage
            let queries = JSON.parse(localStorage.getItem('eventQueries')) || [];
            queries.push({
                eventName: event.name,
                eventDate: event.date,
                guestPerson: event.guest,
                query: query,
                queriedBy: sessionStorage.getItem('username') || 'User',
                timestamp: new Date().toISOString(),
                status: 'Pending'
            });
            localStorage.setItem('eventQueries', JSON.stringify(queries));

            console.log('Query saved:', query);

            alert('✅ Your query has been submitted successfully!\n\nYou will receive a response soon.');
            
            modal.style.display = 'none';
            document.getElementById('query-question').value = '';
            currentQueryEventIndex = null;
        });
    }
}

// Helper function to clear all verification data (for testing)
function clearAllVerificationData() {
    localStorage.removeItem('verifiedEvents');
    localStorage.removeItem('calendarEvents');
    localStorage.removeItem('participationEvents');
    localStorage.removeItem('notifications');
    localStorage.removeItem('eventQueries');
    localStorage.removeItem('registeredEvents');
    console.log('All verification data cleared');
    alert('All data has been cleared!');
    location.reload();
}

// Make function available globally for debugging
window.clearAllVerificationData = clearAllVerificationData;

// Reload events when page gains focus (useful when navigating back from registration)
window.addEventListener('focus', function() {
    const newRegisteredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];
    if (newRegisteredEvents.length > 0) {
        events = [...newRegisteredEvents, ...events.filter(e => 
            !newRegisteredEvents.some(ne => 
                ne.name === e.name && ne.date === e.date && ne.time === e.time
            )
        )];
        loadEvents();
    }
});

console.log('Verification.js loaded successfully');
console.log('To clear all data for testing, type in console: clearAllVerificationData()');