// Animation Debugger for StickWeldPro
// This script provides visual debugging tools for the welding animation

(function() {
    // Animation control panel
    class AnimationDebugger {
        constructor() {
            this.isDebugging = false;
            this.createUI();
            this.bindEvents();
        }

        createUI() {
            // Create container
            this.panel = document.createElement('div');
            this.panel.className = 'animation-debug-panel';
            this.panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                width: 300px;
                font-family: monospace;
                font-size: 12px;
            `;

            this.panelContent = `
                <h3 style="margin: 0 0 10px; color: #00aaff; text-align: center;">Welding Animation Debugger</h3>
                <div class="debug-controls">
                    <button id="debug-toggle" style="background: #00aaff; color: white; border: none; padding: 5px 10px; width: 100%; margin-bottom: 5px;">Enable Visual Debug</button>
                    <button id="test-tabs" style="background: #ff7700; color: white; border: none; padding: 5px 10px; width: 100%; margin-bottom: 5px;">Test Tab Transitions</button>
                    <button id="optimize-animation" style="background: #00cc66; color: white; border: none; padding: 5px 10px; width: 100%; margin-bottom: 5px;">Apply Performance Optimizations</button>
                    <button id="snap-tabs" style="background: #cc00cc; color: white; border: none; padding: 5px 10px; width: 100%; margin-bottom: 10px;">Fix Tab Positioning</button>
                    
                    <h4 style="margin: 5px 0; color: #00aaff;">Animation Speed</h4>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <input type="range" id="animation-speed" min="0.1" max="2" step="0.1" value="1" style="flex: 1;">
                        <span id="speed-value" style="margin-left: 10px; width: 30px;">1x</span>
                    </div>
                    
                    <h4 style="margin: 5px 0; color: #00aaff;">Animation Status</h4>
                    <div id="status-output" style="background: #333; padding: 5px; height: 60px; overflow: auto; font-size: 11px;">Ready</div>
                </div>
            `;

            this.panel.innerHTML = this.panelContent;
            document.body.appendChild(this.panel);
        }

        bindEvents() {
            // Toggle debug outlines
            document.getElementById('debug-toggle').addEventListener('click', () => {
                this.isDebugging = !this.isDebugging;
                this.toggleDebugging(this.isDebugging);
                document.getElementById('debug-toggle').textContent = 
                    this.isDebugging ? 'Disable Visual Debug' : 'Enable Visual Debug';
            });

            // Test tab transitions
            document.getElementById('test-tabs').addEventListener('click', () => {
                this.testTabTransitions();
            });

            // Apply performance optimizations
            document.getElementById('optimize-animation').addEventListener('click', () => {
                this.optimizeAnimations();
            });

            // Fix tab positioning
            document.getElementById('snap-tabs').addEventListener('click', () => {
                this.fixTabPositioning();
            });

            // Animation speed control
            document.getElementById('animation-speed').addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                document.getElementById('speed-value').textContent = speed.toFixed(1) + 'x';
                this.updateAnimationSpeed(speed);
            });
        }

        toggleDebugging(enable) {
            const styleSheet = document.createElement('style');
            
            if (enable) {
                styleSheet.id = 'animation-debug-styles';
                styleSheet.innerHTML = `
                    .nav-menu a { outline: 1px dashed rgba(255, 0, 0, 0.5) !important; }
                    .nav-menu a.active { outline: 1px solid rgba(255, 0, 0, 0.8) !important; }
                    .header-container::after { outline: 1px dashed rgba(0, 255, 255, 0.7) !important; }
                    .nav-menu a.active::before, .nav-menu a:hover::before { 
                        outline: 1px dashed rgba(0, 255, 0, 0.7) !important;
                        background-color: rgba(255, 255, 0, 0.1) !important;
                    }
                `;
                document.head.appendChild(styleSheet);
                this.log('Debugging outlines enabled');
            } else {
                const existingStyle = document.getElementById('animation-debug-styles');
                if (existingStyle) {
                    existingStyle.remove();
                }
                this.log('Debugging outlines disabled');
            }
        }

        testTabTransitions() {
            const tabs = Array.from(document.querySelectorAll('.nav-menu a'));
            let currentIndex = 0;
            
            // Find current active tab
            const activeTabIndex = tabs.findIndex(tab => tab.classList.contains('active'));
            if (activeTabIndex !== -1) {
                currentIndex = activeTabIndex;
            }
            
            this.log('Testing tab transitions...');
            
            const testInterval = setInterval(() => {
                // Remove active class from all tabs
                tabs.forEach(tab => tab.classList.remove('active'));
                
                // Increment index and loop back if needed
                currentIndex = (currentIndex + 1) % tabs.length;
                
                // Add active class to next tab
                tabs[currentIndex].classList.add('active');
                this.log(`Active tab: ${tabs[currentIndex].textContent}`);
                
                // Stop after going through all tabs
                if (currentIndex === activeTabIndex) {
                    clearInterval(testInterval);
                    this.log('Tab transition test completed');
                }
            }, 1000);
        }

        optimizeAnimations() {
            this.log('Applying animation performance optimizations...');
            
            // Add optimization styles
            const optimizationStyles = document.createElement('style');
            optimizationStyles.id = 'animation-performance-optimizations';
            optimizationStyles.innerHTML = `
                /* Force hardware acceleration on all animated elements */
                .nav-menu a.active::before,
                .nav-menu a:hover::before,
                .header-container::after {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    perspective: 1000px;
                    will-change: transform, opacity;
                }
                
                /* Reduce animation complexity for better performance */
                .nav-menu a.active::before svg,
                .nav-menu a:hover::before svg {
                    contain: content;
                }
                
                /* SVG performance optimizations */
                svg {
                    transform: translateZ(0);
                    contain: strict;
                    will-change: transform;
                }
            `;
            
            document.head.appendChild(optimizationStyles);
            this.log('Performance optimizations applied');
            
            // Try to optimize the SVG animations directly
            this.optimizeSvgAnimations();
        }

        optimizeSvgAnimations() {
            // Get all SVGs used in the animations
            const svgUrls = [
                '../images/tab-welder-hand.svg',
                '../images/tab-surface.svg'
            ];
            
            // Load each SVG and optimize it
            svgUrls.forEach(url => {
                fetch(url)
                    .then(response => response.text())
                    .then(svgContent => {
                        // Analyze SVG content - this is just logging for debugging
                        const animationCount = (svgContent.match(/<animate/g) || []).length;
                        this.log(`SVG ${url}: Found ${animationCount} animations`);
                    })
                    .catch(err => {
                        this.log(`Failed to analyze SVG ${url}: ${err.message}`);
                    });
            });
        }

        fixTabPositioning() {
            this.log('Fixing tab positioning...');
            
            // Create precise positioning styles
            const positioningFix = document.createElement('style');
            positioningFix.id = 'tab-positioning-fix';
            positioningFix.innerHTML = `
                /* Ensure consistent tab sizing */
                .nav-menu a {
                    padding: 8px 12px;
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* Fix welding hand position precision */
                .nav-menu a.active::before {
                    bottom: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 70px;
                    height: 35px;
                }
                
                /* Consistent surface positioning */
                .header-container::after {
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 10px;
                }
            `;
            
            document.head.appendChild(positioningFix);
            this.log('Tab positioning fixed');
        }

        updateAnimationSpeed(speed) {
            this.log(`Setting animation speed to ${speed}x`);
            
            // Create animation speed adjustment style
            const existingSpeedStyle = document.getElementById('animation-speed-adjustment');
            if (existingSpeedStyle) {
                existingSpeedStyle.remove();
            }
            
            const speedStyle = document.createElement('style');
            speedStyle.id = 'animation-speed-adjustment';
            speedStyle.innerHTML = `
                /* Adjust animation duration globally */
                .nav-menu a.active::before animateTransform,
                .nav-menu a:hover::before animateTransform,
                circle animate,
                path animate,
                svg animate {
                    animation-duration: calc(var(--original-duration, 1s) / ${speed}) !important;
                }
            `;
            
            document.head.appendChild(speedStyle);
        }

        log(message) {
            const statusOutput = document.getElementById('status-output');
            const timestamp = new Date().toLocaleTimeString();
            statusOutput.innerHTML += `<div>[${timestamp}] ${message}</div>`;
            statusOutput.scrollTop = statusOutput.scrollHeight;
        }
    }

    // Initialize debugger when the page is fully loaded
    window.addEventListener('load', () => {
        window.animationDebugger = new AnimationDebugger();
    });
})();
