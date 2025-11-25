// ============================================
// GLOBAL VARIABLES
// ============================================
let diceChart = null;
let spinnerChart = null;
let diceRolls = [];
let spinnerValues = [];

// ============================================
// PARTICLE ANIMATION BACKGROUND
// ============================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    const particles = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Highlight active section in navigation
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.content-card, .interactive-card, .challenge-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

// ============================================
// DICE SIMULATOR
// ============================================
function initDiceSimulator() {
    const rollButton = document.getElementById('rollDice');
    const rollMultipleButton = document.getElementById('rollMultiple');
    const resetButton = document.getElementById('resetDice');
    const diceDisplay = document.getElementById('diceDisplay');
    const totalRollsDisplay = document.getElementById('totalRolls');
    const avgRollDisplay = document.getElementById('avgRoll');

    const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    // Initialize chart
    const ctx = document.getElementById('diceChart').getContext('2d');
    diceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                label: 'Frequency',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(129, 140, 248, 0.6)',
                    'rgba(6, 182, 212, 0.6)',
                    'rgba(34, 211, 238, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(251, 191, 36, 0.6)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(129, 140, 248, 1)',
                    'rgba(6, 182, 212, 1)',
                    'rgba(34, 211, 238, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(251, 191, 36, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Dice Roll Distribution',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#cbd5e1',
                        precision: 0
                    },
                    grid: { color: 'rgba(99, 102, 241, 0.1)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(99, 102, 241, 0.1)' }
                }
            }
        }
    });

    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function updateDisplay(value) {
        diceDisplay.textContent = diceFaces[value - 1];
        diceDisplay.classList.add('rolling');
        setTimeout(() => diceDisplay.classList.remove('rolling'), 500);
    }

    function updateStats() {
        totalRollsDisplay.textContent = diceRolls.length;
        if (diceRolls.length > 0) {
            const avg = diceRolls.reduce((a, b) => a + b, 0) / diceRolls.length;
            avgRollDisplay.textContent = avg.toFixed(2);
        }
    }

    function updateChart() {
        const frequencies = [0, 0, 0, 0, 0, 0];
        diceRolls.forEach(roll => frequencies[roll - 1]++);
        diceChart.data.datasets[0].data = frequencies;
        diceChart.update();
    }

    rollButton.addEventListener('click', () => {
        const value = rollDice();
        diceRolls.push(value);
        updateDisplay(value);
        updateStats();
        updateChart();
    });

    rollMultipleButton.addEventListener('click', () => {
        for (let i = 0; i < 100; i++) {
            diceRolls.push(rollDice());
        }
        updateDisplay(diceRolls[diceRolls.length - 1]);
        updateStats();
        updateChart();
    });

    resetButton.addEventListener('click', () => {
        diceRolls = [];
        diceDisplay.textContent = '🎲';
        totalRollsDisplay.textContent = '0';
        avgRollDisplay.textContent = '-';
        diceChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
        diceChart.update();
    });
}

// ============================================
// SPINNER SIMULATOR
// ============================================
function initSpinnerSimulator() {
    const spinButton = document.getElementById('spinButton');
    const spinMultipleButton = document.getElementById('spinMultiple');
    const resetButton = document.getElementById('resetSpinner');
    const spinner = document.getElementById('spinner');
    const spinnerArrow = document.getElementById('spinnerArrow');
    const spinnerValue = document.getElementById('spinnerValue');
    const totalSpinsDisplay = document.getElementById('totalSpins');
    const avgSpinDisplay = document.getElementById('avgSpin');

    // Initialize chart
    const ctx = document.getElementById('spinnerChart').getContext('2d');
    spinnerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Value',
                data: [],
                borderColor: 'rgba(6, 182, 212, 1)',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(6, 182, 212, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Spinner Values Over Time',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 1,
                    ticks: {
                        color: '#cbd5e1',
                        stepSize: 0.2
                    },
                    grid: { color: 'rgba(99, 102, 241, 0.1)' }
                },
                x: {
                    ticks: {
                        color: '#cbd5e1',
                        maxTicksLimit: 10
                    },
                    grid: { color: 'rgba(99, 102, 241, 0.1)' }
                }
            }
        }
    });

    function spin() {
        return Math.random();
    }

    function updateDisplay(value) {
        const rotation = value * 360;
        spinnerArrow.style.transform = `rotate(${rotation}deg)`;
        spinnerArrow.style.transformOrigin = '100px 100px';
        spinnerValue.textContent = value.toFixed(3);

        // Animate spinner rotation
        spinner.style.transform = `rotate(${rotation + 1080}deg)`;
        setTimeout(() => {
            spinner.style.transform = 'rotate(0deg)';
            spinner.style.transition = 'none';
            setTimeout(() => {
                spinner.style.transition = 'transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
            }, 50);
        }, 2000);
    }

    function updateStats() {
        totalSpinsDisplay.textContent = spinnerValues.length;
        if (spinnerValues.length > 0) {
            const avg = spinnerValues.reduce((a, b) => a + b, 0) / spinnerValues.length;
            avgSpinDisplay.textContent = avg.toFixed(3);
        }
    }

    function updateChart() {
        const maxPoints = 50;
        const labels = spinnerValues.slice(-maxPoints).map((_, i) => i + 1);
        const data = spinnerValues.slice(-maxPoints);

        spinnerChart.data.labels = labels;
        spinnerChart.data.datasets[0].data = data;
        spinnerChart.update();
    }

    spinButton.addEventListener('click', () => {
        const value = spin();
        spinnerValues.push(value);
        updateDisplay(value);
        updateStats();
        updateChart();
    });

    spinMultipleButton.addEventListener('click', () => {
        for (let i = 0; i < 100; i++) {
            spinnerValues.push(spin());
        }
        updateDisplay(spinnerValues[spinnerValues.length - 1]);
        updateStats();
        updateChart();
    });

    resetButton.addEventListener('click', () => {
        spinnerValues = [];
        spinnerValue.textContent = '0.000';
        totalSpinsDisplay.textContent = '0';
        avgSpinDisplay.textContent = '-';
        spinnerArrow.style.transform = 'rotate(0deg)';
        spinner.style.transform = 'rotate(0deg)';
        spinnerChart.data.labels = [];
        spinnerChart.data.datasets[0].data = [];
        spinnerChart.update();
    });
}

// ============================================
// CHALLENGE QUESTIONS
// ============================================
function toggleAnswer(questionNumber) {
    const answer = document.getElementById(`answer${questionNumber}`);
    const button = answer.previousElementSibling;

    if (answer.classList.contains('visible')) {
        answer.classList.remove('visible');
        button.textContent = 'Reveal Answer';
    } else {
        answer.classList.add('visible');
        button.textContent = 'Hide Answer';
    }
}

// Make toggleAnswer available globally
window.toggleAnswer = toggleAnswer;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initScrollReveal();
    initDiceSimulator();
    initSpinnerSimulator();

    console.log('🎲 Random Variables & Sample Spaces website loaded successfully!');
    console.log('✨ Explore the interactive examples and challenge yourself!');
});
