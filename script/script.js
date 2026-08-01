const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.nav-links');

function setMenu(open) {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
});

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const constellationCanvas = document.getElementById('knowledgeConstellation');

class KnowledgeConstellation {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.nodes = [];
        this.animationFrame = null;
        this.resizeFrame = null;
        this.time = 0;
        this.pointer = { x: -1000, y: -1000 };

        this.knowledge = [
            { label: 'CATIA V5', x: 0.1, y: 0.22, color: '#ff8d4d' },
            { label: 'Surface Design', x: 0.27, y: 0.13, color: '#ff8d4d' },
            { label: 'Manufacturing', x: 0.2, y: 0.43, color: '#ff8d4d' },
            { label: 'Parametric CAD', x: 0.35, y: 0.62, color: '#ff8d4d' },
            { label: 'Python', x: 0.48, y: 0.3, color: '#c9ff57' },
            { label: 'Automation', x: 0.56, y: 0.52, color: '#c9ff57' },
            { label: 'IoT', x: 0.48, y: 0.76, color: '#c9ff57' },
            { label: 'React', x: 0.7, y: 0.2, color: '#79a8ff' },
            { label: 'TypeScript', x: 0.82, y: 0.36, color: '#79a8ff' },
            { label: 'Mobile Apps', x: 0.72, y: 0.66, color: '#79a8ff' },
            { label: 'AI Tools', x: 0.9, y: 0.58, color: '#79a8ff' },
            { label: 'Product Thinking', x: 0.84, y: 0.82, color: '#e9efe9' }
        ];

        this.onResize = () => {
            cancelAnimationFrame(this.resizeFrame);
            this.resizeFrame = requestAnimationFrame(() => this.resize());
        };

        this.onPointerMove = (event) => {
            const bounds = this.canvas.getBoundingClientRect();
            this.pointer.x = event.clientX - bounds.left;
            this.pointer.y = event.clientY - bounds.top;
        };

        this.onPointerLeave = () => {
            this.pointer.x = -1000;
            this.pointer.y = -1000;
        };

        this.onVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            } else if (!reduceMotion && !this.animationFrame) {
                this.animate();
            }
        };

        window.addEventListener('resize', this.onResize);
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });
        document.addEventListener('mouseleave', this.onPointerLeave);
        document.addEventListener('visibilitychange', this.onVisibilityChange);

        this.resize();
        if (reduceMotion) this.draw();
        else this.animate();
    }

    seededValue(index) {
        const value = Math.sin(index * 9283.17 + 41.73) * 43758.5453;
        return value - Math.floor(value);
    }

    resize() {
        const bounds = this.canvas.getBoundingClientRect();
        const density = Math.min(window.devicePixelRatio || 1, 2);
        this.width = Math.max(1, Math.round(bounds.width));
        this.height = Math.max(1, Math.round(bounds.height));
        this.canvas.width = Math.round(this.width * density);
        this.canvas.height = Math.round(this.height * density);
        this.context.setTransform(density, 0, 0, density, 0, 0);
        this.createNodes();
        this.draw();
    }

    createNodes() {
        const compact = this.width < 700;
        const visibleKnowledge = compact
            ? this.knowledge.filter((_, index) => index % 2 === 0)
            : this.knowledge;

        this.nodes = visibleKnowledge.map((item, index) => ({
            ...item,
            x: item.x * this.width,
            y: item.y * this.height,
            vx: (this.seededValue(index + 2) - 0.5) * 0.32,
            vy: (this.seededValue(index + 19) - 0.5) * 0.32,
            radius: compact ? 2.8 : 3.4,
            phase: this.seededValue(index + 28) * Math.PI * 2,
            isKnowledge: true
        }));

        const satelliteCount = compact ? 10 : 24;
        for (let index = 0; index < satelliteCount; index += 1) {
            this.nodes.push({
                x: this.seededValue(index + 40) * this.width,
                y: this.seededValue(index + 80) * this.height,
                vx: (this.seededValue(index + 120) - 0.5) * 0.48,
                vy: (this.seededValue(index + 160) - 0.5) * 0.48,
                radius: 0.9 + this.seededValue(index + 200) * 1.35,
                phase: this.seededValue(index + 240) * Math.PI * 2,
                color: index % 3 === 0 ? '#c9ff57' : '#708078',
                isKnowledge: false
            });
        }
    }

    update() {
        this.time += 0.018;
        this.nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 12 || node.x > this.width - 12) node.vx *= -1;
            if (node.y < 12 || node.y > this.height - 12) node.vy *= -1;
        });
    }

    drawConnections() {
        const connectionDistance = this.width < 700 ? 135 : 205;

        for (let first = 0; first < this.nodes.length; first += 1) {
            for (let second = first + 1; second < this.nodes.length; second += 1) {
                const a = this.nodes[first];
                const b = this.nodes[second];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                if (distance > connectionDistance) continue;

                const pointerDistance = Math.min(
                    Math.hypot(a.x - this.pointer.x, a.y - this.pointer.y),
                    Math.hypot(b.x - this.pointer.x, b.y - this.pointer.y)
                );
                const active = pointerDistance < 170;
                const pulse = 0.88 + Math.sin(this.time * 1.4 + first * 0.4) * 0.12;
                const alpha = (1 - distance / connectionDistance) * (active ? 0.9 : 0.55) * pulse;

                this.context.beginPath();
                this.context.moveTo(a.x, a.y);
                this.context.lineTo(b.x, b.y);
                this.context.strokeStyle = `rgba(201, 255, 87, ${alpha})`;
                this.context.lineWidth = active ? 1.45 : 0.9;
                this.context.stroke();
            }
        }
    }

    drawNodes() {
        const compact = this.width < 700;

        this.nodes.forEach((node) => {
            const pointerDistance = Math.hypot(node.x - this.pointer.x, node.y - this.pointer.y);
            const active = pointerDistance < 140;
            const pulse = Math.sin(this.time * 2 + node.phase) * 0.75;

            this.context.save();
            this.context.shadowColor = node.color;
            this.context.shadowBlur = active ? 22 : node.isKnowledge ? 13 : 7;
            this.context.beginPath();
            this.context.arc(node.x, node.y, node.radius + pulse + (active ? 1.5 : 0), 0, Math.PI * 2);
            this.context.fillStyle = node.color;
            this.context.fill();
            this.context.restore();

            if (!node.isKnowledge) return;

            this.context.font = `500 ${compact ? 9 : 11}px "IBM Plex Mono", monospace`;
            this.context.fillStyle = active ? 'rgba(255, 255, 255, 1)' : 'rgba(233, 239, 233, 0.9)';
            this.context.fillText(node.label, node.x + 11, node.y + 4);
        });
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawConnections();
        this.drawNodes();
    }

    animate() {
        this.update();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

if (constellationCanvas) new KnowledgeConstellation(constellationCanvas);

if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach((item) => revealObserver.observe(item));
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
        const response = await fetch('https://formspree.io/f/xwpgqarz', {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' }
        });

        if (!response.ok) throw new Error('Form submission failed');

        contactForm.reset();
        formStatus.textContent = 'Thanks—your message has been sent.';
        formStatus.classList.add('success');
    } catch (error) {
        formStatus.innerHTML = 'The form could not send. Please email <a href="mailto:swtopherpid09@gmail.com">swtopherpid09@gmail.com</a> instead.';
        formStatus.classList.add('error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
    }
});

const personaToggle = document.getElementById('persona-toggle');
const personaPanel = document.getElementById('persona-panel');
const personaClose = document.getElementById('persona-close');
const personaForm = document.getElementById('persona-form');
const personaInput = document.getElementById('persona-input');
const personaMessages = document.getElementById('persona-messages');
const personaTyping = document.getElementById('persona-typing');
const personaDisclosure = document.getElementById('persona-disclosure');
const personaEndpoint = document.querySelector('meta[name="christopher-ai-endpoint"]')?.content.trim() || '';
const personaConversation = [];
let personaBusy = false;

const personaAnswers = [
    {
        keywords: ['hire', 'why', 'value', 'different', 'unique'],
        answer: 'Christopher bridges two worlds that are usually separated: 10+ years of CAD and manufacturing experience, plus hands-on software product development. He can understand the physical constraint, design the workflow, and build the tool that removes repetitive work—without losing sight of the people using it.'
    },
    {
        keywords: ['catia', 'cad', 'surface', 'manufacturing', 'product design'],
        answer: 'Christopher has more than a decade of experience across CATIA V5, surface and part design, assemblies, drafting, CAD/CAM, and manufacturing workflows. His strongest value is turning that specialist engineering knowledge into reusable parametric methods and automation.'
    },
    {
        keywords: ['scheduler', 'resource scheduler', 'engineering resource', 'guest engineer', 'fastapi', 'pwa'],
        answer: 'Engineering Resource Scheduler is Christopher’s newest project: a production-ready, local-first desktop and PWA system for coordinating in-house and guest engineers. It replaces spreadsheet planning with role-aware workflows, schedule-conflict detection, transactional Excel and CSV migration, audit logs, notifications, and resilient SQLite backup and restore.'
    },
    {
        keywords: ['japanese', 'tutor', 'learning'],
        answer: 'Japanese Tutor is an active Expo and React Native learning app with structured lessons, quiz grading, progress and streak services, and an offline-ready data foundation. It demonstrates Christopher’s product thinking, TypeScript implementation, and focus on dependable learning flows.'
    },
    {
        keywords: ['agent army', 'stronghold', 'agent', 'ai project'],
        answer: 'Agent Army Stronghold explores coordinated AI-agent workflows and practical tooling around multi-agent development. It reflects Christopher’s interest in making AI systems useful, inspectable, and connected to real engineering work.'
    },
    {
        keywords: ['quickscan', 'quick scan', 'scanner', 'payment'],
        answer: 'QuickScan Pay is a privacy-conscious payment-screenshot workflow. OCR runs locally in the browser, only extracted text reaches a secret-backed MiniMax M3 Worker, and users must verify the recipient, Philippine mobile number, and amount before opening GCash.'
    },
    {
        keywords: ['project', 'portfolio', 'latest', 'work', 'build'],
        answer: 'His current portfolio highlights Engineering Resource Scheduler, Japanese Tutor, Agent Army Stronghold, QuickScan Pay, and Parametric CAD Workflows. Together they show the full range: engineering operations, mobile products, AI tooling, practical interfaces, and manufacturing automation.'
    },
    {
        keywords: ['react', 'typescript', 'python', 'software', 'developer', 'code'],
        answer: 'Christopher builds with React, React Native, TypeScript, JavaScript, Python, Node.js, SQL, and automation tools. He applies them as product tools—not just technologies—especially where software can simplify an engineering or operational workflow.'
    },
    {
        keywords: ['available', 'contact', 'email', 'opportunity', 'role'],
        answer: 'Christopher is open to conversations about product design, CAD automation, software products, and hybrid engineering roles. The fastest way to reach him is swtopherpid09@gmail.com, or you can use the contact form on this page.'
    }
];

function setPersona(open) {
    if (!personaToggle || !personaPanel) return;
    personaToggle.setAttribute('aria-expanded', String(open));
    personaPanel.setAttribute('aria-hidden', String(!open));
    personaPanel.classList.toggle('is-open', open);
    if (open) window.setTimeout(() => personaInput?.focus(), 220);
}

function appendPersonaMessage(text, sender) {
    if (!personaMessages) return;
    const message = document.createElement('div');
    message.className = `persona-message persona-message-${sender}`;
    message.textContent = text;
    personaMessages.appendChild(message);
    personaMessages.scrollTop = personaMessages.scrollHeight;
}

function answerPersonaQuestion(question) {
    const normalized = question.toLowerCase();
    const ranked = personaAnswers
        .map((entry) => ({
            ...entry,
            score: entry.keywords.reduce((total, keyword) => total + (normalized.includes(keyword) ? keyword.length : 0), 0)
        }))
        .sort((a, b) => b.score - a.score);

    if (ranked[0]?.score > 0) return ranked[0].answer;
    return 'Christopher’s work sits at the intersection of product design, manufacturing, automation, and software. Try asking about his CATIA background, current projects, development skills, availability, or why that hybrid perspective is valuable.';
}

async function requestMiniMaxAnswer(message) {
    if (!personaEndpoint) return null;

    const response = await fetch(personaEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            history: personaConversation.slice(-6)
        })
    });

    if (!response.ok) throw new Error(`Christopher AI request failed with status ${response.status}`);
    const payload = await response.json();
    if (typeof payload.answer !== 'string' || !payload.answer.trim()) {
        throw new Error('Christopher AI returned an invalid response');
    }
    return payload.answer.trim();
}

async function submitPersonaQuestion(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || !personaInput || !personaTyping || personaBusy) return;

    personaBusy = true;
    appendPersonaMessage(cleanQuestion, 'user');
    personaInput.value = '';
    personaTyping.classList.add('is-visible');

    try {
        const miniMaxAnswer = await requestMiniMaxAnswer(cleanQuestion);
        const answer = miniMaxAnswer || answerPersonaQuestion(cleanQuestion);
        personaConversation.push(
            { role: 'user', content: cleanQuestion },
            { role: 'assistant', content: answer }
        );
        appendPersonaMessage(answer, 'ai');
        if (personaDisclosure) {
            personaDisclosure.textContent = miniMaxAnswer
                ? 'Powered by MiniMax M3 · Curated Christopher knowledge'
                : 'Curated portfolio knowledge · MiniMax ready';
        }
    } catch (error) {
        const fallbackAnswer = answerPersonaQuestion(cleanQuestion);
        personaConversation.push(
            { role: 'user', content: cleanQuestion },
            { role: 'assistant', content: fallbackAnswer }
        );
        appendPersonaMessage(fallbackAnswer, 'ai');
        if (personaDisclosure) personaDisclosure.textContent = 'Curated fallback active · MiniMax unavailable';
    } finally {
        personaTyping.classList.remove('is-visible');
        personaBusy = false;
    }
}

personaToggle?.addEventListener('click', () => {
    setPersona(personaToggle.getAttribute('aria-expanded') !== 'true');
});

personaClose?.addEventListener('click', () => setPersona(false));

personaForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    void submitPersonaQuestion(personaInput?.value || '');
});

document.querySelectorAll('[data-persona-question]').forEach((button) => {
    button.addEventListener('click', () => {
        void submitPersonaQuestion(button.dataset.personaQuestion || '');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && personaToggle?.getAttribute('aria-expanded') === 'true') {
        setPersona(false);
        personaToggle.focus();
    }
});
