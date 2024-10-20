
//header

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('authtoken');

    if (token) {
        // Token is present, show the logged-in section
        document.querySelector('.not-logged').style.display = 'none';
        document.querySelector('.div-logged').style.display = 'block';
        // window.location.href = '/';

    } else {
        // No token found, show the not-logged-in section
        document.querySelector('.not-logged').style.display = 'block';
        document.querySelector('.div-logged').style.display = 'none';
    }
});

// header Code Ends



$(document).ready(function() {
    // Toggle dropdown on user account or burger icon click
    $('.user-account, .burger-icon').on('click', function() {
        $('.mega-dropdown').toggle(); // Show or hide the dropdown
    });

    // Optionally, hide the dropdown when clicking outside of it
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.user-account, .burger-icon, .mega-dropdown').length) {
            $('.mega-dropdown').hide();
        }
    });
});
