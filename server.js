/**
 * Implementazione server REST API per contenuti in evidenza
 * Aeronautica Militare
 * 
 * Per eseguire il server: node server.js
 * Il server si avvierà sulla porta 3000 di default
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per gestire CORS e JSON
app.use(cors());
app.use(express.json());

// Database simulato per i contenuti in evidenza
let featuredContent = [
  {
    id: 1,
    title: "Storia dell'Aeronautica",
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
  },
  {
    id: 4,
    title: "Missioni Internazionali",
    description: "Le operazioni all'estero dell'Aeronautica Militare e il contributo alla NATO.",
    imageUrl: "https://placehold.co/400x250/003399/ffffff?text=Missioni",
    linkUrl: "#missioni"
  }
];

/**
 * Endpoint GET per ottenere tutti i contenuti in evidenza
 * 
 * @route GET /api/featured-content
 * @returns {Object} 200 - Oggetto contenente success e array di contenuti
 */
app.get('/api/featured-content', (req, res) => {
  try {
    // Simula un eventuale ritardo di rete (tra 100ms e 500ms)
    setTimeout(() => {
      // Opzionalmente limita il numero di elementi restituiti
      const limit = req.query.limit ? parseInt(req.query.limit) : featuredContent.length;
      const contentToReturn = featuredContent.slice(0, limit);
      
      res.status(200).json({
        success: true,
        data: contentToReturn
      });
    }, Math.floor(Math.random() * 400) + 100);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Si è verificato un errore durante il recupero dei contenuti',
      error: error.message
    });
  }
});

/**
 * Endpoint GET per ottenere un singolo contenuto in evidenza per ID
 * 
 * @route GET /api/featured-content/:id
 * @param {Number} id - ID del contenuto
 * @returns {Object} 200 - Oggetto contenente success e il contenuto richiesto
 * @returns {Object} 404 - Contenuto non trovato
 */
app.get('/api/featured-content/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = featuredContent.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Contenuto con ID ${id} non trovato`
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Si è verificato un errore durante il recupero del contenuto',
      error: error.message
    });
  }
});

/**
 * Endpoint POST per aggiungere un nuovo contenuto in evidenza
 * (solo per scopi di test e amministrazione)
 * 
 * @route POST /api/featured-content
 * @param {Object} body - Nuovo contenuto da aggiungere
 * @returns {Object} 201 - Oggetto con success e contenuto aggiunto
 */
app.post('/api/featured-content', (req, res) => {
  try {
    const { title, description, imageUrl, linkUrl } = req.body;
    
    // Validazione dei campi obbligatori
    if (!title || !description || !imageUrl || !linkUrl) {
      return res.status(400).json({
        success: false,
        message: 'Tutti i campi sono obbligatori: title, description, imageUrl, linkUrl'
      });
    }
    
    // Genera un nuovo ID
    const newId = Math.max(...featuredContent.map(item => item.id)) + 1;
    
    // Crea il nuovo oggetto
    const newItem = {
      id: newId,
      title,
      description,
      imageUrl,
      linkUrl
    };
    
    // Aggiunge al database simulato
    featuredContent.push(newItem);
    
    res.status(201).json({
      success: true,
      message: 'Contenuto aggiunto con successo',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiunta del contenuto',
      error: error.message
    });
  }
});

/**
 * Endpoint DELETE per rimuovere un contenuto in evidenza per ID
 * (solo per scopi di test e amministrazione)
 * 
 * @route DELETE /api/featured-content/:id
 * @param {Number} id - ID del contenuto da eliminare
 * @returns {Object} 200 - Conferma di eliminazione
 * @returns {Object} 404 - Contenuto non trovato
 */
app.delete('/api/featured-content/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = featuredContent.length;
    
    featuredContent = featuredContent.filter(item => item.id !== id);
    
    if (featuredContent.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: `Contenuto con ID ${id} non trovato`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Contenuto con ID ${id} eliminato con successo`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Si è verificato un errore durante l\'eliminazione del contenuto',
      error: error.message
    });
  }
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server REST API in esecuzione sulla porta ${PORT}`);
  console.log(`Endpoint contenuti in evidenza: http://localhost:${PORT}/api/featured-content`);
});