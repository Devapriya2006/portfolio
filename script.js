// Modern script.js with profile photo fix and contact form handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modern Portfolio Website Loaded Successfully! 🚀');
    
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    }

    // Navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active section highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // =============================================
    // PROFILE PHOTO FIX - MULTI-LAYER FALLBACK SYSTEM
    // =============================================
    const profilePhoto = document.getElementById('profilePhoto');
    const avatarInitials = document.getElementById('avatarInitials');
    
    // Array of reliable backup images (all from Unsplash CDN)
    const backupImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1566492031773-4f4e71fc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ];
    
    // Function to set profile photo with fallback
    if (profilePhoto) {
        let retryCount = 0;
        const maxRetries = 3;
        
        function setProfilePhotoWithFallback() {
            // Try local photo paths in order
            const localPaths = [
                'DEVAPRIYA.jpeg?' + new Date().getTime(),
                'devapriya.jpeg?' + new Date().getTime(),
                'DEVAPRIYA.jpg?' + new Date().getTime(),
                'devapriya.jpg?' + new Date().getTime(),
                'images/DEVAPRIYA.jpeg?' + new Date().getTime(),
                'assets/DEVAPRIYA.jpeg?' + new Date().getTime()
            ];
            
            tryLocalPath(0);
            
            function tryLocalPath(index) {
                if (index >= localPaths.length) {
                    useFallbackImage();
                    return;
                }
                
                const localPhoto = new Image();
                localPhoto.src = localPaths[index];
                
                localPhoto.onload = function() {
                    console.log('✅ Personal photo loaded successfully from:', localPaths[index]);
                    profilePhoto.src = localPhoto.src;
                    profilePhoto.style.display = 'block';
                    if (avatarInitials) {
                        avatarInitials.style.display = 'none';
                    }
                };
                
                localPhoto.onerror = function() {
                    console.log('❌ Failed to load from:', localPaths[index]);
                    tryLocalPath(index + 1);
                };
                
                // Timeout for slow loading
                setTimeout(() => {
                    if (profilePhoto.naturalHeight === 0) {
                        tryLocalPath(index + 1);
                    }
                }, 2000);
            }
            
            function useFallbackImage() {
                retryCount++;
                console.log(`🔄 Using fallback image (attempt ${retryCount}/${maxRetries})`);
                
                // Pick a random backup image
                const randomIndex = Math.floor(Math.random() * backupImages.length);
                profilePhoto.src = backupImages[randomIndex];
                profilePhoto.style.display = 'block';
                
                // Show initials over the backup image
                if (avatarInitials) {
                    avatarInitials.style.display = 'flex';
                    avatarInitials.style.background = 'rgba(99, 102, 241, 0.8)';
                    avatarInitials.style.backdropFilter = 'blur(5px)';
                }
                
                // Store that we're using a fallback
                localStorage.setItem('usingFallbackPhoto', 'true');
            }
        }
        
        setProfilePhotoWithFallback();
    } else {
        console.warn('Profile photo element not found');
    }

    // Initialize Particles.js for background
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#6366f1" },
                shape: { type: "circle" },
                opacity: { value: 0.2, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#6366f1",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            },
            retina_detect: true
        });
    }

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Skills data
    const skills = [
        { 
            icon: 'fab fa-html5', 
            name: 'HTML5', 
            description: 'Semantic markup, accessibility, modern HTML features, SEO optimization',
            progress: 50
        },
        { 
            icon: 'fab fa-css3-alt', 
            name: 'CSS3', 
            description: 'Responsive design, CSS Grid, Flexbox, animations, transitions, variables',
            progress: 30
        },
        { 
            icon: 'fab fa-js-square', 
            name: 'JavaScript', 
            description: 'ES6+, DOM manipulation, APIs, asynchronous programming, event handling',
            progress: 30
        },
        { 
            icon: 'fas fa-mobile-alt', 
            name: 'Responsive Design', 
            description: 'Mobile-first approach, cross-browser compatibility, media queries',
            progress: 55
        },
        { 
            icon: 'fas fa-microchip', 
            name: 'IoT & Embedded Systems', 
            description: 'Arduino Uno, Bluetooth HC-05, IEEE boards, sensor integration, hardware programming',
            progress: 75
        },
        { 
            icon: 'fas fa-camera', 
            name: 'OpenCV Basics', 
            description: 'Image processing, face recognition, computer vision fundamentals with Python',
            progress: 70
        }
    ];
    
    // Populate skills section
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = ''; // Clear existing content
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <i class="${skill.icon} skill-icon"></i>
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <div class="skill-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" data-progress="${skill.progress}" style="width: 0%"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                        <span class="progress-percentage">0%</span>
                        <span>${skill.progress}%</span>
                    </div>
                </div>
            `;
            skillsContainer.appendChild(skillCard);
        });
    }

    // Animate progress bars when in viewport
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        const progressPercentages = document.querySelectorAll('.progress-percentage');
        
        progressBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');
            if (progress) {
                // Animate width
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = `${progress}%`;
                
                // Animate percentage text if exists
                if (progressPercentages[index]) {
                    let currentProgress = 0;
                    const targetProgress = parseInt(progress);
                    const interval = setInterval(() => {
                        if (currentProgress >= targetProgress) {
                            clearInterval(interval);
                            progressPercentages[index].textContent = `${targetProgress}%`;
                        } else {
                            currentProgress++;
                            progressPercentages[index].textContent = `${currentProgress}%`;
                        }
                    }, 15);
                }
            }
        });
    }
    
    // =============================================
    // CONTACT FORM HANDLING
    // =============================================
    const contactForm = document.querySelector('.contact-form');
    
    // Notification system
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles if not in CSS
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                margin-left: auto;
                opacity: 0.8;
                transition: opacity 0.3s;
            `;
            closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
            closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            });
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: contactForm.querySelector('input[name="name"]')?.value || '',
                email: contactForm.querySelector('input[name="email"]')?.value || '',
                subject: contactForm.querySelector('input[name="subject"]')?.value || 'Portfolio Contact',
                message: contactForm.querySelector('textarea[name="message"]')?.value || ''
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Please enter a valid email address!', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Save to localStorage for demo
            setTimeout(() => {
                const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                messages.push({
                    ...formData,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                
                // Open default email client
                const mailtoLink = `mailto:devapriya2006paul@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
                    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
                )}`;
                
                showNotification('Opening your email client to send the message.', 'info');
                
                setTimeout(() => {
                    window.location.href = mailtoLink;
                }, 1500);
                
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                contactForm.reset();
            }, 1000);
        });
    }
    
    // Typewriter effect
    const professionElement = document.querySelector('.profession');
    if (professionElement) {
        const professions = ['Frontend Developer', 'IoT Developer', 'Web Developer', 'Problem Solver'];
        let professionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function typeWriter() {
            const currentProfession = professions[professionIndex];
            
            if (isDeleting) {
                professionElement.textContent = currentProfession.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                professionElement.textContent = currentProfession.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentProfession.length) {
                isDeleting = true;
                typingSpeed = 1500;
                setTimeout(typeWriter, typingSpeed);
                return;
            }
            
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                professionIndex = (professionIndex + 1) % professions.length;
                typingSpeed = 500;
            }
            
            setTimeout(typeWriter, typingSpeed);
        }
        
        setTimeout(typeWriter, 1000);
    }
    
    // CV Download functionality
    const cvDownloadBtn = document.getElementById('cvDownloadBtn');
    const cvFallback = document.getElementById('cvFallback');
    
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', function(e) {
            // Create CV content as fallback
            const cvContent = `
DEVAPRIYA PAUL KUNDU
Frontend & IoT Developer
================================================

CONTACT INFORMATION:
Email: devapriya2006paul@gmail.com
Phone: +91 9832341502
Location: Khanakul, West Bengal, India

PROFESSIONAL SUMMARY:
Passionate Frontend Developer with 1+ year of experience in creating responsive and user-friendly web applications. Specialized in HTML, CSS, and JavaScript. Experienced in working on real-world projects including a Waste Food Management System and IoT-based Voice Control Automation System with Arduino and Bluetooth.

TECHNICAL SKILLS:
• Frontend: HTML5, CSS3, JavaScript, Responsive Design
• IoT & Embedded Systems: Arduino Uno, Bluetooth HC-05, IEEE Boards, Sensor Integration
• Tools: Git, VS Code, Chrome DevTools, Arduino IDE
• Other: OpenCV Basics, Computer Vision Fundamentals

PROJECT EXPERIENCE:

1. Modern Weather Forecast
   - Real-time weather application with API integration
   - 5-day forecast, location search, dynamic UI updates
   - Technologies: HTML5, CSS3, JavaScript, OpenWeatherMap API

2. Modern Portfolio Website
   - Responsive portfolio with modern animations and effects
   - Implemented smooth transitions, particle backgrounds
   - Technologies: HTML5, CSS3, JavaScript, Particles.js

3. Waste Food Management System
   - Frontend interfaces for connecting restaurants with NGOs
   - Responsive dashboards for food donation management
   - Technologies: HTML, CSS, JavaScript, Firebase

4. IoT Voice Control Automation System
   - IoT-based home automation using Arduino Uno
   - Bluetooth HC-05 module for wireless device control
   - Technologies: Arduino Uno, Bluetooth HC-05, C++

5. Image Recognition System
   - Computer vision algorithms using OpenCV
   - Web interface for image processing
   - Technologies: Python, OpenCV, Flask

EDUCATION:
Computer Science Engineering
Technique Polytechnic Institute (TPI)

================================================
This CV was generated from my portfolio website.
Last updated: ${new Date().toLocaleDateString()}
            `;
            
            // Try to download PDF first
            const pdfUrl = 'DEVAPRIYA CV (1).pdf';
            
            // Create hidden iframe to test PDF availability
            const testFrame = document.createElement('iframe');
            testFrame.style.display = 'none';
            testFrame.onload = function() {
                setTimeout(() => {
                    document.body.removeChild(testFrame);
                    showNotification('CV download started!', 'success');
                }, 100);
            };
            testFrame.onerror = function() {
                document.body.removeChild(testFrame);
                // PDF doesn't exist, use fallback
                e.preventDefault();
                if (cvFallback) {
                    cvFallback.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvContent);
                    cvFallback.download = 'Devapriya_Paul_Kundu_CV.txt';
                    cvFallback.click();
                    showNotification('Downloading CV as text file.', 'info');
                }
            };
            testFrame.src = pdfUrl;
            document.body.appendChild(testFrame);
        });
    }
    
    // Project images fallback handling
    window.addEventListener('load', function() {
        const projectImages = document.querySelectorAll('.project-image-real');
        const fallbackIcons = document.querySelectorAll('.project-fallback-icon');
        
        projectImages.forEach((img, index) => {
            if (img) {
                img.onerror = function() {
                    this.style.display = 'none';
                    if (fallbackIcons[index]) {
                        fallbackIcons[index].style.display = 'flex';
                    }
                };
                
                // Check if image loaded successfully
                if (img.complete && img.naturalHeight === 0) {
                    img.style.display = 'none';
                    if (fallbackIcons[index]) {
                        fallbackIcons[index].style.display = 'flex';
                    }
                }
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.id === 'skills') {
                    setTimeout(animateProgressBars, 300);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Add animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .back-to-top {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .skill-card {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .skill-card:nth-child(1) { animation-delay: 0.1s; }
        .skill-card:nth-child(2) { animation-delay: 0.2s; }
        .skill-card:nth-child(3) { animation-delay: 0.3s; }
        .skill-card:nth-child(4) { animation-delay: 0.4s; }
        .skill-card:nth-child(5) { animation-delay: 0.5s; }
        .skill-card:nth-child(6) { animation-delay: 0.6s; }
    `;
    document.head.appendChild(style);
    
    // Trigger skill card animations
    setTimeout(() => {
        document.querySelectorAll('.skill-card').forEach(card => {
            card.style.opacity = '1';
        });
    }, 100);
    
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 5}s`;
    });
    
    // Highlight the 100% Frontend Focus card
    const highlightedStat = document.querySelector('.highlighted-stat');
    if (highlightedStat) {
        setInterval(() => {
            highlightedStat.style.animation = 'none';
            setTimeout(() => {
                highlightedStat.style.animation = 'pulse 2s infinite';
            }, 10);
        }, 4000);
    }
    
    console.log('✅ Portfolio website fully initialized! ✨');
});