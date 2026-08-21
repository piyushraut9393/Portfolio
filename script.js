/* ==========================================================================
   DEVELOPER PORTFOLIO - PIYUSH SANTOSH RAUT INTERACTIVE JS ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. Custom Glowing Cursor Follower
       -------------------------------------------------------------------------- */
    const cursorDot = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        if (cursorFollower) {
            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
        }

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    const hoverables = document.querySelectorAll('a, button, .glass-card, input, textarea');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorFollower) {
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.6)';
                cursorFollower.style.borderColor = 'var(--cyan-accent)';
                cursorFollower.style.boxShadow = '0 0 25px var(--cyan-accent)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorFollower) {
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.borderColor = 'var(--purple-primary)';
                cursorFollower.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
            }
        });
    });

    /* --------------------------------------------------------------------------
       2. Canvas Particle Mesh System
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 18), 70);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#a855f7' : '#00f2fe';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawMesh() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 130})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }

                // Connect to mouse cursor
                const mouseDx = particles[i].x - mouseX;
                const mouseDy = particles[i].y - mouseY;
                const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                if (mouseDist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${1 - mouseDist / 160})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            requestAnimationFrame(drawMesh);
        }
        drawMesh();
    }

    /* --------------------------------------------------------------------------
       3. Typewriter Hero Animation for Piyush Raut
       -------------------------------------------------------------------------- */
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const phrases = [
            'AI & ML Engineer',
            'Full-Stack Developer',
            'Python Developer',
            'Mountreach Solutions Intern'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 50;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(typeLoop, typingSpeed);
        }
        typeLoop();
    }

    /* --------------------------------------------------------------------------
       4. Built-in 3D Card Tilt Physics
       -------------------------------------------------------------------------- */
    const tiltElements = document.querySelectorAll('.tilt-element');
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* --------------------------------------------------------------------------
       5. Stats Counter Animation Observer
       -------------------------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                hasAnimatedStats = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    let current = 0;
                    const increment = Math.max(1, Math.ceil(target / 40));

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            stat.textContent = current;
                        }
                    }, 40);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    /* --------------------------------------------------------------------------
       6. Project Showcase Category Filters
       -------------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
       7. Interactive Developer CLI Terminal for Piyush Raut
       -------------------------------------------------------------------------- */
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');

    const commands = {
        'help': `Available commands for Piyush Santosh Raut's CLI:\n
  <span class="term-highlight">skills</span>     - Display AI/ML & Full-Stack technical stack
  <span class="term-highlight">projects</span>   - List featured AI, OpenCV & Python projects
  <span class="term-highlight">about</span>      - View Piyush's biography & career focus
  <span class="term-highlight">mountreach</span> - Internship experience at Mountreach Solutions Pvt Ltd
  <span class="term-highlight">contact</span>    - View direct email & social links
  <span class="term-highlight">whoami</span>     - Output current user permissions
  <span class="term-highlight">matrix</span>     - Trigger glowing green matrix stream
  <span class="term-highlight">clear</span>      - Clear terminal console`,

        'skills': `⚡ <span class="term-highlight">AI & Machine Learning:</span> Python, PyTorch, TensorFlow, Scikit-Learn, OpenCV, Pandas, NumPy\n⚡ <span class="term-highlight">Full-Stack Web:</span> HTML5, CSS Glow, JavaScript, React.js, FastAPI, Flask, Node.js\n⚡ <span class="term-highlight">Databases & Tools:</span> PostgreSQL, MySQL, Git, GitHub, Jupyter Notebooks`,

        'projects': `🚀 <span class="term-highlight">Featured Projects:</span>\n 1. AI Disease Diagnostics & Health Predictor [Python / Streamlit]\n 2. Real-Time Facial Recognition System [OpenCV / TensorFlow]\n 3. Mountreach AI Analytics Dashboard [React / FastAPI]\n 4. Smart NLP Text Summarizer [Python / NLTK]`,

        'about': `👨‍💻 <span class="term-highlight">Piyush Santosh Raut</span> - AI & ML Engineer and Full-Stack Developer from Ambajogai, Maharashtra, India. Completed internship at Mountreach Solutions Pvt Ltd.`,

        'mountreach': `🏢 <span class="term-highlight">Mountreach Solutions Pvt Ltd Internship:</span>\n Worked on AI & ML Development, training predictive machine learning models, computer vision scripts using OpenCV, and building interactive web dashboards.`,

        'contact': `📧 Email: <span class="term-highlight">piyushraut9393@gmail.com</span>\n🐙 GitHub: <span class="term-highlight">github.com/piyushraut9393</span>\n💼 LinkedIn: <span class="term-highlight">linkedin.com/in/piyush-raut-3047a9270</span>\n📍 Location: Ambajogai, Maharashtra, India`,

        'whoami': `guest@piyush-portfolio: [Role: Visitor] - Welcome to Piyush Raut's AI Portfolio!`,

        'sudo': `<span class="term-error">Access Denied: Superuser access requires Piyush's permission! 🤖</span>`,

        'matrix': `🟢 Initiating Neural AI stream... 01000001 01001001 00100000 00110010 00110000 00110010 00110110`
    };

    if (terminalInput && terminalBody) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawCmd = terminalInput.value.trim();
                const cmd = rawCmd.toLowerCase();

                // Echo command line
                appendTermLine(`<span class="prompt-user">piyush@ambajogai:~$</span> ${escapeHTML(rawCmd)}`);

                if (cmd === 'clear') {
                    terminalBody.innerHTML = '';
                } else if (commands[cmd]) {
                    appendTermLine(commands[cmd]);
                } else if (cmd !== '') {
                    appendTermLine(`<span class="term-error">Command not found: '${escapeHTML(rawCmd)}'. Type 'help' for available commands.</span>`);
                }

                terminalInput.value = '';
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });

        function appendTermLine(htmlContent) {
            const line = document.createElement('div');
            line.className = 'term-line';
            line.innerHTML = htmlContent;
            terminalBody.appendChild(line);
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
        }
    }

    /* --------------------------------------------------------------------------
       8. Email Clipboard Copy
       -------------------------------------------------------------------------- */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    if (copyEmailBtn && emailText) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailText.textContent.trim());
            copyEmailBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            copyEmailBtn.style.color = '#22c55e';
            setTimeout(() => {
                copyEmailBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                copyEmailBtn.style.color = '';
            }, 2000);
        });
    }

    /* --------------------------------------------------------------------------
       9. Contact Form Feedback Simulation
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = '✨ Thank you! Your message has been sent to Piyush Raut successfully.';
            contactForm.reset();

            setTimeout(() => {
                formFeedback.textContent = '';
            }, 6000);
        });
    }

    /* --------------------------------------------------------------------------
       10. Mobile Menu Navigation Handler & Scroll Spy
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});
