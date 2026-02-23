document.addEventListener('DOMContentLoaded', function() {
    console.log('Participation page loaded');
    loadParticipationEvents();
});

function loadParticipationEvents() {
    // Get verified events from localStorage
    const verifiedEvents = JSON.parse(localStorage.getItem('verifiedEvents')) || [];
    
    console.log('Found verified events:', verifiedEvents.length);
    
    // Find the table body using the ID from your HTML
    const tableBody = document.getElementById('participation-list');
    
    if (!tableBody) {
        console.error('Table body not found - looking for id="participation-list"');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Get user's participation decisions
    const userParticipations = JSON.parse(localStorage.getItem('userParticipations')) || {};
    const username = sessionStorage.getItem('username') || 'guest';
    
    if (verifiedEvents.length === 0) {
        // Show "No events" message
        const noEventsRow = document.createElement('tr');
        noEventsRow.innerHTML = `
            <td colspan="3" style="text-align: center; padding: 60px 20px; color: #888;">
                <div style="font-size: 48px; margin-bottom: 20px;">📅</div>
                <p style="font-size: 18px; margin-bottom: 10px;">No events available yet</p>
                <p style="font-size: 14px;">Events will appear here once they are verified</p>
            </td>
        `;
        tableBody.appendChild(noEventsRow);
        return;
    }
    
    // Filter out events that user declined
    const activeEvents = verifiedEvents.filter(event => {
        const eventKey = `${event.eventName}_${event.date}_${username}`;
        return userParticipations[eventKey] !== 'declined';
    });
    
    if (activeEvents.length === 0) {
        // Show "No events" message
        const noEventsRow = document.createElement('tr');
        noEventsRow.innerHTML = `
            <td colspan="3" style="text-align: center; padding: 60px 20px; color: #888;">
                <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                <p style="font-size: 18px; margin-bottom: 10px;">No pending events</p>
                <p style="font-size: 14px;">You've responded to all available events</p>
            </td>
        `;
        tableBody.appendChild(noEventsRow);
        return;
    }
    
    // Add each verified event with participation options
    activeEvents.forEach((event, index) => {
        const eventKey = `${event.eventName}_${event.date}_${username}`;
        const participation = userParticipations[eventKey];
        
        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
        
        // Highlight confirmed participations
        if (participation === 'confirmed') {
            row.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
            row.style.borderLeft = '4px solid #28a745';
        }
        
        // Create status buttons or status text
        let statusContent = '';
        
        if (participation === 'confirmed') {
            statusContent = `
                <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                    <span style="
                        background: #28a745; 
                        color: white; 
                        padding: 8px 20px; 
                        border-radius: 5px; 
                        font-weight: bold;
                        display: inline-block;
                    ">
                        ✓ Participating
                    </span>
                    <button 
                        onclick="cancelParticipation('${event.eventName}', '${event.date}')"
                        style="
                            background: #dc3545;
                            color: white;
                            border: none;
                            padding: 6px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                        ">
                        Cancel
                    </button>
                </div>
            `;
        } else {
            statusContent = `
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button 
                        class="yes-btn"
                        data-event-name="${event.eventName}"
                        data-event-date="${event.date}"
                        data-event-time="${event.time}"
                        data-event-venue="${event.venue}"
                        style="
                            background: linear-gradient(90deg, #28a745, #20c997);
                            color: white;
                            border: none;
                            padding: 10px 30px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 14px;
                            transition: all 0.3s;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(40, 167, 69, 0.4)';"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        Yes
                    </button>
                    <button 
                        class="no-btn"
                        data-event-name="${event.eventName}"
                        data-event-date="${event.date}"
                        style="
                            background: linear-gradient(90deg, #dc3545, #c82333);
                            color: white;
                            border: none;
                            padding: 10px 30px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 14px;
                            transition: all 0.3s;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(220, 53, 69, 0.4)';"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        No
                    </button>
                </div>
            `;
        }
        
        row.innerHTML = `
            <td style="padding: 20px; color: #fff; font-weight: 500;">
                ${event.eventName}
                <div style="font-size: 12px; color: #888; margin-top: 5px;">
                    📍 ${event.venue} • ⏰ ${event.time}
                </div>
            </td>
            <td style="padding: 20px; color: #fff;">
                ${event.date}
            </td>
            <td style="padding: 20px;">
                ${statusContent}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Attach event listeners after rows are created
    attachButtonListeners();
}

function attachButtonListeners() {
    // Yes buttons
    const yesBtns = document.querySelectorAll('.yes-btn');
    yesBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventName = this.getAttribute('data-event-name');
            const eventDate = this.getAttribute('data-event-date');
            const eventTime = this.getAttribute('data-event-time');
            const eventVenue = this.getAttribute('data-event-venue');
            confirmParticipation(eventName, eventDate, eventTime, eventVenue);
        });
    });
    
    // No buttons
    const noBtns = document.querySelectorAll('.no-btn');
    noBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventName = this.getAttribute('data-event-name');
            const eventDate = this.getAttribute('data-event-date');
            declineParticipation(eventName, eventDate);
        });
    });
}

function confirmParticipation(eventName, eventDate, eventTime, eventVenue) {
    console.log('Confirming participation for:', eventName);
    
    const username = sessionStorage.getItem('username') || 'guest';
    const eventKey = `${eventName}_${eventDate}_${username}`;
    
    // Get existing participations
    let userParticipations = JSON.parse(localStorage.getItem('userParticipations')) || {};
    
    // Mark as confirmed
    userParticipations[eventKey] = 'confirmed';
    localStorage.setItem('userParticipations', JSON.stringify(userParticipations));
    
    // Create notification
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.unshift({
        id: Date.now(),
        type: 'registration',
        title: 'Participation Confirmed',
        message: `You have confirmed your participation in "${eventName}" on ${eventDate}`,
        eventData: {
            eventName: eventName,
            date: eventDate,
            venue: eventVenue || '-',
            time: eventTime || '-'
        },
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Show success message
    alert(`✅ Great! You're registered for "${eventName}"\n\n📅 Date: ${eventDate}\n⏰ Time: ${eventTime}\n📍 Venue: ${eventVenue}\n\nSee you there!`);
    
    // Reload the page
    loadParticipationEvents();
}

function declineParticipation(eventName, eventDate) {
    console.log('Declining participation for:', eventName);
    
    const confirmed = confirm(`Are you sure you don't want to participate in "${eventName}"?\n\nThis event will be removed from your participation list.`);
    
    if (!confirmed) {
        return;
    }
    
    const username = sessionStorage.getItem('username') || 'guest';
    const eventKey = `${eventName}_${eventDate}_${username}`;
    
    // Get existing participations
    let userParticipations = JSON.parse(localStorage.getItem('userParticipations')) || {};
    
    // Mark as declined
    userParticipations[eventKey] = 'declined';
    localStorage.setItem('userParticipations', JSON.stringify(userParticipations));
    
    // Show message
    alert(`Event "${eventName}" has been removed from your participation list.`);
    
    // Reload the page
    loadParticipationEvents();
}

function cancelParticipation(eventName, eventDate) {
    console.log('Canceling participation for:', eventName);
    
    const confirmed = confirm(`Are you sure you want to cancel your participation in "${eventName}"?`);
    
    if (!confirmed) {
        return;
    }
    
    const username = sessionStorage.getItem('username') || 'guest';
    const eventKey = `${eventName}_${eventDate}_${username}`;
    
    // Get existing participations
    let userParticipations = JSON.parse(localStorage.getItem('userParticipations')) || {};
    
    // Remove the participation
    delete userParticipations[eventKey];
    localStorage.setItem('userParticipations', JSON.stringify(userParticipations));
    
    // Show message
    alert(`Your participation in "${eventName}" has been cancelled.`);
    
    // Reload the page
    loadParticipationEvents();
}

// Make function available globally
window.cancelParticipation = cancelParticipation;

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .participation-table tbody tr {
        transition: all 0.3s ease;
    }
    
    .participation-table tbody tr:hover {
        background-color: rgba(207, 46, 154, 0.05) !important;
    }
`;
document.head.appendChild(style);

// Refresh events every 10 seconds
setInterval(loadParticipationEvents, 10000);

console.log('Participation.js loaded successfully');