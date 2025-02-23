(() => {
    const STORAGE_KEY = 'product_carousel';
    const FAVORITES_KEY = 'product_favorites';
  
    const init = async () => {
      if (!document.querySelector('.product-detail')) return;
  
      injectStyles();
      
      let products = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!products) {
        products = await fetchProducts();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      }
  
      createCarousel(products);
      setupEventListeners();
    };
  
    const injectStyles = () => {
      const styles = `
        .custom-carousel {
          max-width: 1440px;
          margin: 40px auto;
          padding: 0 40px;
        }
  
        .custom-carousel h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 32px;
          text-align: left;
          padding: 0 20px;
        }
  
        .carousel-wrapper {
          position: relative;
          padding: 10px 0;
        }
  
        .carousel-container {
          overflow: hidden;
          margin: 0 50px;
        }
  
        .carousel-track {
          display: flex;
          gap: 24px;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
  
        .product-card {
          flex: 0 0 calc(100% / 6.5);
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          cursor: pointer;
        }
  
        .product-image-container {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
        }
  
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
  
        .heart-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: white;
          border-radius: 10%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 2;
        }
  
        .heart-button svg {
          width: 20px;
          height: 20px;
          stroke: #666;
        }
  
        .heart-button.active svg {
          stroke: #2563eb;
          fill: #2563eb;
        }
  
        .product-info {
          padding: 20px;
        }
  
        .product-name {
          font-size: 14px;
          color: #1a1a1a;
          margin-bottom: 12px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 40px;
        }
  
        .product-price {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
        }
  
        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
  
        .carousel-button.prev {
          left: -22px;
        }
  
        .carousel-button.next {
          right: -22px;
        }
  
        .carousel-button svg {
          width: 24px;
          height: 24px;
          stroke: #1a1a1a;
          stroke-width: 2;
        }
  
        @media (max-width: 1200px) {
          .product-card {
            flex: 0 0 calc(100% / 4.5);
          }
        }
  
        @media (max-width: 768px) {
          .product-card {
            flex: 0 0 calc(100% / 2.5);
          }
          .custom-carousel {
            padding: 0 20px;
          }
        }
  
        @media (max-width: 480px) {
          .product-card {
            flex: 0 0 calc(100% / 1.5);
          }
        }
      `;
  
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    };
  
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json');
        return await response.json();
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    };
  
    const createCarousel = (products) => {
      const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
      const carousel = document.createElement('div');
      carousel.className = 'custom-carousel';
      
      carousel.innerHTML = `
        <h2>You Might Also Like</h2>
        <div class="carousel-wrapper">
          <button class="carousel-button prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="carousel-container">
            <div class="carousel-track">
              ${products.map(product => `
                <div class="product-card" data-url="${product.url}">
                  <div class="product-image-container">
                    <img 
                      class="product-image" 
                      src="${product.img}" 
                      alt="${product.name}"
                      loading="lazy"
                    >
                    <div class="heart-button ${favorites[product.id] ? 'active' : ''}" data-id="${product.id}">
                      <svg viewBox="0 0 24 24" fill="${favorites[product.id] ? '#2563eb' : 'none'}" stroke="${favorites[product.id] ? '#2563eb' : '#666'}">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </div>
                  </div>
                  <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
  
          <button class="carousel-button next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      `;
  
      document.querySelector('.product-detail').appendChild(carousel);
    };
  
    const setupEventListeners = () => {
      const track = document.querySelector('.carousel-track');
      const prevButton = document.querySelector('.carousel-button.prev');
      const nextButton = document.querySelector('.carousel-button.next');
      let currentIndex = 0;
  
      // Product card click handler
      document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.heart-button')) {
            const url = card.dataset.url;
            window.open(url, '_blank');
          }
        });
      });
  
      // Favorite button click handler
      document.querySelectorAll('.heart-button').forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const productId = button.dataset.id;
          const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
          
          favorites[productId] = !favorites[productId];
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
          
          button.classList.toggle('active');
          const svg = button.querySelector('svg');
          if (favorites[productId]) {
            svg.style.fill = '#2563eb';
            svg.style.stroke = '#2563eb';
          } else {
            svg.style.fill = 'none';
            svg.style.stroke = '#666';
          }
        });
      });
  
      // Slide navigation
      const slide = (direction) => {
        const container = document.querySelector('.carousel-container');
        const itemWidth = document.querySelector('.product-card').offsetWidth;
        const containerWidth = container.offsetWidth;
        const maxIndex = Math.ceil(track.scrollWidth / containerWidth) - 1;
        
        if (direction === 'next' && currentIndex < maxIndex) {
          currentIndex++;
        } else if (direction === 'prev' && currentIndex > 0) {
          currentIndex--;
        }
  
        const translateX = -currentIndex * containerWidth;
        track.style.transform = `translateX(${translateX}px)`;
      };
  
      prevButton.addEventListener('click', () => slide('prev'));
      nextButton.addEventListener('click', () => slide('next'));
  
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') slide('prev');
        if (e.key === 'ArrowRight') slide('next');
      });
  
      // Touch support
      let touchStartX = 0;
      let touchEndX = 0;
  
      track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });
  
      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) {
          slide('next');
        } else if (touchEndX - touchStartX > 50) {
          slide('prev');
        }
      });
    };
  
    init();
  })();