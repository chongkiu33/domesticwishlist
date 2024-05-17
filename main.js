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

document.getElementById('bigdiv').addEventListener('scroll', function() {
    const visualContainer = document.getElementById('visualContainer');
    const homepageSection = document.getElementById('homepage');

    const rect = homepageSection.getBoundingClientRect();
    const contentRect = this.getBoundingClientRect();

    if (rect.top >= contentRect.top && rect.bottom <= contentRect.bottom) {
        visualContainer.style.display = 'block';
    } else {
        visualContainer.style.display = 'none';
    }
});