// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupérer les valeurs des champs
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation simple
            if (!name || !email || !subject || !message) {
                showMessage(formMessage, 'Veuillez remplir tous les champs.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage(formMessage, 'Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Simuler l'envoi du message
            // Dans une vraie application, vous feriez un appel API ici
            simulateFormSubmission(name, email, subject, message);
        });
    }
});

// Fonction pour valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour afficher les messages
function showMessage(container, message, type) {
    container.textContent = message;
    container.className = 'form-message ' + type;

    // Effacer le message après 5 secondes
    setTimeout(() => {
        container.textContent = '';
        container.className = 'form-message';
    }, 5000);
}

// Fonction pour simuler l'envoi du formulaire
function simulateFormSubmission(name, email, subject, message) {
    const formMessage = document.getElementById('formMessage');

    // Désactiver le bouton pendant l'envoi
    const submitButton = document.querySelector('.contact-form .btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;

    // Simuler un délai d'envoi
    setTimeout(() => {
        // Réactiver le bouton
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Afficher un message de succès
        showMessage(formMessage, 'Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.', 'success');

        // Réinitialiser le formulaire
        document.getElementById('contactForm').reset();
    }, 2000);
}
