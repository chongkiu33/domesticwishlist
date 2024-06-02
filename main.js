function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }

    const visualContainer = document.getElementById('visualContainer');

    if (sectionId === 'homepage') {
        visualContainer.style.display = 'block';
    } else {
        visualContainer.style.display = 'none';
    }
}

function checkVisualContainerVisibility() {
    const visualContainer = document.getElementById('visualContainer');
    const homepageSection = document.getElementById('homepage');

    const rect = homepageSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top >= 0 && rect.bottom <= windowHeight) {
        
        visualContainer.style.display = 'block';
    } else {
        
        visualContainer.style.display = 'none';
    }
}

// Listen to clicks on the logo and buttons
document.getElementById('bigdiv').addEventListener('scroll', checkVisualContainerVisibility);
window.addEventListener('scroll', checkVisualContainerVisibility);

// Initial check in case the user starts scrolling immediately
checkVisualContainerVisibility();
