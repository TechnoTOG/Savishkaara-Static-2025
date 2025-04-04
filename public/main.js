

      


function toggleFAQ(id) {
    let answer = document.getElementById(`answer-${id}`);
    let icon = document.getElementById(`icon-${id}`);

    if (answer.classList.contains("hidden")) {
        answer.classList.remove("hidden");
        icon.style.transform = "rotate(180deg)"; // Rotate icon when expanded
    } else {
        answer.classList.add("hidden");
        icon.style.transform = "rotate(0deg)"; // Reset icon rotation when collapsed
    }
}




// Toggle menu function
function toggleMenu() {
    const menu = document.getElementById('menuOverlay');
    menu.classList.toggle('active');
    menu.classList.toggle('hidden');
}

// Close menu when clicking outside
document.getElementById('menuOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMenu();
    }
});

// Close menu when clicking a menu item
function closeMenu() {
    const menu = document.getElementById('menuOverlay');
    menu.classList.add('hidden');
    menu.classList.remove('active');
}

// Smooth Scroll for Menu Items
document.querySelectorAll('.menu-list a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 50,
                behavior: 'smooth'
            });
        }
        closeMenu(); // Close menu after scrolling
    });
});






document.addEventListener('DOMContentLoaded', function() {
  const cardsWrapper = document.getElementById('cardsWrapper');
  const cards = Array.from(document.querySelectorAll('.card'));
  const prevArrow = document.getElementById('prevArrow');
  const nextArrow = document.getElementById('nextArrow');
  let autoScrollInterval;
  const scrollDelay = 2000; // 2 seconds for faster auto-scrolling
  let currentIndex = 0;

  // Initialize carousel positions
  function initializeCarousel() {
    cards.forEach((card, index) => {
      card.dataset.index = index;
      updateCardPosition(card, index - currentIndex);
    });
  }

  // Update card position based on its relative position to currentIndex
  function updateCardPosition(card, relativePos) {
    const totalCards = cards.length;
    const wrappedPos = ((relativePos % totalCards) + totalCards) % totalCards;
    
    card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
    
    if (wrappedPos === 0) {
      card.classList.add('active');
    } else if (wrappedPos === 1 || wrappedPos === totalCards - 1) {
      card.classList.add(wrappedPos === 1 ? 'next' : 'prev');
    } else if (wrappedPos === 2 || wrappedPos === totalCards - 2) {
      card.classList.add(wrappedPos === 2 ? 'far-next' : 'far-prev');
    } else {
      card.classList.add('hidden');
    }
  }

  // Update all cards based on currentIndex
  function updateAllCards() {
    cards.forEach((card, index) => {
      const relativePos = index - currentIndex;
      updateCardPosition(card, relativePos);
    });
  }

  // Move carousel by specified number of positions
  function moveCarousel(offset) {
    const totalCards = cards.length;
    currentIndex = (currentIndex + offset + totalCards) % totalCards;
    updateAllCards();
  }

  // Auto-scroll functionality
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      moveCarousel(1);
    }, scrollDelay);
  }

  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  // Event listeners
  prevArrow.addEventListener('click', () => {
    moveCarousel(-1);
    resetAutoScroll();
  });

  nextArrow.addEventListener('click', () => {
    moveCarousel(1);
    resetAutoScroll();
  });

  // Card click handler
  cardsWrapper.addEventListener('click', function(event) {
    const clickedCard = event.target.closest('.card');
    if (!clickedCard) return;

    const clickedIndex = parseInt(clickedCard.dataset.index);
    const diff = clickedIndex - currentIndex;
    
    // Only update if clicked card is adjacent or active
    if (Math.abs(diff) <= 2 || Math.abs(diff) >= cards.length - 2) {
      moveCarousel(diff);
      resetAutoScroll();
    }
  });

  // Pause auto-scroll on hover
  cardsWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });

  cardsWrapper.addEventListener('mouseleave', () => {
    startAutoScroll();
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  
  cardsWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(autoScrollInterval);
  }, {passive: true});

  cardsWrapper.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (diff > 50) {
      moveCarousel(1); // Swipe left - next
    } else if (diff < -50) {
      moveCarousel(-1); // Swipe right - previous
    }
    
    startAutoScroll();
  }, {passive: true});

  // Initialize
  initializeCarousel();
  startAutoScroll();
});



        function openLink(url) {
          window.open(url, '_blank');
      }
      
      function contactUs() {
          window.location.href = 'mailto:ouremail@gmail.com';
      }
      

      /*----------------------------------------------------
=                  PRELOADER                        =
====================================================*/

// preloader
// Enhanced Preloader with Zoom Effect
document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.getElementById('preloader');
  const logo = document.getElementById('preloader-logo');
  const menuButton = document.querySelector('.menu-button');
  
  // Initial state
  menuButton.style.opacity = '0';
  menuButton.style.pointerEvents = 'none';
  
  // Animation timeline
  setTimeout(() => {
    // Phase 1: Initial appearance (0.5s)
    logo.style.transform = 'scale(0.9)';
    logo.style.opacity = '1';
    
    // Phase 2: Zoom-in after delay (1.5s)
    setTimeout(() => {
      logo.style.transform = 'scale(1.2)';
      logo.style.transition = 'transform 1.2s cubic-bezier(0.2, 0.8, 0.4, 1)';
    }, 1500);
    
  }, 100);

  // Hide after minimum 3.5 seconds
  const minDisplayTime = 3500;
  const startTime = Date.now();
  
  window.addEventListener('load', function() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(minDisplayTime - elapsed, 0);
    
    setTimeout(() => {
      // Final zoom before disappearing
      logo.style.transform = 'scale(1.5)';
      logo.style.opacity = '0';
      logo.style.transition = 'all 0.8s ease-out';
      
      // Hide everything
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('preload-active');
        menuButton.style.opacity = '1';
        menuButton.style.pointerEvents = 'auto';
      }, 800);
    }, remaining);
  });

  // Safety timeout (6 seconds max)
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.classList.remove('preload-active');
      menuButton.style.opacity = '1';
      menuButton.style.pointerEvents = 'auto';
    }
  }, 6000);
});
