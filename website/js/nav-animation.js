/**
 * Advanced Navigation Animation System
 * Handles the welding animation for navigation tabs with precise control and performance optimization
 */

class WeldingNavigation {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            navSelector: '.nav-menu',
            activeClass: 'active',
            metalSurfaceHeight: 10,
            weldHandWidth: 70,
            weldHandHeight: 35,
            animationDuration: 600,
            weldingOffset: -15,
            debug: false,
            ...options
        };
        
        // Animation state
        this.state = {
            activeIndex: -1,
            previousIndex: -1,
            isAnimating: false,
            targetElement: null
        };
        
        // Elements
        this.navContainer = null;
        this.navItems = [];
        this.metalSurface = null;
        this.weldingHand = null;
        
        // SVG namespaces
        this.SVG_NS = "http://www.w3.org/2000/svg";
        
        // Initialize
        this.init();
    }
    
    init() {
        // Find navigation container
        this.navContainer = document.querySelector(this.config.navSelector);
        if (!this.navContainer) {
            console.error(`Navigation container not found: ${this.config.navSelector}`);
            return;
        }
        
        // Get all navigation items that are links
        this.navItems = Array.from(this.navContainer.querySelectorAll('a'));
        
        // Find current active item
        this.state.activeIndex = this.navItems.findIndex(item => 
            item.classList.contains(this.config.activeClass)
        );
        
        // Create necessary DOM elements for animation
        this.createAnimationElements();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Position welding elements for initial state
        if (this.state.activeIndex >= 0) {
            this.updateWeldingPosition(this.state.activeIndex, false);
        }
    }
    
    createAnimationElements() {
        // Get the header container
        const headerContainer = this.navContainer.closest('.header-container');
        if (!headerContainer) return;
        
        // Remove existing animation elements
        const existingElements = headerContainer.querySelectorAll('.welding-animation-element');
        existingElements.forEach(el => el.remove());
        
        // Create metal surface element
        this.metalSurface = document.createElement('div');
        this.metalSurface.className = 'metal-surface welding-animation-element';
        this.metalSurface.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${this.config.metalSurfaceHeight}px;
            background-image: url('../images/tab-surface.svg');
            background-size: 100% 100%;
            background-position: center bottom;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 1;
        `;
        headerContainer.appendChild(this.metalSurface);
        
        // Create welding hand container
        this.weldingHand = document.createElement('div');
        this.weldingHand.className = 'welding-hand welding-animation-element';
        this.weldingHand.style.cssText = `
            position: absolute;
            width: ${this.config.weldHandWidth}px;
            height: ${this.config.weldHandHeight}px;
            background-image: url('../images/tab-welder-hand.svg');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center bottom;
            pointer-events: none;
            z-index: 2;
            transition: transform ${this.config.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1);
            transform: translateX(-50%);
            will-change: transform, left;
            backface-visibility: hidden;
            perspective: 1000px;
            filter: drop-shadow(0 0 3px rgba(255, 165, 0, 0.5));
        `;
        headerContainer.appendChild(this.weldingHand);
        
        // Create debug elements if debug is enabled
        if (this.config.debug) {
            const debugStyle = document.createElement('style');
            debugStyle.textContent = `
                .nav-menu a { outline: 1px dashed rgba(255, 0, 0, 0.5) !important; }
                .metal-surface { outline: 1px dashed rgba(0, 255, 255, 0.5) !important; }
                .welding-hand { outline: 1px dashed rgba(0, 255, 0, 0.5) !important; }
            `;
            document.head.appendChild(debugStyle);
        }
    }
    
    setupEventListeners() {
        // Handle navigation link clicks
        this.navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (!item.classList.contains(this.config.activeClass)) {
                    // Only handle navigation if it's a same-site link (not external)
                    const href = item.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('//')) {
                        // Update active class immediately for responsive feedback
                        this.updateActiveClass(index);
                        // Animate welding position
                        this.updateWeldingPosition(index, true);
                    }
                }
            });
            
            // Optional hover effects
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains(this.config.activeClass) && !this.state.isAnimating) {
                    // Subtle hover effect
                    this.weldingHand.style.opacity = '0.5';
                    this.weldingHand.style.transform = 'translateX(-50%) scale(0.8)';
                    
                    // Only update position if we're not in the middle of a click animation
                    const rect = item.getBoundingClientRect();
                    const containerRect = this.navContainer.getBoundingClientRect();
                    const left = rect.left + rect.width / 2 - containerRect.left;
                    
                    // Just update left position without the full animation
                    this.weldingHand.style.left = `${left}px`;
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (!this.state.isAnimating) {
                    // Reset to active tab position
                    this.weldingHand.style.opacity = '1';
                    this.weldingHand.style.transform = 'translateX(-50%)';
                    this.updateWeldingPosition(this.state.activeIndex, false);
                }
            });
        });
        
        // Handle responsive layout changes
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle navigation visibility changes
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                // Wait for mobile menu animation to complete
                setTimeout(() => {
                    this.updateWeldingPosition(this.state.activeIndex, false);
                }, 300);
            });
        }
    }
    
    updateActiveClass(newIndex) {
        // Remove active class from all items
        this.navItems.forEach(item => item.classList.remove(this.config.activeClass));
        
        // Add active class to new item
        if (newIndex >= 0 && newIndex < this.navItems.length) {
            this.navItems[newIndex].classList.add(this.config.activeClass);
            this.state.previousIndex = this.state.activeIndex;
            this.state.activeIndex = newIndex;
        }
    }
    
    updateWeldingPosition(index, animate = true) {
        if (index < 0 || index >= this.navItems.length) return;
        
        const targetItem = this.navItems[index];
        const rect = targetItem.getBoundingClientRect();
        const containerRect = this.navContainer.parentNode.getBoundingClientRect();
        
        // Calculate center position relative to container
        const left = rect.left + rect.width / 2 - containerRect.left;
        const bottom = this.config.weldingOffset; // Position relative to bottom of nav
        
        // Store target for animation completion check
        this.state.targetElement = targetItem;
        
        if (animate) {
            // Set animation state
            this.state.isAnimating = true;
            
            // Remove transition temporarily if we need to move a large distance
            if (Math.abs(this.state.previousIndex - index) > 3) {
                this.weldingHand.style.transition = 'none';
                // Force reflow
                void this.weldingHand.offsetWidth;
                // Restore transition
                this.weldingHand.style.transition = `transform ${this.config.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1), left ${this.config.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
            }
            
            // Add extra effects during animation
            this.weldingHand.style.filter = 'drop-shadow(0 0 5px rgba(255, 165, 0, 0.8))';
            
            // End animation after duration
            setTimeout(() => {
                this.state.isAnimating = false;
                this.weldingHand.style.filter = 'drop-shadow(0 0 3px rgba(255, 165, 0, 0.5))';
            }, this.config.animationDuration);
        } else {
            // No animation - instant positioning
            this.weldingHand.style.transition = 'none';
            // Force reflow
            void this.weldingHand.offsetWidth;
            // Restore transition for future animations
            this.weldingHand.style.transition = `transform ${this.config.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1), left ${this.config.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        }
        
        // Set final position
        this.weldingHand.style.left = `${left}px`;
        this.weldingHand.style.bottom = `${bottom}px`;
    }
    
    handleResize() {
        // Debounce resize events
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            // Update welding position after resize without animation
            this.updateWeldingPosition(this.state.activeIndex, false);
        }, 100);
    }
    
    // API methods for external control
    setActiveTab(index) {
        this.updateActiveClass(index);
        this.updateWeldingPosition(index, true);
    }
    
    refreshPositioning() {
        this.updateWeldingPosition(this.state.activeIndex, false);
    }
    
    setDebugMode(enabled) {
        this.config.debug = enabled;
        this.init(); // Recreate elements with debug settings
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create the welding navigation instance
    window.weldingNav = new WeldingNavigation({
        navSelector: '.nav-menu',
        activeClass: 'active',
        metalSurfaceHeight: 10,
        weldHandWidth: 70,
        weldHandHeight: 35,
        animationDuration: 600,
        weldingOffset: -15,
        debug: false // Set to true to enable visual debugging
    });
    
    // Add public API to window for testing from console
    window.testWeldingAnimation = function(index) {
        if (window.weldingNav) {
            window.weldingNav.setActiveTab(index);
        }
    };
});
