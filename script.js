// Initialisation du slider d'arrière-plan
function initBackgroundSlider() {
    const slides = document.querySelectorAll('.background-slider .slide');
    if (!slides.length) {
        console.error("Aucun slider d'arrière-plan trouvé");
        return;
    }

    let currentIndex = 0;

    // Fonction pour changer de slide
    function changeSlide() {
        // Retirer 'active' du slide actuel
        slides.forEach(slide => slide.classList.remove('active'));

        // Ajouter 'active' au nouveau slide
        slides[currentIndex].classList.add('active');

        // Passer au slide suivant
        currentIndex = (currentIndex + 1) % slides.length;
    }

    // Démarrer avec le premier slide actif
    slides[currentIndex].classList.add('active');

    // Changer de slide toutes les 5 secondes
    setInterval(changeSlide, 5000);
}

// Initialisation du slider d'images
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

// Fonction pour charger les publications depuis le localStorage
function loadPostsFromLocalStorage() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');

    // Effacer le contenu existant
    postsContainer.innerHTML = '';

    // Ajouter les publications au conteneur
    posts.forEach(postHTML => {
        postsContainer.insertAdjacentHTML('beforeend', postHTML);
    });
}

// Fonction pour sauvegarder la publication et rediriger
function savePostAndRedirect(postElement) {
    // Récupérer les publications existantes du localStorage
    let posts = JSON.parse(localStorage.getItem('posts') || '[]');

    // Convertir l'élément en HTML
    const postHTML = postElement.outerHTML;

    // Ajouter la nouvelle publication au début du tableau
    posts.unshift(postHTML);

    // Limiter le nombre de publications pour éviter de dépasser la quota de localStorage
    if (posts.length > 5) {
        posts = posts.slice(0, 5);
    }

    // Essayer de sauvegarder dans le localStorage
    try {
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            // Si nous dépassons la quota, réduire davantage le nombre de publications
            console.warn("Quota de stockage dépassé. Réduction supplémentaire des publications.");
            posts = posts.slice(0, 3);
            try {
                localStorage.setItem('posts', JSON.stringify(posts));
            } catch (e2) {
                // Si cela échoue encore, ne conserver qu'une seule publication
                console.warn("Quota de stockage toujours dépassé. Conservation d'une seule publication.");
                posts = posts.slice(0, 1);
                localStorage.setItem('posts', JSON.stringify(posts));
            }
        } else {
            // Autre erreur
            throw e;
        }
    }

    // Réinitialiser le formulaire
    const form = document.getElementById('new-post-form');
    if (form) {
        form.reset();
    }

    // Rediriger vers la page d'accueil
    window.location.href = 'index.html';
}

// Fonction pour ajouter une nouvelle publication
function setupPostForm() {
    // Gestion de la connexion admin
    const adminLoginForm = document.getElementById('admin-login-form');
    const postFormSection = document.getElementById('post-form-section');
    const adminLoginSection = document.getElementById('admin-login-section');

    // Mot de passe admin (dans un vrai projet, cela devrait être géré côté serveur)
    const ADMIN_PASSWORD = "admin123"; // Vous pouvez changer ce mot de passe

    if (adminLoginForm && !adminLoginForm.dataset.initialized) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const passwordInput = document.getElementById('admin-password');
            const password = passwordInput.value;

            if (password === ADMIN_PASSWORD) {
                // Afficher le formulaire de publication et cacher le formulaire de connexion
                adminLoginSection.style.display = 'none';
                postFormSection.style.display = 'block';
                // Stocker l'état de connexion dans le localStorage
                localStorage.setItem('adminLoggedIn', 'true');
            } else {
                alert('Mot de passe incorrect!');
            }
        });

        // Marquer le formulaire comme initialisé
        adminLoginForm.dataset.initialized = 'true';
    }

    // Vérifier si l'administrateur est déjà connecté
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        if (adminLoginSection) adminLoginSection.style.display = 'none';
        if (postFormSection) postFormSection.style.display = 'block';
    }

    const form = document.getElementById('new-post-form');

    // Ne pas vérifier postsContainer sur la page de publication
    if (!form) {
        console.warn("Formulaire de publication non trouvé");
        return;
    }

    // Vérifier si un écouteur d'événements est déjà attaché
    if (form.dataset.initialized) {
        return;
    }

    // Marquer que l'écouteur d'événements est attaché
    form.dataset.initialized = 'true';

    // Ajouter l'écouteur d'événements pour le formulaire de publication
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
            // Vérifier la taille du fichier (limite à 500KB)
            if (media.size > 512 * 1024) {
                alert("L'image est trop volumineuse. Veuillez sélectionner une image de moins de 500KB.");
                return;
            }

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

                // Sauvegarder la publication dans localStorage et rediriger vers la page d'accueil
                savePostAndRedirect(postCard);
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

            // Sauvegarder la publication dans localStorage et rediriger vers la page d'accueil
            savePostAndRedirect(postCard);
        }
    });
}

// Initialiser quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page chargée, initialisation du slider...");
    initBackgroundSlider();
    initImageSlider();
    setupThemeToggle();

    // Charger les publications sur la page d'accueil
    // Vérifier si nous sommes sur la page d'accueil en vérifiant l'existence de la section accueil
    if (document.getElementById('accueil')) {
        loadPostsFromLocalStorage();
    }

    // Initialiser le formulaire de publication sur la page publish.html
    // Vérifier si nous sommes sur la page de publication
    if (document.getElementById('new-post-form')) {
        // Attendre que le header soit chargé via include.js
        setTimeout(setupPostForm, 100);
    }
});
