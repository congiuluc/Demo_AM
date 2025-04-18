/**
 * Aeronautica Militare - Caricamento dinamico delle card in evidenza
 * 
 * Questo script si occupa di:
 * 1. Effettuare una chiamata AJAX alla REST API per ottenere i contenuti in evidenza
 * 2. Generare dinamicamente le card nella sezione "In Evidenza"
 * 3. Gestire errori e stati di caricamento
 */

document.addEventListener('DOMContentLoaded', () => {
    // URL della REST API (sostituire con l'URL effettivo)
    const apiUrl = 'https://api.aeronautica.difesa.it/featured-content';
    
    // Elemento container dove inserire le card
    const featuredCardsContainer = document.getElementById('featured-cards-container');
    
    // Funzione per caricare i contenuti in evidenza
    function loadFeaturedContent() {
        // Mostro il loader
        featuredCardsContainer.innerHTML = `
            <div class="col-md-12 text-center">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Caricamento contenuti...</span>
                </div>
            </div>
        `;
        
        // Simulo una chiamata API utilizzando fetch (in un ambiente reale questo sarebbe un effettivo endpoint API)
        // Utilizzo setTimeout per simulare il tempo di risposta della rete
        setTimeout(() => {
            // Simuliamo una risposta API con dati di esempio
            // In un ambiente reale, useremmo fetch() per chiamare l'API effettiva
            const mockApiResponse = {
                success: true,
                data: [
                    {
                        id: 1,
                        title: "Storia dell'Aeronautica Militare",
                        description: "Scopri la storia dell'Aeronautica Militare dalla sua fondazione ai giorni nostri.",
                        imageUrl: "https://placehold.co/400x250/003399/ffffff?text=Storia",
                        linkUrl: "#storia"
                    },
                    {
                        id: 2,
                        title: "Video Gallery",
                        description: "La nostra raccolta di video sulle operazioni e le attività dell'Aeronautica.",
                        imageUrl: "https://placehold.co/400x250/003399/ffffff?text=Video",
                        linkUrl: "#video"
                    },
                    {
                        id: 3,
                        title: "Tecnologia e Innovazione",
                        description: "L'evoluzione tecnologica e i nuovi sistemi in dotazione alla forza armata.",
                        imageUrl: "https://placehold.co/400x250/003399/ffffff?text=Tecnologia",
                        linkUrl: "#tecnologia"
                    }
                ]
            };
            
            // Processo i dati della risposta
            processApiResponse(mockApiResponse);
            
        }, 1500); // Simulo un ritardo di 1.5 secondi per mostrare il loader
    }
    
    // Funzione per processare la risposta API
    function processApiResponse(response) {
        // Pulisco il container
        featuredCardsContainer.innerHTML = '';
        
        if (response.success && response.data && response.data.length > 0) {
            // Genero le card per ciascun elemento nei dati
            response.data.forEach(item => {
                const cardHtml = createCardHtml(item);
                featuredCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        } else {
            // Mostro un messaggio di errore
            showErrorMessage('Non è stato possibile caricare i contenuti in evidenza.');
        }
    }
    
    // Funzione per creare l'HTML di una singola card
    function createCardHtml(item) {
        return `
            <div class="col-md-4 mb-4">
                <div class="feature-card">
                    <div class="feature-image">
                        <img src="${item.imageUrl}" alt="${item.title}" class="img-fluid">
                    </div>
                    <div class="feature-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <a href="${item.linkUrl}" class="read-more">Esplora <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Funzione per mostrare un messaggio di errore
    function showErrorMessage(message) {
        featuredCardsContainer.innerHTML = `
            <div class="col-md-12">
                <div class="api-error-message">
                    <p><i class="fas fa-exclamation-triangle"></i> ${message}</p>
                    <button class="retry-button" onclick="loadFeaturedContent()">
                        <i class="fas fa-sync-alt"></i> Riprova
                    </button>
                </div>
            </div>
        `;
    }
    
    // Inizia il caricamento dei contenuti in evidenza
    loadFeaturedContent();
    
    // Espongo la funzione di caricamento nell'oggetto window per poterla richiamare dal pulsante di retry
    window.loadFeaturedContent = loadFeaturedContent;
});