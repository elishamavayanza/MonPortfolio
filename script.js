// Fonction pour initialiser le slider d'arrière-plan - CORRIGÉ
function initBackgroundSlider() {
    const slides = document.querySelectorAll('.background-slider .slide');
    if (!slides.length) {
        console.error("Aucun slide trouvé pour l'arrière-plan");
        return;
    }

    let currentIndex = 0;

    // Fonction pour changer le slide actif
    function changeSlide() {
        // Retirer 'active' du slide actuel
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Ajouter 'active' au nouveau slide actuel
        slides[currentIndex].classList.add('active');
        
        // Passer au slide suivant
        currentIndex = (currentIndex + 1) % slides.length;
    }

    // Démarrer avec le premier slide actif
    slides[currentIndex].classList.add('active');

    // Changer de slide toutes les 5 secondes
    setInterval(changeSlide, 5000);
}

// Gestion du mode sombre/clair
function setupThemeToggle() {
    const themeToggleBtn = document.querySelector('.theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');

            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
    }

    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    }
}

// Initialiser quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page chargée, initialisation du slider...");
    initBackgroundSlider();
    setupThemeToggle();
});