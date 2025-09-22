// Données des projets du portfolio
const portfolioData = {
    1: {
        title: "AssociationiSoft - Desktop",
        category: "Applications Desktop",
        description: "Application desktop (JavaFX) pour la gestion complète d’associations et communautés.",
        details: "Version desktop de AssociationiSoft, conçue avec JavaFX. Elle permet la gestion des membres, cotisations, dettes, prêts, rôles et permissions, ainsi que l’organisation d’événements et la communication avec les adhérents. Idéale pour une utilisation locale et sécurisée.",
        technologies: ["Java 17+", "JavaFX", "Spring Boot", "Hibernate", "MySQL/SQLite"],
        image: "image/assoc.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    2: {
        title: "AssociationiSoft - Web",
        category: "Développement Web",
        description: "Application web moderne pour gérer n'importe quel type d’association.",
        details: "Version web de AssociationiSoft développée avec React et Spring Boot. Elle offre une interface intuitive et responsive, avec des fonctionnalités de gestion des cotisations, prêts, rôles, événements et communication en ligne. Accessible depuis tout navigateur.",
        technologies: ["React", "Spring Boot 3+", "Spring Data JPA", "Hibernate", "MySQL"],
        image: "image/assoc.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    3: {
        title: "AssociationiSoft - Mobile",
        category: "Applications Mobiles",
        description: "Application mobile (Flutter) pour gérer les contributions et dettes associatives en déplacement.",
        details: "Version mobile de AssociationiSoft, développée avec Flutter. Elle permet aux membres et gestionnaires d’accéder aux informations, de suivre les contributions, dettes et activités, et de recevoir des notifications en temps réel.",
        technologies: ["Flutter", "Dart", "Firebase", "Spring Boot API"],
        image: "image/assoc.png",
        liveUrl: "#",
        githubUrl: "#"
    },
    4: {
        title: "AVECSOFT - Gestion d'Association d'Épargne et Crédit",
        category: "Applications Desktop",
        description: "Application desktop pour la gestion d'une association d'épargne et crédit.",
        details: "AVECSOFT est un logiciel desktop conçu pour faciliter la gestion d'une association d'épargne et crédit. Il permet de gérer les membres, contributions, emprunts, remboursements, rapports financiers et statistiques, tout en offrant une interface intuitive et un suivi en temps réel.",
        technologies: ["Java", "Swing", "MySQL", "Maven"],
        image: "image/avecsoft.png",
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
        // Vérifier si l'écouteur d'événement a déjà été attaché
        if (!btn.dataset.listenerAttached) {
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

            // Marquer le bouton comme ayant un écouteur d'événement attaché
            btn.dataset.listenerAttached = 'true';
        }
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

// Fonction pour filtrer les projets
function filterProjects(category) {
    const projects = document.querySelectorAll('.portfolio-item');

    projects.forEach(project => {
        const projectCategory = project.getAttribute('data-category');

        if (category === 'all' || projectCategory === category) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}
