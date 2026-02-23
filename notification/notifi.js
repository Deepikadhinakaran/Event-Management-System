document.addEventListener('DOMContentLoaded', function() {
    console.log('Notification page loaded');
    loadNotifications();
});

function loadNotifications() {
    // Get all notifications from localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    console.log('Found notifications:', notifications.length);
    
    // Find the table body using the ID from your HTML
    const tableBody = document.getElementById('notification-list');
    
    if (!tableBody) {
        console.error('Table body not found - looking for id="notification-list"');
        return;
    }
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (notifications.length === 0) {
        // Show "No notifications" message
        const noNotifRow = document.createElement('tr');
        noNotifRow.innerHTML = `
            <td colspan="3" style="text-align: center; padding: 60px 20px; color: #888;">
                <div style="font-size: 48px; margin-bottom: 20px;">📭</div>
                <p style="font-size: 18px; margin-bottom: 10px;">No notifications yet</p>
                <p style="font-size: 14px;">You'll see notifications here when events are verified</p>
            </td>
        `;
        tableBody.appendChild(noNotifRow);
        return;
    }
    
    // Create notification rows
    notifications.forEach((notification, index) => {
        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
        
        // Add visual indicator for unread notifications
        if (!notification.read) {
            row.style.backgroundColor = 'rgba(207, 46, 154, 0.1)';
            row.style.borderLeft = '4px solid rgb(207, 46, 154)';
        }
        
        // Format timestamp
        const timestamp = new Date(notification.timestamp);
        const dateStr = timestamp.toLocaleDateString();
        const timeStr = timestamp.toLocaleTimeString();
        const timeAgo = getTimeAgo(timestamp);
        
        // Create description with event details
        let description = notification.message;
        
        if (notification.eventData) {
            description = `
                <div style="margin-bottom: 10px; color: #fff;">${notification.message}</div>
                <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 5px; font-size: 13px;">
                    <div style="margin: 5px 0;"><strong>📍 Venue:</strong> ${notification.eventData.venue}</div>
                    <div style="margin: 5px 0;"><strong>⏰ Time:</strong> ${notification.eventData.time}</div>
                    ${notification.eventData.guestPerson ? `<div style="margin: 5px 0;"><strong>👤 Guest:</strong> ${notification.eventData.guestPerson}</div>` : ''}
                    <div style="margin: 5px 0;"><strong>📚 Year:</strong> ${notification.eventData.yearOfStudy} | <strong>Section:</strong> ${notification.eventData.section}</div>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #888;">
                    ${timeAgo} • ${dateStr} ${timeStr}
                </div>
            `;
        }
        
        // Determine icon based on notification type
        let icon = '📢';
        if (notification.type === 'event_verified') icon = '✅';
        if (notification.type === 'registration') icon = '🎟️';
        if (notification.type === 'reminder') icon = '⏰';
        
        row.innerHTML = `
            <td style="padding: 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 32px;">${icon}</span>
                    <strong style="font-size: 16px; color: #fff;">${notification.eventData?.eventName || 'Event Update'}</strong>
                </div>
            </td>
            <td style="padding: 20px; color: #fff;">
                ${dateStr}
            </td>
            <td style="padding: 20px; color: #ddd;">
                ${description}
            </td>
        `;
        
        // Add click to mark as read
        if (!notification.read) {
            row.style.cursor = 'pointer';
            row.title = 'Click to mark as read';
            row.addEventListener('click', function() {
                markAsRead(notification.id);
            });
        }
        
        tableBody.appendChild(row);
    });
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

function markAsRead(notificationId) {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications = notifications.map(notif => {
        if (notif.id === notificationId) {
            notif.read = true;
        }
        return notif;
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    console.log('Notification marked as read:', notificationId);
    
    // Reload notifications
    loadNotifications();
}

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
    
    .notification-table tbody tr {
        transition: all 0.3s ease;
    }
    
    .notification-table tbody tr:hover {
        background-color: rgba(207, 46, 154, 0.15) !important;
        transform: translateX(5px);
    }
`;
document.head.appendChild(style);

// Refresh notifications every 10 seconds
setInterval(loadNotifications, 10000);

console.log('Notification.js loaded successfully');