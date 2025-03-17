// Floating Table of Contents Implementation

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on content pages that have headings
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const headings = document.querySelectorAll('.main-content h2, .main-content h3');
    if (headings.length === 0) return;
    
    // Create floating TOC container
    const floatingToc = document.createElement('div');
    floatingToc.className = 'floating-toc';
    
    // Create toggle button
    const tocToggle = document.createElement('div');
    tocToggle.className = 'toc-toggle';
    tocToggle.innerHTML = '<i class="fas fa-list"></i>';
    
    // Create TOC title
    const tocTitle = document.createElement('h3');
    tocTitle.textContent = 'Table of Contents';
    
    // Create TOC list
    const tocList = document.createElement('ul');
    
    // Populate TOC with headings
    let currentSection = null;
    let headingIds = new Set();
    
    headings.forEach((heading, index) => {
        // Generate unique IDs for headings that don't have them
        if (!heading.id) {
            let baseId = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            let id = baseId;
            let counter = 1;
            
            // Ensure ID is unique
            while (headingIds.has(id)) {
                id = `${baseId}-${counter}`;
                counter++;
            }
            
            heading.id = id;
            headingIds.add(id);
        } else {
            headingIds.add(heading.id);
        }
        
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2';
        
        // Create link
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.setAttribute('data-section', heading.id);
        
        // Add click event
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Smooth scroll to heading
            heading.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL hash without jumping
            history.pushState(null, null, `#${heading.id}`);
            
            // Update active state
            updateActiveSection();
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    // Add elements to DOM
    floatingToc.appendChild(tocTitle);
    floatingToc.appendChild(tocList);
    document.body.appendChild(floatingToc);
    document.body.appendChild(tocToggle);
    
    // Toggle TOC visibility
    tocToggle.addEventListener('click', function() {
        floatingToc.classList.toggle('visible');
        tocToggle.classList.toggle('active');
        
        // Store preference in session storage
        if (floatingToc.classList.contains('visible')) {
            sessionStorage.setItem('tocVisible', 'true');
        } else {
            sessionStorage.setItem('tocVisible', 'false');
        }
    });
    
    // Function to update active section in TOC
    function updateActiveSection() {
        // Get all section positions
        const sectionPositions = [];
        
        headings.forEach(heading => {
            sectionPositions.push({
                id: heading.id,
                top: heading.getBoundingClientRect().top
            });
        });
        
        // Find the current section (closest heading above the top of viewport + small offset)
        let currentSectionId = null;
        const scrollPosition = window.scrollY + 100; // adding offset for better UX
        
        for (let i = sectionPositions.length - 1; i >= 0; i--) {
            const section = sectionPositions[i];
            const headingElement = document.getElementById(section.id);
            const headingTop = window.scrollY + headingElement.getBoundingClientRect().top;
            
            if (headingTop <= scrollPosition) {
                currentSectionId = section.id;
                break;
            }
        }
        
        // If no section is found above the fold, use the first section
        if (!currentSectionId && sectionPositions.length > 0) {
            currentSectionId = sectionPositions[0].id;
        }
        
        // Update active class in TOC
        const tocLinks = tocList.querySelectorAll('a');
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSectionId) {
                link.classList.add('active');
                
                // Scroll link into view within TOC if needed
                const linkRect = link.getBoundingClientRect();
                const tocRect = floatingToc.getBoundingClientRect();
                
                if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
                    link.scrollIntoView({
                        block: 'center',
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // Check if TOC should be visible on page load
    if (sessionStorage.getItem('tocVisible') === 'true') {
        floatingToc.classList.add('visible');
        tocToggle.classList.add('active');
    }
    
    // Update active section on scroll
    window.addEventListener('scroll', throttle(updateActiveSection, 100));
    
    // Initial update of active section
    setTimeout(updateActiveSection, 100);
    
    // Utility function for throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Update active links when page is loaded with a hash
    if (window.location.hash) {
        setTimeout(function() {
            const id = window.location.hash.substring(1);
            const heading = document.getElementById(id);
            
            if (heading) {
                heading.scrollIntoView();
                updateActiveSection();
            }
        }, 300);
    }
});
