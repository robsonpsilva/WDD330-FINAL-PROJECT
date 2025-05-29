document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const successOverlay = document.getElementById('successOverlay');
    const submitButton = document.getElementById('btnsubmit');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const experience = document.getElementById('experience').value;

        // Construct the URL with the data as parameters
        const thankYouUrl = `./thanks.html?name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&experience=${encodeURIComponent(experience)}`;

        // Simulate successful submission and show the overlay
        document.getElementById('successOverlay').style.display = 'flex';

        // Optionally, you can add code here to actually submit the form data
        // to a server using AJAX or a traditional form submission.

        // Hide the overlay after a few seconds (optional)
        setTimeout(function() {
            document.getElementById('successOverlay').style.display = 'none';
            document.getElementById('registrationForm').reset(); // Clear the form
            // Redirect to the thanks.html page
            window.location.href = thankYouUrl;
        }, 2000);
        
    });

    // The overlay success message logic can be removed or modified
    // as we are now redirecting to a separate page.
});