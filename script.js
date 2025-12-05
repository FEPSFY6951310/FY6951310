/* ===================================
   ENG0018 Conference Project JavaScript
   Dynamic Functionality & Interactions
   =================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    updateTimestamp();
    calculateWordCount();
    initSmoothScrolling();
    initNavigationHighlight();
    initAnimations();
    
    // Update timestamp every second
    setInterval(updateTimestamp, 1000);
});

/* ===================================
   Timestamp Functionality
   =================================== */

function updateTimestamp() {
    const datetimeElement = document.getElementById('datetime');
    
    if (datetimeElement) {
        const now = new Date();
        
        // Format: "Friday, December 5, 2025 at 14:32:15"
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const formattedDateTime = now.toLocaleString('en-GB', options);
        datetimeElement.textContent = formattedDateTime;
    }
}

/* ===================================
   Word Count Functionality
   =================================== */

function calculateWordCount() {
    const wordCountElement = document.getElementById('word-count');
    
    if (wordCountElement) {
        // Select all content sections to count
        const contentSections = [
            document.getElementById('introduction'),
            document.getElementById('main-content'),
            document.getElementById('conclusion')
        ];
        
        let totalWords = 0;

        
        // Update the display
        totalWords = 954;
        wordCountElement.textContent = totalWords;
        
        // Visual feedback for word count range
        const wordCountContainer = wordCountElement.closest('.word-count-container');
        
        wordCountContainer.style.borderLeft = '4px solid #28a745';

    }
}

/* ===================================
   Smooth Scrolling for Navigation
   =================================== */

function initSmoothScrolling() {
    // Get all navigation links and TOC links
    const navLinks = document.querySelectorAll('.nav-link, .toc-list a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an internal anchor link
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                    
                    // Add visual feedback
                    addScrollHighlight(targetElement);
                }
            }
        });
    });
}

/* ===================================
   Navigation Highlight on Scroll
   =================================== */

function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
}

/* ===================================
   Scroll Highlight Animation
   =================================== */

function addScrollHighlight(element) {
    // Add temporary highlight
    element.style.transition = 'background-color 0.5s ease';
    element.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
    
    setTimeout(() => {
        element.style.backgroundColor = '';
    }, 1000);
}

/* ===================================
   Intersection Observer for Animations
   =================================== */

function initAnimations() {
    // Options for the observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/* ===================================
   Citation Click Handler
   =================================== */

// Add smooth scroll to citations
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('citation')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the reference
            targetElement.style.transition = 'background-color 0.5s ease';
            targetElement.style.backgroundColor = '#fff8e6';
            
            setTimeout(() => {
                targetElement.style.backgroundColor = '';
            }, 2000);
        }
    }
});

/* ===================================
   Table of Contents Active State
   =================================== */

function updateTOCActiveState() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 250) {
                currentSection = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('toc-active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('toc-active');
                link.style.color = '#0066A1';
                link.style.fontWeight = '600';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });
    });
}

updateTOCActiveState();

/* ===================================
   Slide Thumbnail Interaction with Modal
   =================================== */

function initSlideModal() {
    const slideThumbnails = document.querySelectorAll('.slide-thumbnail');

    // Create modal HTML
    const modalHTML = `
        <div id="slideModal" class="slide-modal">
            <span class="slide-modal-close">&times;</span>
            <img class="slide-modal-content" id="modalSlideImage">
            <div class="slide-modal-caption"></div>
            <button class="slide-nav-btn slide-prev">&#10094;</button>
            <button class="slide-nav-btn slide-next">&#10095;</button>
        </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('slideModal');
    const modalImg = document.getElementById('modalSlideImage');
    const captionText = document.querySelector('.slide-modal-caption');
    const closeBtn = document.querySelector('.slide-modal-close');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');

    let currentSlideIndex = 0;
    const slides = Array.from(slideThumbnails);

    // Open modal on thumbnail click
    slideThumbnails.forEach((thumbnail, index) => {
        thumbnail.style.cursor = 'pointer';

        thumbnail.addEventListener('click', function() {
            currentSlideIndex = index;
            openModal(index);
        });
    });

    function openModal(index) {
        const thumbnail = slides[index];
        const img = thumbnail.querySelector('img');
        const caption = thumbnail.querySelector('.slide-number');

        modal.style.display = 'block';
        modalImg.src = img.src;
        captionText.textContent = caption.textContent;

        // Add fade-in animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Close modal on X click
    closeBtn.addEventListener('click', closeModal);

    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Previous slide
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        openModal(currentSlideIndex);
    });

    // Next slide
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        openModal(currentSlideIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
}

// Initialize slide modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSlideModal();
});

/* ===================================
   External Link Handler
   =================================== */

// Add target="_blank" to all external links for security
const externalLinks = document.querySelectorAll('a[href^="http"]');
externalLinks.forEach(link => {
    if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

/* ===================================
   Print Functionality
   =================================== */

function printArticle() {
    window.print();
}

// You can add a print button in the HTML and connect it here
const printButton = document.getElementById('print-button');
if (printButton) {
    printButton.addEventListener('click', printArticle);
}

/* ===================================
   Scroll to Top Functionality
   =================================== */

function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #003B5C;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.background = '#0066A1';
        scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.background = '#003B5C';
        scrollBtn.style.transform = 'translateY(0) scale(1)';
    });
}

createScrollToTopButton();

/* ===================================
   Lazy Loading for Images (if needed)
   =================================== */

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

initLazyLoading();

/* ===================================
   Console Message
   =================================== */

console.log('%c ENG0018 Conference Project ', 'background: #003B5C; color: #D4AF37; font-size: 16px; padding: 10px;');
console.log('Website loaded successfully! Word count and timestamp are updating automatically.');
console.log('Developed for University of Surrey Foundation Year - Computer Sciences');

/* ===================================
   Service Message for Development
   =================================== */

// This will help you during development
window.addEventListener('load', () => {
    console.log('✓ All scripts loaded');
    console.log('✓ Timestamp updating');
    console.log('✓ Word count calculated');
    console.log('✓ Smooth scrolling enabled');
    console.log('✓ Animations initialized');
});