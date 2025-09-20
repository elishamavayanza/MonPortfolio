// Données des services pour la modale
const serviceDetails = {
    'web-dev': {
        title: 'Développement Web',
        description: 'Je crée des sites web et applications web modernes et performants en utilisant les dernières technologies du marché.',
        features: [
            'Sites web responsives adaptés à tous les écrans',
            'Applications web progressives (PWA)',
            'Intégration avec les CMS (WordPress, Drupal)',
            'Optimisation SEO et performance',
            'Maintenance et mises à jour régulières'
        ],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Node.js', 'PHP', 'MySQL'],
        duration: '2-8 semaines selon la complexité',
        price: 'À partir de 1500€'
    },
    'ui-ux': {
        title: 'Design UI/UX',
        description: 'Je conçois des interfaces utilisateur intuitives et engageantes qui améliorent l\'expérience globale de vos utilisateurs.',
        features: [
            'Recherche utilisateur et analyse des besoins',
            'Wireframing et prototypage interactif',
            'Design d\'interfaces modernes et attractives',
            'Tests d\'utilisabilité et itérations',
            'Systèmes de design et bibliothèques de composants'
        ],
        technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Principle'],
        duration: '1-4 semaines selon le projet',
        price: 'À partir de 800€'
    },
    'mobile': {
        title: 'Applications Mobiles',
        description: 'Je développe des applications mobiles performantes et cross-platform qui fonctionnent sur iOS et Android.',
        features: [
            'Applications natives et hybrides',
            'Interfaces utilisateur intuitives',
            'Intégration avec les API REST',
            'Support des fonctionnalités mobiles (caméra, GPS, etc.)',
            'Publication sur les stores (App Store, Google Play)'
        ],
        technologies: ['React Native', 'Flutter', 'Ionic', 'Swift', 'Kotlin'],
        duration: '4-12 semaines selon la complexité',
        price: 'À partir de 2500€'
    }
};

// Initialisation des fonctionnalités des services
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du slider de témoignages
    initTestimonialSlider();

    // Initialisation des boutons de service
    initServiceButtons();

    // Initialisation de la modale
    initServiceModal();
});

// Initialisation du slider de témoignages
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentIndex = 0;

    if (!testimonials.length || !prevBtn || !nextBtn) return;

    // Fonction pour afficher un témoignage spécifique
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    // Bouton précédent
    prevBtn.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(newIndex);
    });

    // Bouton suivant
    nextBtn.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(newIndex);
    });

    // Changement automatique toutes les 8 secondes
    setInterval(() => {
        const newIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(newIndex);
    }, 8000);
}

// Initialisation des boutons de service
function initServiceButtons() {
    const serviceButtons = document.querySelectorAll('.service-btn');

    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const serviceId = this.getAttribute('data-service');
            openServiceModal(serviceId);
        });
    });
}

// Initialisation de la modale
function initServiceModal() {
    const modal = document.getElementById('service-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    if (!modal || !closeModalBtn) return;

    // Fermer la modale avec le bouton X
    closeModalBtn.addEventListener('click', closeServiceModal);

    // Fermer la modale en cliquant en dehors du contenu
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServiceModal();
        }
    });

    // Fermer la modale avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeServiceModal();
        }
    });
}

// Ouvrir la modale avec les détails du service
function openServiceModal(serviceId) {
    const modal = document.getElementById('service-modal');
    const modalContent = document.getElementById('modal-service-details');
    const service = serviceDetails[serviceId];

    if (!modal || !modalContent || !service) return;

    // Générer le contenu de la modale
    modalContent.innerHTML = `
        <h2>${service.title}</h2>
        <p class="service-description">${service.description}</p>
        
        <div class="service-features">
            <h3>Ce que je propose :</h3>
            <ul>
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="service-technologies">
            <h3>Technologies utilisées :</h3>
            <div class="tech-tags">
                ${service.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        
        <div class="service-info">
            <div class="info-item">
                <h4>Durée estimée</h4>
                <p>${service.duration}</p>
            </div>
            <div class="info-item">
                <h4>Tarif indicatif</h4>
                <p>${service.price}</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <a href="contact.html" class="btn">Demander un devis</a>
        </div>
    `;

    // Afficher la modale
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

// Fermer la modale
function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Animation des cartes de service au survol
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
});
