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

    // Récupérer les publications du localStorage
    let posts = JSON.parse(localStorage.getItem('posts') || '[]');

    // Filtrer les publications pour ne conserver que celles de moins de 24h
    const now = new Date().getTime();
    posts = posts.filter(postObj => {
        // Vérifier si l'objet post contient une propriété timestamp
        if (postObj.timestamp) {
            const postAge = now - postObj.timestamp;
            // 24 heures en millisecondes
            return postAge < (24 * 60 * 60 * 1000);
        }
        // Si pas de timestamp, conserver l'ancienne logique
        return true;
    });

    // Mettre à jour le localStorage avec les publications filtrées
    localStorage.setItem('posts', JSON.stringify(posts));

    // Effacer le contenu existant
    postsContainer.innerHTML = '';

    // Ajouter les publications au conteneur
    posts.forEach(postObj => {
        // Si c'est un objet avec timestamp, extraire le HTML
        const postHTML = postObj.html !== undefined ? postObj.html : postObj;
        postsContainer.insertAdjacentHTML('beforeend', postHTML);
    });

    // Appliquer la fonctionnalité "voir plus" aux cartes chargées
    applyReadMoreFunctionality();
}

// Fonction pour sauvegarder la publication et rediriger
function savePostAndRedirect(postElement) {
    // Récupérer les publications existantes du localStorage
    let posts = JSON.parse(localStorage.getItem('posts') || '[]');

    // Créer un objet contenant le HTML et le timestamp
    const postObj = {
        html: postElement.outerHTML,
        timestamp: new Date().getTime()
    };

    // Ajouter la nouvelle publication au début du tableau
    posts.unshift(postObj);

    // Limiter le nombre de publications pour éviter de dépasser la quota de localStorage
    if (posts.length > 8) {
        posts = posts.slice(0, 8);
    }

    // Essayer de sauvegarder dans le localStorage
    try {
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            // Si nous dépassons la quota, réduire davantage le nombre de publications
            console.warn("Quota de stockage dépassé. Réduction supplémentaire des publications.");
            posts = posts.slice(0, 5);
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

// Fonction pour gérer le bouton "voir plus" sur les cartes de publication
function applyReadMoreFunctionality() {
    // Sélectionner tous les contenus de publication
    const postContents = document.querySelectorAll('.post-content');

    postContents.forEach(content => {
        // Vérifier si le contenu est trop long
        if (content.scrollHeight > content.clientHeight + 10) {
            // Ajouter la classe collapsed pour masquer le contenu débordant
            content.classList.add('collapsed');

            // Créer le bouton "voir plus"
            const readMoreDiv = document.createElement('div');
            readMoreDiv.className = 'read-more';

            const readMoreBtn = document.createElement('button');

            readMoreDiv.appendChild(readMoreBtn);
            content.appendChild(readMoreDiv);
        }
    });

    // Ajouter la fonctionnalité pour voir le détail complet de la publication
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach((card, index) => {
        // Rendre la carte cliquable
        card.style.cursor = 'pointer';

        card.addEventListener('click', function(e) {
            // Ne pas déclencher si on clique sur le bouton "voir plus"
            if (e.target.classList.contains('read-more-btn')) {
                return;
            }

            // Extraire les données de la publication
            const titleElement = card.querySelector('.post-header h3');
            const dateElement = card.querySelector('.post-date');
            const imageElement = card.querySelector('.post-image img');
            const contentElement = card.querySelector('.post-content');

            // Créer un objet avec les données de la publication
            const postData = {
                title: titleElement ? titleElement.textContent : '',
                date: dateElement ? dateElement.textContent : '',
                image: imageElement ? imageElement.src : null,
                content: contentElement ? contentElement.innerHTML : '' // Utiliser innerHTML pour conserver le formatage Markdown
            };

            // Stocker les données dans localStorage
            localStorage.setItem('currentPost', JSON.stringify(postData));

            // Rediriger vers la page de détail
            window.location.href = 'post-detail.html';
        });
    });
}

/// Fonction pour compresser une image afin de réduire sa taille
function compressImage(file, maxSizeKB = 500, quality = 0.8) {
    return new Promise((resolve, reject) => {
        // Vérifier si le fichier est une image
        if (!file.type.match('image.*')) {
            reject(new Error('Le fichier n\'est pas une image'));
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Créer un canvas pour redimensionner l'image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculer les nouvelles dimensions tout en conservant les proportions
                const maxWidth = 1200;
                const maxHeight = 800;
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                // Définir les dimensions du canvas
                canvas.width = width;
                canvas.height = height;

                // Dessiner l'image redimensionnée sur le canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Essayer différentes qualités pour atteindre la taille souhaitée
                let currentQuality = quality;
                let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

                // Réduire la qualité jusqu'à atteindre la taille maximale souhaitée
                while (dataUrl.length > maxSizeKB * 1024 && currentQuality > 0.1) {
                    currentQuality -= 0.1;
                    dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
                }

                resolve(dataUrl);
            };

            img.onerror = function() {
                reject(new Error('Erreur lors du chargement de l\'image'));
            };

            img.src = event.target.result;
        };

        reader.onerror = function() {
            reject(new Error('Erreur lors de la lecture du fichier'));
        };

        reader.readAsDataURL(file);
    });
}

/// Fonction pour ajouter une nouvelle publication
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

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const media = document.getElementById('post-media').files[0];

        if (!title.trim()) {
            alert("Veuillez entrer un titre pour votre publication");
            return;
        }

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
        const dateStr = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear() + ' à ' +
            String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        // Ajouter la date
        const postDate = document.createElement('div');
        postDate.className = 'post-date';
        postDate.textContent = dateStr;
        postCard.appendChild(postDate);

        // Ajouter le titre
        const postHeader = document.createElement('div');
        postHeader.className = 'post-header';
        const postTitle = document.createElement('h3');
        postTitle.textContent = title;
        postHeader.appendChild(postTitle);
        postCard.appendChild(postHeader);

        // Ajouter l'image si elle existe
        if (media) {
            // Vérifier la taille du fichier (limite à 1,5MB)
            if (media.size > 1.5 * 1024 * 1024) {
                alert("L'image est trop volumineuse. Veuillez sélectionner une image de moins de 1,5MB.");
                return;
            }

            // Compresser l'image avant de la sauvegarder
            compressImage(media)
                .then(compressedImageData => {
                    const postImage = document.createElement('div');
                    postImage.className = 'post-image';
                    const img = document.createElement('img');
                    img.src = compressedImageData;
                    img.alt = "Publication utilisateur";
                    postImage.appendChild(img);
                    postCard.appendChild(postImage);

                    // Ajouter le contenu avec Markdown
                    const postContent = document.createElement('div');
                    postContent.className = 'post-content';
                    postContent.innerHTML = marked.parse(content);
                    postCard.appendChild(postContent);

                    // Sauvegarder la publication dans localStorage et rediriger vers la page d'accueil
                    savePostAndRedirect(postCard);
                })
                .catch(error => {
                    console.error("Erreur lors de la compression de l'image:", error);
                    alert("Erreur lors du traitement de l'image. Veuillez réessayer.");
                });
        } else {
            // Publication texte uniquement
            postCard.classList.add('text-only');

            // Ajouter le contenu avec prise en charge du Markdown
            const postContent = document.createElement('div');
            postContent.className = 'post-content';
            postContent.innerHTML = marked.parse(content);
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

    // Gestion de l'affichage des images sur la page de détail
    // Vérifier que nous ne sommes pas sur la page post-detail.html pour éviter les doublons
    if (document.getElementById('post-detail-image') && !window.location.pathname.includes('post-detail.html')) {
        const imageContainer = document.getElementById('post-detail-image');
        // Récupérer les données de la publication depuis localStorage
        const postData = JSON.parse(localStorage.getItem('currentPost') || '{}');

        if (postData.image) {
            const img = document.createElement('img');
            img.src = postData.image;
            img.alt = postData.title;

            // Ajout d'une gestion d'erreur pour les images lourdes
            img.onload = function() {
                // Vérifier les dimensions de l'image et ajouter une classe si elle est trop grande
                if (img.naturalWidth > 2000 || img.naturalHeight > 1500) {
                    img.classList.add('large-image');
                    // Ajouter un avertissement
                    const warning = document.createElement('div');
                    warning.className = 'image-warning';
                    warning.textContent = 'Cette image est très grande et peut affecter les performances.';
                    imageContainer.appendChild(warning);
                }
            };

            // Gestion des erreurs de chargement
            img.onerror = function() {
                imageContainer.innerHTML = '<div class="image-error">Erreur de chargement de l\'image</div>';
            };

            imageContainer.appendChild(img);
        } else {
            imageContainer.innerHTML = '<div class="no-image">Aucune image pour cette publication</div>';
        }
    }

    // Gestion du formulaire de newsletter dans le footer
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const messageDiv = document.getElementById('newsletter-message');
            const email = emailInput.value.trim();

            // Validation simple de l'email
            if (email && email.includes('@') && email.includes('.')) {
                // Simuler l'abonnement (dans une vraie application, cela enverrait une requête au serveur)
                messageDiv.textContent = 'Merci pour votre abonnement !';
                messageDiv.style.color = '#2ecc71';
                emailInput.value = '';

                // Enregistrer l'email dans localStorage (à des fins de démonstration)
                let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                }
            } else {
                messageDiv.textContent = 'Veuillez entrer une adresse email valide.';
                messageDiv.style.color = '#e74c3c';
            }

            // Effacer le message après 5 secondes
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 5000);
        });
    }
});