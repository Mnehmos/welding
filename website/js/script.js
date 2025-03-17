// Main JavaScript for StickWeldPro Website

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Tab Navigation System
    const navLinks = document.querySelectorAll('.nav-menu a');
    const currentPath = window.location.pathname;
    let activeTabSet = false;
    
    // Set active tab based on current URL
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if this path matches the current URL
        if (currentPath.endsWith(linkPath) || 
            (currentPath === '/' && linkPath === 'index.html') ||
            (currentPath === '/index.html' && linkPath === 'index.html')) {
            
            link.classList.add('active');
            activeTabSet = true;
            
            // Ensure smooth rendering of the welding animation
            setTimeout(() => {
                const weldingHand = link.querySelector('::before');
                if (weldingHand) {
                    weldingHand.style.willChange = 'transform, opacity';
                }
            }, 50);
        } else {
            link.classList.remove('active');
        }
        
        // Add smooth transition between tab states
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'color 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transition = 'color 0.3s ease';
        });
    });
    
    // Fallback if no tab is active - set home as default
    if (!activeTabSet && navLinks.length) {
        const homeLink = document.querySelector('.nav-menu a[href="index.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                
                // Force redraw of welding animation for better appearance in mobile view
                const activeLink = navMenu.querySelector('a.active');
                if (activeLink) {
                    activeLink.classList.remove('active');
                    // Force browser reflow
                    void navMenu.offsetWidth;
                    activeLink.classList.add('active');
                }
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.classList.add('back-to-top');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value) {
                // In a live version, this would send data to a server
                // For now, just show a confirmation message
                const formParent = this.parentElement;
                const confirmationMessage = document.createElement('p');
                confirmationMessage.textContent = `Thank you! ${emailInput.value} has been subscribed.`;
                confirmationMessage.style.color = 'var(--success-color)';
                
                this.style.display = 'none';
                formParent.appendChild(confirmationMessage);
                
                // Reset form for potential future use
                this.reset();
                
                // After 5 seconds, restore the form
                setTimeout(() => {
                    formParent.removeChild(confirmationMessage);
                    this.style.display = 'flex';
                }, 5000);
            }
        });
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Skip for empty links or just '#'
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for header
                    behavior: 'smooth'
                });
                
                // Update URL without reloading
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Highlight Active Section in Navigation
    function highlightNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        if (sections.length && navLinks.length) {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop - 100 && 
                    window.pageYOffset < sectionTop + sectionHeight - 100) {
                    current = '#' + section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === current) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', highlightNav);
    
    // Code Syntax Highlighting (if present)
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Handle Table of Contents (if present)
    const tableOfContents = document.querySelector('.table-of-contents');
    
    if (tableOfContents) {
        const headings = document.querySelectorAll('.main-content h2, .main-content h3');
        const tocList = document.createElement('ul');
        
        headings.forEach((heading, index) => {
            // Add ID to heading if not already present
            if (!heading.id) {
                heading.id = `section-${index}`;
            }
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            
            // Add class for h3 elements to indent them
            if (heading.tagName === 'H3') {
                listItem.classList.add('toc-subsection');
            }
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        tableOfContents.appendChild(tocList);
    }
    
    // Image Lightbox for Diagrams (if present)
    const diagrams = document.querySelectorAll('.diagram-container img');
    
    if (diagrams.length) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        
        const lightboxContent = document.createElement('div');
        lightboxContent.classList.add('lightbox-content');
        
        const lightboxImg = document.createElement('img');
        const lightboxClose = document.createElement('span');
        lightboxClose.classList.add('lightbox-close');
        lightboxClose.innerHTML = '&times;';
        
        lightboxContent.appendChild(lightboxImg);
        lightboxContent.appendChild(lightboxClose);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);
        
        // Add click event to diagrams
        diagrams.forEach(img => {
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', function() {
                lightbox.style.display = 'flex';
                lightboxImg.src = this.src;
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });
        
        // Close lightbox on click
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Add Print Button to Content Pages
    const mainContent = document.querySelector('.main-content');
    
    if (mainContent && !document.querySelector('.home-page')) {
        const printBtn = document.createElement('button');
        printBtn.classList.add('print-btn');
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print This Guide';
        
        printBtn.addEventListener('click', function() {
            window.print();
        });
        
        // Add to top of content area
        const pageTitle = mainContent.querySelector('h1');
        if (pageTitle) {
            pageTitle.parentNode.insertBefore(printBtn, pageTitle.nextSibling);
        } else {
            mainContent.prepend(printBtn);
        }
    }
    
    // Handle form submissions on practice tracking pages
    const practiceForm = document.querySelector('.practice-tracking-form');
    
    if (practiceForm) {
        practiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a live version, this would send data to a server
            // For now, just add to local display
            
            const formData = new FormData(this);
            const entryData = {};
            
            for (const [key, value] of formData.entries()) {
                entryData[key] = value;
            }
            
            addPracticeEntry(entryData);
            this.reset();
        });
        
        function addPracticeEntry(data) {
            const entriesContainer = document.querySelector('.practice-entries');
            
            if (!entriesContainer) return;
            
            const entryElement = document.createElement('div');
            entryElement.classList.add('practice-entry');
            
            const dateStr = new Date().toLocaleDateString();
            
            entryElement.innerHTML = `
                <div class="entry-header">
                    <h3>${data.exerciseName || 'Practice Session'}</h3>
                    <span class="entry-date">${dateStr}</span>
                </div>
                <div class="entry-details">
                    <p><strong>Electrode:</strong> ${data.electrode || 'Not specified'}</p>
                    <p><strong>Machine Settings:</strong> ${data.amperage || 'Not specified'} amps</p>
                    <p><strong>Position:</strong> ${data.position || 'Not specified'}</p>
                    <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
                </div>
                <div class="entry-rating">
                    <p><strong>Self-Rating:</strong> ${data.rating || '3'}/5</p>
                </div>
            `;
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-entry');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            
            deleteBtn.addEventListener('click', function() {
                if (confirm('Delete this practice entry?')) {
                    entryElement.remove();
                }
            });
            
            entryElement.querySelector('.entry-header').appendChild(deleteBtn);
            
            // Add to container
            entriesContainer.prepend(entryElement);
        }
    }
    
    // Fix for Safari and older browsers - ensure welding animation renders properly
    document.addEventListener('DOMContentLoaded', function() {
        // Force a redraw of the welding animation on page load
        const activeNavLink = document.querySelector('.nav-menu a.active');
        if (activeNavLink) {
            const originalClass = activeNavLink.className;
            activeNavLink.className = originalClass + ' force-redraw';
            
            // Force reflow
            void activeNavLink.offsetWidth;
            
            // Restore class
            activeNavLink.className = originalClass;
        }
    });
});