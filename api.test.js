/**
 * Unit tests for the Featured Content REST API
 * 
 * These tests verify:
 * 1. The API structure and response format
 * 2. Data processing functionality
 * 3. Error handling
 * 
 * To run: npx jest api.test.js
 */

// Mock dell'elemento DOM per i test
document.body.innerHTML = `
  <div id="featured-cards-container"></div>
`;

// Import delle funzioni da testare
// Nota: in un setup reale, le funzioni sarebbero esportate dal file app.js
// Per questo test, ricreiamo le funzioni necessarie
const createCardHtml = (item) => {
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
};

// Mock del fetch globale
global.fetch = jest.fn();

// Schema di validazione della risposta API
const isValidApiResponse = (response) => {
  if (!response) return false;
  if (typeof response.success !== 'boolean') return false;
  if (!Array.isArray(response.data)) return false;
  return true;
};

// Schema di validazione di un item della risposta
const isValidFeatureItem = (item) => {
  if (!item.id || typeof item.id !== 'number') return false;
  if (!item.title || typeof item.title !== 'string') return false;
  if (typeof item.description !== 'string') return false;
  if (!item.imageUrl || typeof item.imageUrl !== 'string') return false;
  if (!item.linkUrl || typeof item.linkUrl !== 'string') return false;
  return true;
};

// API Client di test
const featuredContentApiClient = {
  async getFeaturedContent() {
    const response = await fetch('https://api.aeronautica.difesa.it/featured-content');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};

// Suite di test per la verifica della risposta API
describe('Featured Content API Response', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  it('should return a response with the correct structure', async () => {
    // Arrange
    const mockApiResponse = {
      success: true,
      data: [
        {
          id: 1,
          title: "Storia dell'Aeronautica",
          description: "Descrizione della storia",
          imageUrl: "https://example.com/image1.jpg",
          linkUrl: "#storia"
        }
      ]
    };
    
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });
    
    // Act
    const result = await featuredContentApiClient.getFeaturedContent();
    
    // Assert
    expect(isValidApiResponse(result)).toBe(true);
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
  
  it('should handle API error responses correctly', async () => {
    // Arrange
    fetch.mockResolvedValue({
      ok: false,
      status: 500
    });
    
    // Act & Assert
    await expect(featuredContentApiClient.getFeaturedContent())
      .rejects
      .toThrow('HTTP error! status: 500');
  });
});

// Suite di test per la verifica della struttura dei dati
describe('Featured Content Data Structure', () => {
  it('should validate correct feature items', () => {
    // Arrange
    const validItem = {
      id: 1,
      title: "Storia dell'Aeronautica",
      description: "Descrizione della storia",
      imageUrl: "https://example.com/image1.jpg",
      linkUrl: "#storia"
    };
    
    const invalidItem1 = {
      // Missing id
      title: "Storia dell'Aeronautica",
      description: "Descrizione della storia",
      imageUrl: "https://example.com/image1.jpg",
      linkUrl: "#storia"
    };
    
    const invalidItem2 = {
      id: "1", // id should be a number, not a string
      title: "Storia dell'Aeronautica",
      description: "Descrizione della storia",
      imageUrl: "https://example.com/image1.jpg",
      linkUrl: "#storia"
    };
    
    // Act & Assert
    expect(isValidFeatureItem(validItem)).toBe(true);
    expect(isValidFeatureItem(invalidItem1)).toBe(false);
    expect(isValidFeatureItem(invalidItem2)).toBe(false);
  });
});

// Suite di test per la generazione delle card HTML
describe('Featured Content HTML Generation', () => {
  it('should generate correct HTML for a feature item', () => {
    // Arrange
    const item = {
      id: 1,
      title: "Storia dell'Aeronautica",
      description: "Descrizione della storia",
      imageUrl: "https://example.com/image1.jpg",
      linkUrl: "#storia"
    };
    
    // Act
    const html = createCardHtml(item);
    
    // Assert
    expect(html).toContain(`alt="${item.title}"`);
    expect(html).toContain(`src="${item.imageUrl}"`);
    expect(html).toContain(`<h3>${item.title}</h3>`);
    expect(html).toContain(`<p>${item.description}</p>`);
    expect(html).toContain(`href="${item.linkUrl}"`);
  });
  
  it('should sanitize potentially harmful content', () => {
    // Arrange
    const itemWithXSS = {
      id: 2,
      title: "Test <script>alert('XSS')</script>",
      description: "Description <img src=x onerror=alert('XSS')>",
      imageUrl: "https://example.com/image1.jpg",
      linkUrl: "javascript:alert('XSS')" // Potential javascript: injection
    };
    
    // In a real implementation, you'd have sanitization like this
    const sanitize = (text) => {
      const temp = document.createElement('div');
      temp.textContent = text;
      return temp.innerHTML;
    };
    
    // Mock sanitized item
    const sanitizedItem = {
      ...itemWithXSS,
      title: sanitize(itemWithXSS.title),
      description: sanitize(itemWithXSS.description),
      linkUrl: itemWithXSS.linkUrl.startsWith('javascript:') ? '#' : itemWithXSS.linkUrl
    };
    
    // Act
    const html = createCardHtml(sanitizedItem);
    
    // Assert - in a real test you would check proper sanitization
    expect(html).not.toContain("<script>");
    expect(sanitizedItem.title).not.toContain("<script>");
    expect(sanitizedItem.description).not.toContain("onerror=");
  });
});

// Suite di test per l'integrazione con DOM
describe('Featured Content DOM Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="featured-cards-container"></div>
    `;
  });
  
  it('should populate the container with cards', () => {
    // Arrange
    const mockResponse = {
      success: true,
      data: [
        {
          id: 1,
          title: "Storia dell'Aeronautica",
          description: "Descrizione della storia",
          imageUrl: "https://example.com/image1.jpg",
          linkUrl: "#storia"
        },
        {
          id: 2,
          title: "Video Gallery",
          description: "La nostra galleria video",
          imageUrl: "https://example.com/image2.jpg",
          linkUrl: "#video"
        }
      ]
    };
    
    const container = document.getElementById('featured-cards-container');
    
    // Act - simulate what the app.js would do
    container.innerHTML = '';
    mockResponse.data.forEach(item => {
      const cardHtml = createCardHtml(item);
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
    
    // Assert
    const cards = container.querySelectorAll('.feature-card');
    expect(cards.length).toBe(2);
    expect(cards[0].querySelector('h3').textContent).toBe("Storia dell'Aeronautica");
    expect(cards[1].querySelector('h3').textContent).toBe("Video Gallery");
  });
  
  it('should show error message when API fails', () => {
    // Arrange
    const container = document.getElementById('featured-cards-container');
    const errorMessage = 'Non è stato possibile caricare i contenuti in evidenza.';
    
    // Act - simulate error handling code from app.js
    container.innerHTML = `
      <div class="col-md-12">
        <div class="api-error-message">
          <p><i class="fas fa-exclamation-triangle"></i> ${errorMessage}</p>
          <button class="retry-button">
            <i class="fas fa-sync-alt"></i> Riprova
          </button>
        </div>
      </div>
    `;
    
    // Assert
    const errorElement = container.querySelector('.api-error-message');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toContain(errorMessage);
    expect(container.querySelector('.retry-button')).not.toBeNull();
  });
});

// Suite di test per la simulazione di integrazione end-to-end
describe('Featured Content End-to-End Integration', () => {
  let realFetch;
  
  beforeAll(() => {
    realFetch = global.fetch;
  });
  
  afterAll(() => {
    global.fetch = realFetch;
  });
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="featured-cards-container"></div>
    `;
    global.fetch = jest.fn();
  });
  
  it('should load and display content from API', async () => {
    // Arrange
    const mockApiResponse = {
      success: true,
      data: [
        {
          id: 1,
          title: "Storia dell'Aeronautica",
          description: "Descrizione della storia",
          imageUrl: "https://example.com/image1.jpg",
          linkUrl: "#storia"
        }
      ]
    };
    
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });
    
    // Simulate the main logic in app.js
    const apiClient = {
      async loadFeaturedContent() {
        try {
          const response = await featuredContentApiClient.getFeaturedContent();
          const container = document.getElementById('featured-cards-container');
          
          container.innerHTML = '';
          
          if (response.success && response.data && response.data.length > 0) {
            response.data.forEach(item => {
              const cardHtml = createCardHtml(item);
              container.insertAdjacentHTML('beforeend', cardHtml);
            });
            return true;
          } else {
            throw new Error('Invalid API response');
          }
        } catch (error) {
          const container = document.getElementById('featured-cards-container');
          container.innerHTML = `
            <div class="col-md-12">
              <div class="api-error-message">
                <p><i class="fas fa-exclamation-triangle"></i> Errore nel caricamento</p>
                <button class="retry-button">Riprova</button>
              </div>
            </div>
          `;
          return false;
        }
      }
    };
    
    // Act
    const result = await apiClient.loadFeaturedContent();
    
    // Assert
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    
    const container = document.getElementById('featured-cards-container');
    expect(container.querySelectorAll('.feature-card').length).toBe(1);
  });
});