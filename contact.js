// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // Initialiser EmailJS avec votre User ID
    emailjs.init("S8Bqf-etacOsofoWL"); // Remplacer par votre User ID EmailJS

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

            // Envoyer le message via EmailJS
            sendEmail(name, email, subject, message);
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

// Fonction pour envoyer l'e-mail via EmailJS
function sendEmail(name, subject, email, message) {
    const formMessage = document.getElementById('formMessage');

    // Désactiver le bouton pendant l'envoi
    const submitButton = document.querySelector('#contactForm .btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;

    // Paramètres de l'e-mail - CORRIGÉ selon votre template EmailJS
    const templateParams = {
        name: name,        // Doit correspondre au nom dans votre template EmailJS
        subject: subject,  // Doit correspondre au nom dans votre template EmailJS
        email: email,      // Doit correspondre au nom dans votre template EmailJS
        message: message,  // Doit correspondre au nom dans votre template EmailJS
        to_email: "vayanzaelishama@gmail.com"
    };

    // Envoyer l'e-mail via EmailJS - CORRIGÉ
    emailjs.send("service_97oceub", "template_g6mab0e", templateParams)
        .then(function(response) {
            // Réactiver le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Afficher un message de succès
            showMessage(formMessage, 'Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.', 'success');

            // Réinitialiser le formulaire
            document.getElementById('contactForm').reset();

            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            // Réactiver le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Afficher un message d'erreur
            showMessage(formMessage, 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.', 'error');

            console.log('FAILED...', error);
        });
}
