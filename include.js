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
        const navLinks = document.querySelectorAll('.nav-links a');

        // Parcourir les liens et ajouter la classe 'active' au lien correspondant
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');

            // Vérifier si le lien correspond à la page actuelle
            if (linkHref === currentPage) {
                link.classList.add('active');
            }
        });
    }

});
