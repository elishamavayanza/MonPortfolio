document.addEventListener("DOMContentLoaded", function() {
    // Charger le header
    fetch("header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Header non trouvé");
            }
            return response.text();
        })
        .then(data => {
            // Insérer le header au début du body
            document.body.insertAdjacentHTML("afterbegin", data);

            // Initialiser le toggle de thème après le chargement du header
            initThemeToggle();

            // Mettre en évidence le lien actif dans la navigation
            setActiveNavLink();

            // Initialiser le menu mobile après le chargement du header
            initMobileMenu();
        })
        .catch(error => {
            console.error("Erreur lors du chargement du header:", error);
        });

    // Charger le footer
    fetch("footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Footer non trouvé");
            }
            return response.text();
        })
        .then(data => {
            // Insérer le footer avant la fin du body
            document.body.insertAdjacentHTML("beforeend", data);
        })
        .catch(error => {
            console.error("Erreur lors du chargement du footer:", error);
        });

    // Fonction pour initialiser le toggle de thème
    function initThemeToggle() {
        const themeToggle = document.getElementById("theme-toggle");
        const body = document.body;

        if (!themeToggle) return;

        // Vérifier le thème sauvegardé ou la préférence système
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark-mode" || (!savedTheme && systemPrefersDark)) {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            themeToggle.textContent = "☀️";
        } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            themeToggle.textContent = "🌙";
        }

        // Gérer le clic sur le bouton de thème
        themeToggle.addEventListener("click", function() {
            if (body.classList.contains("light-mode")) {
                body.classList.replace("light-mode", "dark-mode");
                themeToggle.textContent = "☀️";
                localStorage.setItem("theme", "dark-mode");
            } else {
                body.classList.replace("dark-mode", "light-mode");
                themeToggle.textContent = "🌙";
                localStorage.setItem("theme", "light-mode");
            }
        });
    }

    // Fonction pour mettre en évidence le lien de navigation actif
    function setActiveNavLink() {
        // Récupérer le nom du fichier de la page actuelle
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Sélectionner tous les liens de navigation
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

        // Parcourir les liens et ajouter la classe 'active' au lien correspondant
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');

            // Vérifier si le lien correspond à la page actuelle
            if (linkHref === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Fonction pour initialiser le menu mobile
    function initMobileMenu() {
        // Utiliser un délai pour s'assurer que le DOM est complètement chargé
        setTimeout(() => {
            const menuToggle = document.getElementById("menu-toggle");
            const mobileMenu = document.getElementById("mobile-menu");

            if (!menuToggle || !mobileMenu) {
                console.error("Éléments du menu mobile non trouvés");
                return;
            }

            // Utiliser l'overlay existant au lieu d'en créer un nouveau
            const menuOverlay = document.getElementById("menu-overlay");

            if (!menuOverlay) {
                console.error("Overlay du menu mobile non trouvé");
                return;
            }

            // Gérer l'ouverture/fermeture du menu
            menuToggle.addEventListener("click", function() {
                mobileMenu.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });

            // Fermer le menu quand on clique sur l'overlay
            menuOverlay.addEventListener("click", function() {
                mobileMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });

            // Gérer les clics sur les liens du menu mobile
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Fermer le menu
                    mobileMenu.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            });
        }, 100);
    }

});