document.addEventListener('DOMContentLoaded', function() {
    loadCalendarEvents();
});

function loadCalendarEvents() {
    // Get verified events from localStorage
    const verifiedEvents = JSON.parse(localStorage.getItem('verifiedEvents')) || [];
    
    // Find the table body where events should be displayed
    const tableBody = document.querySelector('table tbody');
    
    if (!tableBody) {
        console.error('Table body not found in calendar page');
        return;
    }
    
    // Clear existing rows (except header if it's in tbody)
    tableBody.innerHTML = '';
    
    if (verifiedEvents.length === 0) {
        // Show "No events" message
        const noEventsRow = document.createElement('tr');
        noEventsRow.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 40px; color: #888;">
                No verified events yet. Events will appear here once verified.
            </td>
        `;
        tableBody.appendChild(noEventsRow);
        return;
    }
    
    // Add each verified event to the table
    verifiedEvents.forEach((event, index) => {
        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
        
        row.innerHTML = `
            <td>${event.eventName}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.venue}</td>
            <td>${event.yearOfStudy || 'All'}</td>
            <td>${event.section || 'All'}</td>
            <td>${event.guestPerson || 'N/A'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Add CSS animation for fade-in effect
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
`;
document.head.appendChild(style);

// Refresh events every 5 seconds to catch new verifications
setInterval(loadCalendarEvents, 5000);