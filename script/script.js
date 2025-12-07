// ==========================================
// 1. IMPORTS & SETUP
// ==========================================
import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 2. SCROLL REVEAL ANIMATION
// ==========================================
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 150) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal();

// ==========================================
// 3. CONSTELLATION / MIND MAP ANIMATION
// ==========================================

// --- DATA: The Mind Map Tags ---
const idTags = [
    "Design Thinking", "User Research", "Sketching", "Ergonomics","Generative Shape Design","Part Design",
    "CAD", "Rendering", "Prototyping", "Manufacturing", "CMF", "Form Giving", "Sustainability",
    "SolidWorks", "Rhino", "KeyShot", "Adobe CC","Catia v5"
];

const fsTags = [
    "HTML/CSS/JS", "React", "Redux", "Tailwind",
    "Node.js", "API Design", "Auth", "SQL", "MongoDB", "Redis",
    "Git", "Docker", "AWS", "CI/CD"
];

const bridgeTags = [
    "Physical-Digital", "IoT", "Interaction Design", 
    "Digital Fabrication", "Three.js", "WebGL"
];

// --- Class Definition ---
class ConstellationEffect {
    constructor(canvasId, options) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.particles = [];

        this.tags = options.tags || [];
        this.baseColor = options.baseColor || {r:255, g:255, b:255};
        this.enableText = options.enableText !== false;
        this.density = options.density || 1;
        this.lineDist = options.lineDist || 130;
        this.lineWidth = options.lineWidth || 0.8; 

        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.init();
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.width = this.canvas.width = parent.offsetWidth;
        this.height = this.canvas.height = parent.offsetHeight;
        this.init(); 
    }

    init() {
        this.particles = [];
        // Text Nodes
        if (this.tags.length > 0) {
            this.tags.forEach(tagObj => {
                let text = typeof tagObj === 'string' ? tagObj : tagObj.text;
                let color = typeof tagObj === 'string' ? `rgba(${this.baseColor.r},${this.baseColor.g},${this.baseColor.b}, 1)` : tagObj.color;
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: 3, text: text, isNode: true, color: color
                });
            });
        }
        // Satellite Nodes
        const extraParticles = 40 * this.density; 
        for (let i = 0; i < extraParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 0.5,
                text: null, isNode: false,
                color: `rgba(${this.baseColor.r},${this.baseColor.g},${this.baseColor.b}, 0.5)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            if (p.isNode && this.enableText) {
                this.ctx.font = "10px Inter";
                this.ctx.fillStyle = p.color.replace('1)', '0.7)');
                this.ctx.fillText(p.text, p.x + 8, p.y + 3);
            }
        });

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);

                if (dist < this.lineDist) {
                    this.ctx.beginPath();
                    const alpha = 1 - (dist / this.lineDist); 
                    if(p1.color === p2.color) {
                         this.ctx.strokeStyle = p1.color.replace('1)', `${alpha})`).replace('0.5)', `${alpha})`);
                    } else {
                        this.ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.5})`;
                    }
                    this.ctx.lineWidth = this.lineWidth;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}

// --- Initialize Animations ---
const heroData = [
    ...idTags.map(t => ({ text: t, color: "rgba(20, 184, 166, 1)" })),
    ...fsTags.map(t => ({ text: t, color: "rgba(59, 130, 246, 1)" })),
    ...bridgeTags.map(t => ({ text: t, color: "rgba(255, 255, 255, 1)" }))
];

// 1. Hero Canvas
new ConstellationEffect('heroCanvas', { tags: heroData, lineDist: 120, lineWidth: 0.6, density: 1.5 });
// 2. ID Card Canvas
const idCardData = idTags.map(t => ({ text: t, color: "rgba(20, 184, 166, 1)" }));
new ConstellationEffect('designCanvas', { tags: idCardData, baseColor: {r:20, g:184, b:166}, lineDist: 100, density: 0.8, enableText: true });
// 3. Dev Card Canvas
const fsCardData = fsTags.map(t => ({ text: t, color: "rgba(59, 130, 246, 1)" }));
new ConstellationEffect('codeCanvas', { tags: fsCardData, baseColor: {r:59, g:130, b:246}, lineDist: 100, density: 0.8, enableText: true });


// ==========================================
// 4. FIREBASE PROJECT FETCHING
// ==========================================
let projectsData = {
    design: [],
    dev: []
};

async function fetchProjects() {
    try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        projectsData.design = [];
        projectsData.dev = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.category === 'design') {
                projectsData.design.push(data);
            } else if (data.category === 'dev') {
                projectsData.dev.push(data);
            }
        });
        console.log("Projects loaded:", projectsData);
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}
// Load projects immediately
document.addEventListener("DOMContentLoaded", fetchProjects);


// ==========================================
// 5. MODAL LOGIC (With Reviews)
// ==========================================
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalList = document.getElementById('modalProjectList');

window.openModal = async function(category) {
    modalList.innerHTML = '';
    modalTitle.innerText = category === 'design' ? "Industrial Design Projects" : "Development Projects";
    
    const data = projectsData[category];

    // If no data loaded yet (or empty)
    if (!data || data.length === 0) {
        modalList.innerHTML = '<p style="text-align:center; color:#94a3b8;">Loading projects from database...</p>';
        // Optional: Retry fetch or just wait
        if (data && data.length === 0) {
            modalList.innerHTML = '<p style="text-align:center; color:#94a3b8;">No projects found in this category yet.</p>';
        }
        return;
    }

    for (const project of data) {
        const statusClass = project.status === 'Finished' ? 'status-done' : 'status-ongoing';
        const linkHtml = project.link && project.link !== "#" ? `<a href="${project.link}" target="_blank" class="modal-btn">View Project <i class="fas fa-external-link-alt"></i></a>` : '';
        
        const typeBadgeClass = project.type.includes("Paid") ? "badge-paid" : "badge-personal";
        const roleBadgeClass = project.roleType.includes("Solo") ? "badge-solo" : "badge-collab";

        const itemDiv = document.createElement('div');
        itemDiv.className = 'project-item';
        itemDiv.onclick = () => toggleDetails(itemDiv, project.id);

        itemDiv.innerHTML = `
            <div class="project-summary">
                <div class="project-title">
                    <h4>${project.title} <span class="project-status ${statusClass}">${project.status}</span></h4>
                </div>
                <i class="fas fa-chevron-down toggle-icon"></i>
            </div>
            <div class="project-details">
                <div class="modal-meta-tags">
                    <span class="meta-badge ${typeBadgeClass}">${project.type}</span>
                    <span class="meta-badge ${roleBadgeClass}">${project.roleType}</span>
                </div>
                <div class="detail-section"><h5>Description</h5><p>${project.desc}</p></div>
                <div class="detail-section">
                    <h5>Technologies</h5>
                    <div class="tech-tags">${project.tech.map(t => `<span>${t}</span>`).join('')}</div>
                </div>
                <div class="detail-section">
                    <h5>Key Thoughts</h5>
                    <p style="font-style: italic; color: #94a3b8;">"${project.thoughts}"</p>
                </div>
                <div id="review-container-${project.id}"></div>
                ${linkHtml}
            </div>
        `;
        modalList.appendChild(itemDiv);
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

window.closeModal = function() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

window.toggleDetails = async function(element, projectId) {
    document.querySelectorAll('.project-item').forEach(item => {
        if (item !== element) item.classList.remove('active');
    });

    element.classList.toggle('active');

    if (element.classList.contains('active')) {
        const reviewContainer = document.getElementById(`review-container-${projectId}`);
        if (reviewContainer && reviewContainer.innerHTML === "") {
            reviewContainer.innerHTML = '<p style="font-size:0.8rem; color:var(--primary-color);">Checking for reviews...</p>';
            
            try {
                const reviewsRef = collection(db, "reviews");
                const q = query(reviewsRef, where("projectId", "==", projectId), where("approved", "==", true));
                const querySnapshot = await getDocs(q);

                reviewContainer.innerHTML = ""; 

                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const review = doc.data();
                        const initial = review.author.charAt(0);
                        
                        const reviewHtml = `
                            <div class="review-section">
                                <h5 style="color:var(--accent-color); margin-bottom:10px;">Client Feedback</h5>
                                <div class="review-box">
                                    <i class="fas fa-quote-left"></i>
                                    <p class="review-text">"${review.text}"</p>
                                    <div class="review-author">
                                        <div class="author-avatar">${initial}</div>
                                        <div class="author-info">
                                            <h6>${review.author}</h6>
                                            <span>${review.position}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        reviewContainer.innerHTML += reviewHtml;
                    });
                }
            } catch (error) {
                console.error("Firebase Review Error:", error);
                reviewContainer.innerHTML = ""; 
            }
        }
    }
}

window.onclick = function(event) {
    if (event.target == modal) closeModal();
}


// ==========================================
// 6. CONTACT FORM (FORMSPREE)
// ==========================================
// Note: Ensure your HTML contact form uses these IDs
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const status = document.getElementById("my-form-status");
        const btn = document.getElementById("submit-btn");
        const data = new FormData(event.target);

        const originalBtnText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // REPLACE WITH YOUR FORMSPREE URL
        fetch("https://formspree.io/f/xwpgqarz", {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "Thanks! Message received.";
                status.classList.remove("status-error"); status.classList.add("status-success");
                contactForm.reset();
            } else {
                status.innerHTML = "Oops! Error sending message.";
                status.classList.remove("status-success"); status.classList.add("status-error");
            }
        }).catch(error => {
            status.innerHTML = "Network error.";
            status.classList.remove("status-success"); status.classList.add("status-error");
        }).finally(() => {
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
            setTimeout(() => { status.style.display = 'none'; }, 5000);
        });
    });
}

// ==========================================
// 7. MOBILE MENU LOGIC
// ==========================================
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const menuIcon = document.querySelector('.menu-icon');

if (menuToggle) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => { menuToggle.checked = false; });
    });

    document.addEventListener('click', (e) => {
        if (menuToggle.checked) {
            if (!navLinks.contains(e.target) && !menuIcon.contains(e.target) && e.target !== menuToggle) {
                menuToggle.checked = false;
            }
        }
    });
}