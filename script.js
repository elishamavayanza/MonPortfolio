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

// Fonction pour initialiser le slider d'images
function initImageSlider() {
    const slides = document.querySelectorAll('.image-slider');
    if (!slides.length) {
        console.error("Aucun slider d'images trouvé");
        return;
    }

    const images = document.querySelectorAll('.slider-image');
    if (images.length < 2) {
        console.warn("Moins de 2 images trouvées, le slider ne fonctionnera pas correctement");
        return;
    }

    let currentIndex = 0;

    // Fonction pour changer l'image active
    function changeImage() {
        // Retirer 'active' de l'image actuelle
        images.forEach(image => image.classList.remove('active'));

        // Ajouter 'active' à la nouvelle image
        images[currentIndex].classList.add('active');

        // Passer à l'image suivante
        currentIndex = (currentIndex + 1) % images.length;
    }

    // Démarrer avec la première image active
    images[currentIndex].classList.add('active');

    // Changer d'image toutes les 7 secondes
    setInterval(changeImage, 7000);
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

// Fonction pour ajouter une nouvelle publication
function setupPostForm() {
    const form = document.getElementById('new-post-form');
    const postsContainer = document.getElementById('posts-container');

    if (!form || !postsContainer) {
        console.warn("Formulaire de publication ou conteneur non trouvé");
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const content = document.getElementById('post-content').value;
        const media = document.getElementById('post-media').files[0];

        if (!content.trim()) {
            alert("Veuillez entrer du contenu pour votre publication");
            return;
        }

        // Créer une nouvelle publication
        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        // Obtenir la date actuelle
        const now = new Date();
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const dateStr = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();

        // Ajouter la date
        const postDate = document.createElement('div');
        postDate.className = 'post-date';
        postDate.textContent = dateStr;
        postCard.appendChild(postDate);

        // Ajouter l'image si elle existe
        if (media) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const postImage = document.createElement('div');
                postImage.className = 'post-image';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = "Publication utilisateur";
                postImage.appendChild(img);
                postCard.appendChild(postImage);

                // Ajouter le contenu
                const postContent = document.createElement('div');
                postContent.className = 'post-content';
                const contentPara = document.createElement('p');
                contentPara.textContent = content;
                postContent.appendChild(contentPara);
                postCard.appendChild(postContent);

                // Ajouter la publication en haut de la liste
                postsContainer.insertBefore(postCard, postsContainer.firstChild);

                // Réinitialiser le formulaire
                form.reset();
            };
            reader.readAsDataURL(media);
        } else {
            // Publication texte uniquement
            postCard.classList.add('text-only');

            // Ajouter le contenu
            const postContent = document.createElement('div');
            postContent.className = 'post-content';
            const contentPara = document.createElement('p');
            contentPara.textContent = content;
            postContent.appendChild(contentPara);
            postCard.appendChild(postContent);

            // Ajouter la publication en haut de la liste
            postsContainer.insertBefore(postCard, postsContainer.firstChild);

            // Réinitialiser le formulaire
            form.reset();
        }
    });
}

// Initialiser quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page chargée, initialisation du slider...");
    initBackgroundSlider();
    initImageSlider();
    setupThemeToggle();
    setupPostForm();
});
