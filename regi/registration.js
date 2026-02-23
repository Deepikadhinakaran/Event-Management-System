// registration.js

function registerEvent(event) {
    event.preventDefault(); // Prevent form submission

    // Collect form fields
    const eventType = document.getElementById("event-type").value;
    const eventDate = document.getElementById("event-date").value;
    const eventStartTime = document.getElementById("event-start-time").value;
    const eventEndTime = document.getElementById("event-end-time").value;
    const eventVenue = document.getElementById("event-venue").value;
    const eventDescription = document.getElementById("event-description").value;
    const yearOfStudy = document.getElementById("year-of-study").value;
    const section = document.getElementById("section").value;
    const guestPerson = document.getElementById("guest-person").value;
    const guestDesignation = document.getElementById("guest-designation").value;
    const guestAddress = document.getElementById("guest-address").value;
    const topic = document.getElementById("topic").value;

    // Validate only required fields
    if (eventType && eventDate && eventStartTime && eventEndTime && eventVenue && eventDescription && yearOfStudy && topic) {
        // Format the time for display (combining start and end time)
        const timeDisplay = `${eventStartTime} - ${eventEndTime}`;
        
        // Store event details in the format expected by verification page
        const eventData = {
            name: eventType,  // Changed from eventType to name
            date: eventDate,
            time: timeDisplay,  // Combined start and end time
            venue: eventVenue,
            year: yearOfStudy,  // Changed from yearOfStudy to year
            section: section || "N/A",
            guest: guestPerson || "N/A",  // Changed from guestPerson to guest
            guestDesignation: guestDesignation || "N/A",
            guestAddress: guestAddress || "N/A",
            topic: topic,
            description: eventDescription,
            registeredDate: new Date().toISOString()
        };

        // Get existing registered events (using the key the verification page expects)
        let registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || [];
        registeredEvents.push(eventData);
        localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));

        console.log("Event registered:", eventData);
        console.log("Total registered events:", registeredEvents.length);

        // Show confirmation and reset the form
        document.getElementById("confirmation-message").innerHTML = "Event Registered Successfully! Redirecting to verification...";
        document.getElementById("confirmation-message").style.color = "green";
        document.getElementById("event-form").reset();

        // Redirect to the verification page after 2 seconds
        setTimeout(function() {
            window.location.href = "../verification/verification.html";
        }, 2000);
    } else {
        document.getElementById("confirmation-message").innerHTML = "Please fill in all required fields.";
        document.getElementById("confirmation-message").style.color = "red";
    }
}

// Attach event listener to the form
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("event-form")) {
        document.getElementById("event-form").addEventListener("submit", registerEvent);
    }
});