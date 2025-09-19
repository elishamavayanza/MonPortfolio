// Script pour mettre à jour automatiquement les publications selon les actualités récentes

/**
 * Fonction pour récupérer les actualités récentes
 * Utilise l'API NewsAPI pour obtenir de vraies actualités
 */
function fetchLatestNews() {
    const RSS_URL = "https://www.france24.com/fr/rss";
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    return fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.items) {
                return data.items.slice(0, 5).map((item, index) => {
                    return {
                        title: item.title,
                        content: item.description,
                        date: new Date(item.pubDate),
                        image: item.enclosure ? item.enclosure.link : null, // Récupération de l'image
                        link: item.link // Ajout du lien vers l'article original
                    };
                });
            } else {
                return getSimulatedNews();
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des actualités:", error);
            return getSimulatedNews();
        });
}



/**
 * Fonction pour obtenir des actualités simulées en cas d'erreur
 */
function getSimulatedNews() {
    return [
        {
            title: "Nouvelles technologies en développement web",
            content: "Les dernières tendances en développement web montrent une adoption croissante de WebAssembly et des frameworks basés sur les composants. Les développeurs recherchent de plus en plus des solutions performantes et modulables pour leurs applications web modernes.",
            date: new Date(),
            image: "https://picsum.photos/600/400?random=1", // Image simulée
            link: "#" // Lien simulé
        },
        {
            title: "L'IA dans le développement logiciel",
            content: "L'intelligence artificielle commence à transformer la façon dont nous écrivons, testons et déployons nos applications. Des outils comme GitHub Copilot et d'autres assistants IA permettent d'accélérer le développement tout en maintenant une qualité de code élevée.",
            date: new Date(Date.now() - 3600000), // Il y a 1 heure
            image: "https://picsum.photos/600/400?random=2", // Image simulée
            link: "#" // Lien simulé
        },
        {
            title: "Sécurité des applications web",
            content: "De nouvelles vulnérabilités ont été découvertes dans des bibliothèques JavaScript populaires. Mise à jour recommandée de vos dépendances. Les experts en cybersécurité recommandent de vérifier régulièrement les vulnérabilités dans les dépendances de vos projets pour éviter les failles de sécurité.",
            date: new Date(Date.now() - 7200000), // Il y a 2 heures
            image: "https://picsum.photos/600/400?random=3", // Image simulée
            link: "#" // Lien simulé
        }
    ];
}

/**
 * Fonction pour créer une publication à partir d'une actualité
 */
function createPostFromNews(newsItem) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card auto-news';

    // Créer un lien cliquable pour l'ensemble de la carte
    const linkWrapper = document.createElement('div');
    linkWrapper.className = 'post-link-wrapper';
    linkWrapper.style.textDecoration = 'none';
    linkWrapper.style.color = 'inherit';
    linkWrapper.style.display = 'flex';
    linkWrapper.style.flexDirection = 'column';
    linkWrapper.style.height = '100%';

    // Formater la date
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const dateObj = newsItem.date;
    const dateStr = dateObj.getDate() + ' ' + months[dateObj.getMonth()] + ' ' + dateObj.getFullYear() + ' à ' +
        String(dateObj.getHours()).padStart(2, '0') + ':' + String(dateObj.getMinutes()).padStart(2, '0');

    // Ajouter la date
    const postDate = document.createElement('div');
    postDate.className = 'post-date';
    postDate.textContent = dateStr;
    linkWrapper.appendChild(postDate);

    // Ajouter le titre
    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    const postTitle = document.createElement('h3');
    postTitle.textContent = newsItem.title.charAt(0).toUpperCase() + newsItem.title.slice(1); // Majuscule au début
    postHeader.appendChild(postTitle);
    linkWrapper.appendChild(postHeader);

    // Ajouter l'image si elle existe
    if (newsItem.image) {
        const postImage = document.createElement('div');
        postImage.className = 'post-image';
        const img = document.createElement('img');
        img.src = newsItem.image;
        img.alt = newsItem.title;
        img.style.width = '100%';
        img.style.height = '150px';
        img.style.objectFit = 'cover';
        postImage.appendChild(img);
        linkWrapper.appendChild(postImage);
    }

    // Ajouter le contenu
    const postContent = document.createElement('div');
    postContent.className = 'post-content';
    postContent.innerHTML = marked.parse(newsItem.content);
    linkWrapper.appendChild(postContent);

    // Ajouter une étiquette pour indiquer que c'est une actualité automatique
    const autoLabel = document.createElement('div');
    autoLabel.className = 'auto-news-label';
    autoLabel.textContent = 'Actualité';
    linkWrapper.appendChild(autoLabel);

    // Ajouter le lien cliquable autour de toute la carte
    const fullLink = document.createElement('a');
    fullLink.href = newsItem.link;
    fullLink.target = '_blank';
    fullLink.style.textDecoration = 'none';
    fullLink.style.color = 'inherit';
    fullLink.style.display = 'block';
    fullLink.style.height = '100%';

    // Ajouter le lien wrapper à la carte
    fullLink.appendChild(linkWrapper);
    postCard.appendChild(fullLink);

    return postCard;
}

/**
 * Fonction pour mettre à jour les publications avec les dernières actualités
 */
function updatePostsFromNews() {
    fetchLatestNews()
        .then(news => {
            // Récupérer le conteneur des publications
            const postsContainer = document.getElementById('posts-container');
            if (!postsContainer) {
                console.warn("Conteneur de publications non trouvé");
                return;
            }

            // Filtrer les actualités récentes (moins de 24h)
            const recentNews = news.filter(item => {
                const now = new Date().getTime();
                const newsAge = now - item.date.getTime();
                return newsAge < (24 * 60 * 60 * 1000); // 24 heures en millisecondes
            });

            // Ajouter les actualités récentes au début du conteneur
            // En ordre inverse pour que la plus récente soit en premier
            recentNews.reverse().forEach(newsItem => {
                const postElement = createPostFromNews(newsItem);
                postsContainer.insertBefore(postElement, postsContainer.firstChild);
            });

            console.log(`Ajouté ${recentNews.length} actualités automatiques`);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des actualités:", error);
        });
}

/**
 * Fonction pour démarrer la mise à jour automatique
 * Appelle updatePostsFromNews immédiatement, puis toutes les heures
 */
function startAutoUpdate() {
    // Mettre à jour immédiatement
    updatePostsFromNews();

    // Mettre à jour toutes les heures (3600000 ms)
    setInterval(updatePostsFromNews, 3600000);
}

// Démarrer la mise à jour automatique quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page d'accueil
    if (document.getElementById('accueil')) {
        startAutoUpdate();
    }
});
