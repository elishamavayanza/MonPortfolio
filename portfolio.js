// Données des projets du portfolio
const portfolioData = {
    1: {
        title: "Site E-commerce",
        category: "Développement Web",
        description: "Plateforme e-commerce complète avec système de paiement et gestion de produits.",
        details: "Ce projet a été développé pour une entreprise de vente en ligne. Il comprend un système de gestion de produits avancé, un panier d'achat intelligent, un système de paiement sécurisé et une interface administrateur complète.",
        technologies: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
        image: "image/image1.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    2: {
        title: "Application Fitness",
        category: "Applications Mobiles",
        description: "Application de suivi d'activité physique avec tableau de bord personnalisé.",
        details: "Cette application mobile permet aux utilisateurs de suivre leurs activités physiques quotidiennes, de définir des objectifs et de visualiser leurs progrès grâce à un tableau de bord interactif.",
        technologies: ["React Native", "Firebase", "Redux"],
        image: "image/image2.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    3: {
        title: "Site Corporatif",
        category: "Développement Web",
        description: "Refonte complète du site web d'une entreprise avec intégration CMS.",
        details: "Refonte complète du site web d'une entreprise avec intégration d'un système de gestion de contenu (CMS) personnalisé permettant à l'entreprise de mettre à jour facilement son contenu.",
        technologies: ["HTML5", "CSS3", "JavaScript", "WordPress", "PHP"],
        image: "image/image3.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    4: {
        title: "Application de Gestion",
        category: "Développement Web",
        description: "Système de gestion complète pour une entreprise avec reporting en temps réel.",
        details: "Application web complète de gestion d'entreprise avec modules RH, finances, inventaire et reporting en temps réel. Interface administrateur complète avec droits d'accès différenciés.",
        technologies: ["Vue.js", "Node.js", "Express", "MongoDB"],
        image: "image/image4.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    5: {
        title: "App de Réservation",
        category: "Applications Mobiles",
        description: "Application mobile de réservation pour hôtels avec système de paiement intégré.",
        details: "Application mobile permettant aux utilisateurs de rechercher, comparer et réserver des chambres d'hôtel. Intègre un système de paiement sécurisé et un système de notation des établissements.",
        technologies: ["Flutter", "Dart", "Firebase", "Stripe API"],
        image: "image/image5.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    6: {
        title: "Logiciel de Comptabilité",
        category: "Applications Desktop",
        description: "Logiciel desktop pour la gestion comptable d'une PME avec reporting avancé.",
        details: "Logiciel desktop conçu pour la gestion comptable des PME. Inclut des fonctionnalités de facturation, de gestion des dépenses, de génération de rapports et d'analyses financières.",
        technologies: ["Electron", "React", "Node.js", "SQLite"],
        image: "image/image6.png",
        liveUrl: "#",
        githubUrl: "#"
    }
};

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les fonctionnalités du portfolio
    initPortfolio();
});

function initPortfolio() {
    // Initialiser le filtrage
    initFiltering();

    // Initialiser la modale
    initModal();

    // Ajouter des animations aux éléments du portfolio
    initAnimations();
}

function initFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filtrer les éléments
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function initModal() {
    const modal = document.getElementById('portfolio-modal');
    const viewProjectBtns = document.querySelectorAll('.view-project');
    const closeBtn = document.querySelector('.modal-content .close');

    // Ouvrir la modale
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectId = this.getAttribute('data-id');
            openModal(projectId);
        });
    });

    // Fermer la modale avec le bouton X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Fermer la modale en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fermer la modale avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openModal(projectId) {
    const project = portfolioData[projectId];
    const modal = document.getElementById('portfolio-modal');
    const modalBody = document.getElementById('modal-body');

    if (project && modal && modalBody) {
        modalBody.innerHTML = `
            <div class="project-detail">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <span class="category">${project.category}</span>
                    <p class="description">${project.description}</p>
                    <p class="details">${project.details}</p>
                    <div class="technologies">
                        <h4>Technologies utilisées :</h4>
                        <ul>
                            ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="project-links">
                        <a href="${project.liveUrl}" class="btn" target="_blank">Voir le projet</a>
                        <a href="${project.githubUrl}" class="btn" target="_blank">Code source</a>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.classList.add('no-scroll');
    }
}

function closeModal() {
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }, 400);
    }
}

function initAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Ajouter une animation d'entrée pour les éléments du portfolio
    portfolioItems.forEach((item, index) => {
        // Délai progressif pour chaque élément
        item.style.transitionDelay = `${index * 0.1}s`;
        item.classList.add('fade-in-up');
    });

    // Observer les éléments lors du défilement
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    portfolioItems.forEach(item => {
        observer.observe(item);
    });
}
