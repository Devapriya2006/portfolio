// Modern script.js with profile photo fix and no contact form
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modern Portfolio Website Loaded Successfully! 🚀');
    
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1000);

    // Navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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
        'https://images.unsplash.com/photo-1566492031773-4f4e44671fc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ];
    
    // Function to set profile photo with fallback
    function setProfilePhotoWithFallback() {
        // First, try to load the local photo
        const localPhoto = new Image();
        
        // Use a timestamp to avoid caching issues
        localPhoto.src = 'DEVAPRIYA.jpeg?' + new Date().getTime();
        
        localPhoto.onload = function() {
            console.log('✅ Personal photo loaded successfully from local');
            profilePhoto.src = localPhoto.src;
            profilePhoto.style.display = 'block';
            if (avatarInitials) {
                avatarInitials.style.display = 'none';
            }
            
            // Test if the image is actually loaded (some browsers might trigger onload for broken images)
            setTimeout(() => {
                if (profilePhoto.naturalHeight === 0 || profilePhoto.naturalWidth === 0) {
                    console.log('⚠️ Photo loaded but appears broken, using fallback');
                    useFallbackImage();
                }
            }, 100);
        };
        
        localPhoto.onerror = function() {
            console.log('❌ Local photo not found, using fallback');
            useFallbackImage();
        };
        
        // Set a timeout in case the image takes too long to load
        setTimeout(() => {
            if (profilePhoto.naturalHeight === 0 && !profilePhoto.src.includes('unsplash')) {
                console.log('⏰ Photo loading timed out, using fallback');
                useFallbackImage();
            }
        }, 3000);
        
        function useFallbackImage() {
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
        }
    }
    
    // Initialize profile photo
    if (profilePhoto) {
        setProfilePhotoWithFallback();
        
        // Retry loading photo after page is fully loaded
        window.addEventListener('load', function() {
            if (profilePhoto.naturalHeight === 0 && !profilePhoto.src.includes('unsplash')) {
                console.log('🔄 Retrying photo load after page load');
                setProfilePhotoWithFallback();
            }
        });
    }

    // Initialize Particles.js for background
    if (typeof particlesJS !== 'undefined') {
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
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
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
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <i class="${skill.icon} skill-icon"></i>
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <div class="skill-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" data-progress="${skill.progress}"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 5px;">
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
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
        });
    }
    
    // Notification system (for CV download)
    function showNotification(message, type) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Typewriter effect
    const professionElement = document.querySelector('.profession');
    if (professionElement) {
        const professions = ['Frontend Developer', 'IoT Developer', 'Web Developer', 'Embedded Systems', 'Problem Solver'];
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
• IoT & Embedded Systems: Arduino Uno, Bluetooth HC-05, IEEE Boards, Sensor Integration, C++ Programming
• Tools: Git, VS Code, Chrome DevTools, Arduino IDE
• Concepts: UI/UX Principles, Cross-browser Compatibility, IoT Protocols, Hardware-Software Integration
• Other: OpenCV Basics, Computer Vision Fundamentals

PROJECT EXPERIENCE:

1. Modern Portfolio Website
   - Built a responsive portfolio with modern animations and glassmorphism effects
   - Implemented smooth transitions, particle backgrounds, and interactive elements
   - Technologies: HTML5, CSS3, JavaScript, Particles.js

2. Waste Food Management System (Frontend Developer Role)
   - Developed frontend interfaces for connecting restaurants with NGOs
   - Created responsive dashboards for food donation management
   - Implemented real-time notifications and donation tracking
   - Technologies: HTML, CSS, JavaScript, Firebase

3. IoT Voice Control Automation System
   - Developed complete IoT-based home automation system using Arduino Uno
   - Implemented Bluetooth HC-05 module for wireless device control
   - Built custom Android app for voice commands and real-time monitoring
   - Integrated IEEE boards for smart device connectivity and control
   - Features voice-controlled lighting, appliances, and security systems
   - Technologies: Arduino Uno, Bluetooth HC-05, C++, Android Development, IEEE Boards

4. Image Recognition System
   - Implemented computer vision algorithms using OpenCV
   - Built web interface for image processing and object recognition
   - Features face detection and real-time video processing
   - Technologies: Python, OpenCV, Flask, Computer Vision

EDUCATION:
Computer Science Engineering
Technique Polytechnic Institute (TPI)

================================================
This CV was generated from my portfolio website.
Last updated: ${new Date().toLocaleDateString()}
            `;
            
            // Check if PDF exists
            const pdfUrl = 'DEVAPRIYA CV (1).pdf';
            fetch(pdfUrl)
                .then(response => {
                    if (response.ok) {
                        console.log('PDF CV found, downloading...');
                        // PDF exists, let the default download happen
                        showNotification('CV download started!', 'success');
                    } else {
                        throw new Error('PDF not found');
                    }
                })
                .catch(() => {
                    // PDF doesn't exist, use fallback
                    e.preventDefault();
                    cvFallback.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvContent);
                    cvFallback.download = 'Devapriya_Paul_Kundu_CV.txt';
                    cvFallback.click();
                    showNotification('Downloading CV as text file. Please rename extension to .txt to open.', 'info');
                });
        });
    }
    
    // Project images fallback handling
    window.addEventListener('load', function() {
        const projectImages = document.querySelectorAll('.project-image-real');
        const fallbackIcons = document.querySelectorAll('.project-fallback-icon');
        
        projectImages.forEach((img, index) => {
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
    
    // Add smooth hover effects to contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});