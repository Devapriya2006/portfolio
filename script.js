// Modern script.js with profile photo fix and contact form handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modern Portfolio Website Loaded Successfully!');

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

    // Custom background image loader
    // To use YOUR OWN background image: just add a file named "background.jpg"
    // (or .jpeg / .png) into an "images" folder next to index.html.
    // It will be detected automatically — no code changes needed.
    // If no custom file is found, the site keeps its default animated background.
    (function loadCustomBackground() {
        const bgLayer = document.getElementById('custom-bg');
        if (!bgLayer) return;

        const candidatePaths = [
            'images/background.jpg',
            'images/background.jpeg',
            'images/background.png',
            'background.jpg',
            'background.jpeg',
            'background.png',
            'assets/background.jpg',
            'assets/background.jpeg',
            'assets/background.png'
        ];

        // Probe all candidates in parallel instead of one-by-one — total wait
        // time is the slowest single request, not the sum of nine sequential
        // ones. No cache-busting query, so repeat visits can hit a 304.
        const probes = candidatePaths.map(path => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(path);
            img.onerror = reject;
            img.src = path;
        }));

        Promise.any(probes)
            .then(path => {
                bgLayer.style.backgroundImage = `url('${path}')`;
                bgLayer.classList.add('has-image');
                document.body.classList.add('custom-bg-active');
                console.log('Custom background loaded from:', path);
            })
            .catch(() => {
                // no custom background image found — keep default animated background
            });
    })();

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

    // Navbar scroll effect + active section highlighting
    // Combined into one rAF-throttled, passive scroll handler so scrolling
    // never forces a synchronous layout read on every tick.
    const sections = document.querySelectorAll('section');
    let sectionOffsets = [];

    function cacheSectionOffsets() {
        sectionOffsets = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop
        }));
    }
    cacheSectionOffsets();
    window.addEventListener('resize', cacheSectionOffsets, { passive: true });

    let scrollTicking = false;
    function handleScroll() {
        const y = window.scrollY;

        if (navbar) {
            navbar.classList.toggle('scrolled', y > 50);
        }

        let current = '';
        for (const s of sectionOffsets) {
            if (y >= s.top - 200) current = s.id;
        }
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href').substring(1) === current;
            link.classList.toggle('active', isActive);
        });

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(handleScroll);
            scrollTicking = true;
        }
    }, { passive: true });

    // =============================================
    // PROFILE PHOTO — parallel path probing, no cache-busting,
    // falls back to the initials avatar instead of a stock stranger photo.
    // =============================================
    const profilePhoto = document.getElementById('profilePhoto');
    const avatarInitials = document.getElementById('avatarInitials');

    if (profilePhoto) {
        const localPaths = [
            'DEVAPRIYA.jpeg',
            'devapriya.jpeg',
            'DEVAPRIYA.jpg',
            'devapriya.jpg',
            'images/DEVAPRIYA.jpeg',
            'assets/DEVAPRIYA.jpeg'
        ];

        const probes = localPaths.map(path => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(path);
            img.onerror = reject;
            img.src = path;
        }));

        Promise.any(probes)
            .then(path => {
                console.log('Personal photo loaded successfully from:', path);
                profilePhoto.src = path;
                profilePhoto.style.display = 'block';
                if (avatarInitials) {
                    avatarInitials.style.display = 'none';
                }
            })
            .catch(() => {
                // No local photo found — show the initials avatar instead of
                // a stranger's stock photo.
                profilePhoto.style.display = 'none';
                if (avatarInitials) {
                    avatarInitials.style.display = 'flex';
                    avatarInitials.style.background = 'rgba(99, 102, 241, 0.8)';
                    avatarInitials.style.backdropFilter = 'blur(5px)';
                }
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
        }, { passive: true });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Skills data, grouped by category
    const skillCategories = [
        {
            name: 'Frontend',
            icon: 'fas fa-laptop-code',
            skills: [
                { name: 'HTML5', progress: 50 },
                { name: 'CSS3', progress: 30 },
                { name: 'JavaScript', progress: 30 },

            ]
        },
        {
            name: 'Backend',
            icon: 'fas fa-server',
            skills: [
                { name: 'Node.js', progress: 45 },
                { name: 'Express.js', progress: 45 }
            ]
        },
        {
            name: 'Database',
            icon: 'fas fa-database',
            skills: [
                { name: 'MongoDB', progress: 40 }
            ]
        },
        {
            name: 'Tools & Systems',
            icon: 'fas fa-microchip',
            skills: [
                { name: 'IoT & Embedded Systems', progress: 45 },
                { name: 'OpenCV Basics', progress: 45 },
                { name: 'Git & GitHub', progress: 50 }
            ]
        }
    ];

    // Populate skills section as categorized glass cards
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = '';
        skillCategories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'skill-category-card';

            const rows = category.skills.map(skill => `
                <div class="skill-row">
                    <div class="skill-row-top">
                        <span class="skill-row-name">${skill.name}</span>
                        <span class="skill-row-percentage">${skill.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" data-progress="${skill.progress}" style="width: 0%"></div>
                    </div>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="skill-category-title">
                    <i class="${category.icon}"></i>
                    <h3>${category.name}</h3>
                </div>
                ${rows}
            `;
            skillsContainer.appendChild(card);
        });
    }

    // Animate progress bars when in viewport
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        const progressPercentages = document.querySelectorAll('.progress-percentage');

        progressBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');
            if (progress) {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = `${progress}%`;

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
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

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

        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: none; border: none; color: white; cursor: pointer;
                padding: 5px; margin-left: auto; opacity: 0.8; transition: opacity 0.3s;
            `;
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            });
        }

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // =============================================
    // BACKEND API URL
    // Local development: https://devstudio-bfye.onrender.com/
    // Same-origin deploy: /api/contact
    // Custom deploy: set window.PORTFOLIO_BACKEND_URL before loading this script
    // =============================================
    const BACKEND_URL =
        window.PORTFOLIO_BACKEND_URL ||
        'https://devstudio-bfye.onrender.com/api/contact';

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Collect form values
            const formData = {
                name:    contactForm.querySelector('input[name="name"]')?.value.trim()       || '',
                email:   contactForm.querySelector('input[name="email"]')?.value.trim()      || '',
                subject: contactForm.querySelector('input[name="subject"]')?.value.trim()    || 'Portfolio Contact',
                message: contactForm.querySelector('textarea[name="message"]')?.value.trim() || ''
            };

            // Front-end validation (backend validates again server-side)
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }
            if (formData.name.length < 2) {
                showNotification('Name must be at least 2 characters.', 'error');
                return;
            }
            if (formData.message.length < 10) {
                showNotification('Message must be at least 10 characters.', 'error');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Please enter a valid email address!', 'error');
                return;
            }

            // Show loading state on button
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showNotification(result.message || 'Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    // Show first validation error if available
                    const errMsg = result.errors?.[0]?.message || result.message || 'Something went wrong.';
                    showNotification(errMsg, 'error');
                }
            } catch (err) {
                console.error('Contact form error:', err);
                showNotification(
                    'Could not reach the server. Is the backend running?',
                    'error'
                );
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Typewriter effect
    const professionElement = document.querySelector('.profession');
    if (professionElement) {
        const professions = ['Full Stack Developer', 'IoT Developer', 'Web Developer', 'Problem Solver'];
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

    // CV Download functionality (nav button + About section resume button)
    const cvDownloadBtns = document.querySelectorAll('.cv-download-trigger');
    const cvFallback = document.getElementById('cvFallback');

    cvDownloadBtns.forEach(cvDownloadBtn => {
        cvDownloadBtn.addEventListener('click', function(e) {
            const cvContent = `
================================================
DEVAPRIYA PAUL KUNDU
Full Stack & IoT Developer
================================================

CONTACT INFORMATION:
Email: devapriya2006paul@gmail.com
Phone: +91 9832341502
Location: Khanakul, West Bengal, India

PROFESSIONAL SUMMARY:
Passionate Full Stack Developer with 1+ year of experience in creating responsive
and user-friendly web applications. Specialised in HTML, CSS, JavaScript, Node.js,
Express.js, and MongoDB. Experienced in IoT-based Voice Control Automation and
Computer Vision projects.

TECHNICAL SKILLS:
- Frontend: HTML5, CSS3, JavaScript, Responsive Design
- Backend: Node.js, Express.js, MongoDB
- IoT & Embedded Systems: Arduino Uno, Bluetooth HC-05, IEEE Boards
- Tools: Git, VS Code, Chrome DevTools, Arduino IDE
- Other: OpenCV Basics, Computer Vision Fundamentals

EDUCATION:
Computer Science Engineering
Technique Polytechnic Institute (TPI)

================================================
Last updated: ${new Date().toLocaleDateString()}
            `;

            const pdfUrl = 'DEVAPRIYA CV (1).pdf';
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
    });

    // Project images fallback handling
    window.addEventListener('load', function() {
        const projectImages = document.querySelectorAll('.project-image-real');
        const fallbackIcons = document.querySelectorAll('.project-fallback-icon');

        // Custom project pictures
        // Each project image has a data-custom="images/your-file.jpg" attribute in index.html.
        // Add a matching image file into an "images" folder next to index.html and it will
        // automatically replace the default stock photo for that project — no code changes needed.
        projectImages.forEach((img) => {
            const customSrc = img.getAttribute('data-custom');
            if (!customSrc) return;

            const customImage = new Image();
            customImage.src = customSrc + '?' + new Date().getTime();
            customImage.onload = function () {
                img.src = customImage.src;
                console.log('Custom project image loaded from:', customSrc);
            };
            // If the custom file isn't there, silently keep the existing default image.
        });

        projectImages.forEach((img, index) => {
            if (img) {
                img.onerror = function() {
                    this.style.display = 'none';
                    if (fallbackIcons[index]) {
                        fallbackIcons[index].style.display = 'flex';
                    }
                };

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
                if (entry.target.id === 'about') {
                    animateStatCounters();
                }
                if (entry.target.id === 'experience') {
                    document.getElementById('timeline')?.classList.add('in-view');
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
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(100%); opacity: 0; }
        }
        .back-to-top { opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; }
        .back-to-top.visible { opacity: 1; visibility: visible; }
        .skill-category-card { animation: fadeInUp 0.6s ease forwards; opacity: 0; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .skill-category-card:nth-child(1) { animation-delay: 0.1s; }
        .skill-category-card:nth-child(2) { animation-delay: 0.2s; }
        .skill-category-card:nth-child(3) { animation-delay: 0.3s; }
        .skill-category-card:nth-child(4) { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.querySelectorAll('.skill-category-card').forEach(card => {
            card.style.opacity = '1';
        });
    }, 100);

    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 5}s`;
    });

    const highlightedStat = document.querySelector('.highlighted-stat');
    if (highlightedStat) {
        setInterval(() => {
            highlightedStat.style.animation = 'none';
            setTimeout(() => {
                highlightedStat.style.animation = 'pulse 2s infinite';
            }, 10);
        }, 4000);
    }

    // =============================================
    // ABOUT STATS — animated count-up
    // =============================================
    let statsAnimated = false;
    function animateStatCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        document.querySelectorAll('.stat-card h3[data-count-target]').forEach(el => {
            const target = parseInt(el.getAttribute('data-count-target'), 10) || 0;
            const suffix = el.getAttribute('data-count-suffix') || '';
            let current = 0;
            const stepTime = Math.max(Math.floor(1200 / Math.max(target, 1)), 20);

            const timer = setInterval(() => {
                current++;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = `${current}${suffix}`;
            }, stepTime);
        });
    }

    // =============================================
    // CERTIFICATES — auto-detect custom images
    // Same pattern as the project images: drop files into
    // images/certificates/certificate-1.jpg ... certificate-4.jpg
    // and each placeholder card upgrades to the real image automatically.
    // =============================================
    document.querySelectorAll('.cert-image-real').forEach(img => {
        const customSrc = img.getAttribute('data-custom');
        if (!customSrc) return;

        const testImage = new Image();
        testImage.src = customSrc + '?' + new Date().getTime();
        testImage.onload = function () {
            img.src = testImage.src;
            img.style.display = 'block';
            const placeholder = img.parentElement.querySelector('.cert-placeholder');
            if (placeholder) placeholder.style.display = 'none';
        };
        // If the file isn't there, the placeholder stays visible — no error needed.
    });

    // =============================================
    // COLLEGE LIFE — auto-detect custom photos
    // Drop files into images/college-life/ as college-1.jpg ... college-4.jpg
    // and each placeholder card upgrades to the real image automatically.
    // =============================================
    document.querySelectorAll('.college-photo-real').forEach(img => {
        const customSrc = img.getAttribute('data-custom');
        if (!customSrc) return;

        const testImage = new Image();
        testImage.src = encodeURI(customSrc) + '?' + new Date().getTime();
        testImage.onload = function () {
            img.src = testImage.src;
            img.style.display = 'block';
            const placeholder = img.parentElement.querySelector('.college-photo-placeholder');
            if (placeholder) placeholder.style.display = 'none';
        };
        // If the file isn't there, the placeholder stays visible — no error needed.
    });

    const collegeLifeTrack = document.querySelector('.college-life-track');
    if (collegeLifeTrack && collegeLifeTrack.children.length) {
        const originalCards = Array.from(collegeLifeTrack.children);
        originalCards.forEach((card) => {
            collegeLifeTrack.appendChild(card.cloneNode(true));
        });
    }

    // =============================================
    // FLOATING MUSIC PLAYER
    // Drop a file named "song.mp3" next to index.html (same folder as
    // index.html on your deployed server) and click the floating music
    // button (top-right, below the navbar) to play it.
    // The <audio> tag's <source src="..."> in index.html MUST match this
    // exact filename/path, or the browser will 404 on it.
    // Browsers block audio autoplay, so playback only starts on click —
    // that's expected behavior, not a bug.
    // =============================================
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    if (musicToggle && bgMusic) {
        // Log a clear diagnostic the moment the browser fails to resolve
        // the audio source, instead of only finding out on click.
        bgMusic.addEventListener('error', () => {
            const src = bgMusic.querySelector('source')?.src || bgMusic.currentSrc;
            console.error('Background music failed to load. Checked URL:', src);
        });

        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                    musicToggle.querySelector('i').className = 'fas fa-pause';
                    musicToggle.setAttribute('aria-label', 'Pause music');
                    musicToggle.title = 'Pause music';
                }).catch(() => {
                    showNotification('Add "song.mp3" next to index.html to enable music.', 'info');
                });
            } else {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
                musicToggle.querySelector('i').className = 'fas fa-music';
                musicToggle.setAttribute('aria-label', 'Play music');
                musicToggle.title = 'Play music';
            }
        });

        // If the song ends and isn't set to loop for some reason, reset the icon
        bgMusic.addEventListener('pause', () => {
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('i').className = 'fas fa-music';
        });
        bgMusic.addEventListener('play', () => {
            musicToggle.classList.add('playing');
            musicToggle.querySelector('i').className = 'fas fa-pause';
        });
    }

    console.log('Portfolio website fully initialized!');
});
