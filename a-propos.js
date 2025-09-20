// Animation des compétences
function animateSkills() {
    const skillLevels = document.querySelectorAll('.skill-level');

    skillLevels.forEach(skill => {
        const width = skill.style.width;
        skill.style.width = '0';

        // Déclencher l'animation après un court délai
        setTimeout(() => {
            skill.style.transition = 'width 2s ease-in-out';
            skill.style.width = width;
        }, 300);
    });
}

// Animation du texte d'introduction
function animateIntroText() {
    const introText = document.querySelector('.about-text');
    if (introText) {
        introText.style.opacity = '0';
        introText.style.transform = 'translateY(20px)';
        introText.style.transition = 'all 1s ease-out';

        setTimeout(() => {
            introText.style.opacity = '1';
            introText.style.transform = 'translateY(0)';
        }, 500);
    }
}

// Effet de machine à écrire pour le titre
function typeWriterEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Animation des sections au défilement
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', function() {
    // Animation des compétences
    animateSkills();

    // Animation du texte d'introduction
    animateIntroText();

    // Effet de machine à écrire pour le titre principal
    const mainTitle = document.querySelector('.section-title');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        typeWriterEffect(mainTitle, originalText, 100);
    }

    // Animations au défilement
    initScrollAnimations();
});
