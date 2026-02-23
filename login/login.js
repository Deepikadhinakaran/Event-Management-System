// login.js - Complete Login and Navigation System

// ============================================
// PART 1: LOGIN FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Only run login modal code if we're on the login page
    if (document.getElementById('student-login-btn')) {
        initializeLoginPage();
    } else {
        // We're on another page, initialize navigation
        initializeNavigation();
    }
});

function initializeLoginPage() {
    // Get modal elements
    const staffModal = document.getElementById('staff-modal');
    const hodModal = document.getElementById('hod-modal');
    const studentModal = document.getElementById('student-modal');
    
    // Get login button elements
    const studentLoginBtn = document.getElementById('student-login-btn');
    const staffLoginBtn = document.getElementById('staff-login-btn');
    const hodLoginBtn = document.getElementById('hod-login-btn');
    
    // Add click event listeners to open modals
    if (studentLoginBtn) {
        studentLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (studentModal) studentModal.style.display = 'block';
        });
    }
    
    if (staffLoginBtn) {
        staffLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (staffModal) staffModal.style.display = 'block';
        });
    }
    
    if (hodLoginBtn) {
        hodLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (hodModal) hodModal.style.display = 'block';
        });
    }
    
    // Get close buttons
    const closeButtons = document.querySelectorAll('.close');
    
    // Close modals when clicking the X button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (staffModal) staffModal.style.display = 'none';
            if (hodModal) hodModal.style.display = 'none';
            if (studentModal) studentModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (staffModal && event.target === staffModal) staffModal.style.display = 'none';
        if (hodModal && event.target === hodModal) hodModal.style.display = 'none';
        if (studentModal && event.target === studentModal) studentModal.style.display = 'none';
    });
    
    // Staff Login Form Handler
    const staffForm = document.getElementById('staff-login-form');
    if (staffForm) {
        staffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('staff-username').value.trim();
            const password = document.getElementById('staff-password').value;
            
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }
            
            if (authenticateUser(username, password, 'staff')) {
                sessionStorage.setItem('userRole', 'staff');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('isLoggedIn', 'true');
                
                alert('✅ Staff Login Successful!\n\nAccess: Home, Calendar, Event Registration');
                window.location.href = '../home/home.html';
            } else {
                alert('❌ Invalid username or password for Staff\n\nDefault credentials:\nUsername: staff\nPassword: staff123');
            }
        });
    }
    
    // HOD Login Form Handler
    const hodForm = document.getElementById('hod-login-form');
    if (hodForm) {
        hodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('hod-username').value.trim();
            const password = document.getElementById('hod-password').value;
            
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }
            
            if (authenticateUser(username, password, 'hod')) {
                sessionStorage.setItem('userRole', 'hod');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('isLoggedIn', 'true');
                
                alert('✅ HOD Login Successful!\n\nAccess: Home, Calendar, Verification');
                window.location.href = '../home/home.html';
            } else {
                alert('❌ Invalid username or password for HOD\n\nDefault credentials:\nUsername: hod\nPassword: hod123');
            }
        });
    }
    
    // Student Login Form Handler
    const studentForm = document.getElementById('student-login-form');
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('student-username').value.trim();
            const password = document.getElementById('student-password').value;
            
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }
            
            if (authenticateUser(username, password, 'student')) {
                sessionStorage.setItem('userRole', 'student');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('isLoggedIn', 'true');
                
                alert('✅ Student Login Successful!\n\nAccess: Home, Calendar, Participation, Notification');
                window.location.href = '../home/home.html';
            } else {
                alert('❌ Invalid username or password for Student\n\nDefault credentials:\nUsername: student\nPassword: student123');
            }
        });
    }
    
    // Clear any existing sessions on login page load
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('username');
}

// Authentication function
function authenticateUser(username, password, role) {
    const credentials = {
        staff: { username: 'staff', password: 'staff123' },
        hod: { username: 'hod', password: 'hod123' },
        student: { username: 'student', password: 'student123' }
    };
    
    if (credentials[role]) {
        return username === credentials[role].username && 
               password === credentials[role].password;
    }
    
    return false;
}

// ============================================
// PART 2: ROLE-BASED NAVIGATION
// ============================================

// Navigation configuration for each role
const navigationConfig = {
    hod: [
        { name: 'Home', href: '../home/home.html' },
        { name: 'Event Calendar', href: '../calendar/calendar.html' },
        { name: 'Verification', href: '../verification/verification.html' }
    ],
    student: [
        { name: 'Home', href: '../home/home.html' },
        { name: 'Event Calendar', href: '../calendar/calendar.html' },
        { name: 'Participation', href: '../participation/participation.html' },
        { name: 'Notification', href: '../notification/notification.html' }
    ],
    staff: [
        { name: 'Home', href: '../home/home.html' },
        { name: 'Event Calendar', href: '../calendar/calendar.html' },
        { name: 'Event Registration', href: '../regi/Registration.html' }
    ]
};

function initializeNavigation() {
    checkLoginStatus();
    setupRoleBasedNavigation();
    addLogoutButton();
    checkPageAccess();
}

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (!isLoggedIn && !currentPage.includes('login.html')) {
        alert('Please login first');
        window.location.href = '../login/login.html';
    }
}

// Setup navigation based on user role
function setupRoleBasedNavigation() {
    const userRole = sessionStorage.getItem('userRole');
    const navContainer = document.querySelector('.main');
    
    if (!navContainer || !userRole) {
        return;
    }
    
    // Clear existing navigation
    navContainer.innerHTML = '';
    
    // Get navigation items for this role
    const navItems = navigationConfig[userRole] || [];
    
    // Create navigation links
    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.name;
        
        // Highlight current page
        const currentPath = window.location.pathname;
        const itemPath = item.href.split('/').pop();
        if (currentPath.includes(itemPath)) {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            link.style.fontWeight = 'bold';
        }
        
        navContainer.appendChild(link);
    });
}

// Add logout button to navigation
function addLogoutButton() {
    const navContainer = document.querySelector('.main');
    const username = sessionStorage.getItem('username');
    const userRole = sessionStorage.getItem('userRole');
    
    if (!navContainer) {
        return;
    }
    
    // Create user info and logout section
    const userSection = document.createElement('div');
    userSection.style.cssText = 'margin-left: auto; display: flex; align-items: center; gap: 15px;';
    
    // User info
    const userInfo = document.createElement('span');
    userInfo.textContent = `${username} (${userRole.toUpperCase()})`;
    userInfo.style.cssText = 'color: white; font-size: 14px;';
    
    // Logout button
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.cssText = 'background: rgba(255, 59, 48, 0.8); padding: 8px 15px; border-radius: 5px;';
    logoutBtn.addEventListener('click', handleLogout);
    
    userSection.appendChild(userInfo);
    userSection.appendChild(logoutBtn);
    navContainer.appendChild(userSection);
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('username');
        
        alert('Logged out successfully');
        window.location.href = '../login/login.html';
    }
}

// Check if user has access to current page
function checkPageAccess() {
    const userRole = sessionStorage.getItem('userRole');
    const currentPath = window.location.pathname.toLowerCase();
    
    // Define restricted pages for each role
    const restrictions = {
        hod: ['participation', 'notification', 'registration'],
        student: ['verification', 'registration'],
        staff: ['verification', 'participation', 'notification']
    };
    
    if (userRole && restrictions[userRole]) {
        const blocked = restrictions[userRole].some(page => currentPath.includes(page));
        
        if (blocked) {
            alert('⛔ Access Denied!\n\nYou do not have permission to view this page.');
            window.location.href = '../home/home.html';
        }
    }
}

console.log('Event Management System - Login & Navigation Loaded');
console.log('Default Credentials:');
console.log('Staff - Username: staff, Password: staff123');
console.log('HOD - Username: hod, Password: hod123');
console.log('Student - Username: student, Password: student123');