document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);

    const name = urlParams.get('name');
    const address = urlParams.get('address');
    const phone = urlParams.get('phone');
    const email = urlParams.get('email');
    const experience = urlParams.get('experience');

    const thankYouName = document.getElementById('thank-you-name');
    const thankYouNameDetail = document.getElementById('thank-you-name-detail');
    const thankYouAddress = document.getElementById('thank-you-address');
    const thankYouPhone = document.getElementById('thank-you-phone');
    const thankYouEmail = document.getElementById('thank-you-email');
    const thankYouExperience = document.getElementById('thank-you-experience');

    if (thankYouName) {
        thankYouName.textContent = name || 'Guest'; // Default to 'Guest' if name is not available
    }
    if (thankYouNameDetail) {
        thankYouNameDetail.textContent = name || 'N/A';
    }
    if (thankYouAddress) {
        thankYouAddress.textContent = address || 'N/A';
    }
    if (thankYouPhone) {
        thankYouPhone.textContent = phone || 'N/A';
    }
    if (thankYouEmail) {
        thankYouEmail.textContent = email || 'N/A';
    }
    if (thankYouExperience) {
        thankYouExperience.textContent = experience ? experience.charAt(0).toUpperCase() + experience.slice(1) : 'N/A'; // Capitalize the first letter
    }
});