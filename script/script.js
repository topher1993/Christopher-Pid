// --- Scroll Reveal Animation ---
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal();

// --- DATA: The Mind Map ---
// Cluster 1: Industrial Design
const idTags = [
    "Design Thinking", "User Research", "Sketching", "Ergonomics","Generative Shape Design","Part Design", // Process
    "CAD", "Rendering", "Prototyping", "Manufacturing",            // Technical
    "CMF", "Form Giving", "Sustainability",                        // Aesthetic
    "SolidWorks", "Rhino", "KeyShot", "Adobe CC","Catia v5"        // Tools
];

// Cluster 2: Full Stack Dev
const fsTags = [
    "HTML/CSS/JS", "React", "Redux", "Tailwind",                   // Frontend
    "Node.js", "API Design", "Auth",                               // Backend
    "SQL", "MongoDB", "Redis",                                     // Data
    "Git", "Docker", "AWS", "CI/CD"                                // DevOps
];

// Cluster 3: The Hybrid Bridge
const bridgeTags = [
    "Physical-Digital", "IoT", "Interaction Design", 
    "Digital Fabrication", "Three.js", "WebGL"
];

// --- Mind Map Constellation Class ---
class ConstellationEffect {
    constructor(canvasId, options) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.particles = [];

        // Options
        this.tags = options.tags || []; // Words to display
        this.baseColor = options.baseColor || {r:255, g:255, b:255}; // Fallback color
        this.enableText = options.enableText !== false; // Default true
        this.density = options.density || 1; // Multiplier for extra nodes
        
        // Configuration for "Distinct Lines"
        this.lineDist = options.lineDist || 130;
        this.lineWidth = options.lineWidth || 0.8; 

        // Bind resize
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

        // 1. Create Particles for TEXT tags (The Main Nodes)
        if (this.tags.length > 0) {
            this.tags.forEach(tagObj => {
                // If tagObj is just a string, convert to object with base color
                let text = typeof tagObj === 'string' ? tagObj : tagObj.text;
                let color = typeof tagObj === 'string' ? `rgba(${this.baseColor.r},${this.baseColor.g},${this.baseColor.b}, 1)` : tagObj.color;

                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.3, // Slower for text readability
                    vy: (Math.random() - 0.5) * 0.3,
                    size: 3, // Main nodes are bigger
                    text: text,
                    isNode: true,
                    color: color
                });
            });
        }

        // 2. Create "Satellite" Particles (Extra nodes for density)
        // We add extra dots to make the network look dense without adding too much text
        const extraParticles = 40 * this.density; 
        for (let i = 0; i < extraParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 0.5, // Satellites are smaller
                text: null,
                isNode: false,
                color: `rgba(${this.baseColor.r},${this.baseColor.g},${this.baseColor.b}, 0.5)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update & Draw Particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // Draw Dot
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw Text (Only for Main Nodes)
            if (p.isNode && this.enableText) {
                this.ctx.font = "10px Inter"; // Small font
                this.ctx.fillStyle = p.color.replace('1)', '0.7)'); // Slightly transparent text
                this.ctx.fillText(p.text, p.x + 8, p.y + 3);
            }
        });

        // Draw Connections
        // We optimized this loop to connect nearby nodes
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.lineDist) {
                    this.ctx.beginPath();
                    // Distinct lines: Higher opacity logic
                    const alpha = 1 - (dist / this.lineDist); 
                    
                    // Logic: If both particles have the same color, use that color. 
                    // If mixed, use a neutral gray.
                    if(p1.color === p2.color) {
                         // Extract RGB from the rgba string to apply new alpha
                         this.ctx.strokeStyle = p1.color.replace('1)', `${alpha})`).replace('0.5)', `${alpha})`);
                    } else {
                        this.ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.5})`; // Grey for mixing clusters
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

// --- INITIALIZE ANIMATIONS ---

// 1. HERO SECTION: The Convergence (Hybrid)
// We merge all three lists, assigning specific colors to visualize the distinct clusters merging.
const heroData = [
    ...idTags.map(t => ({ text: t, color: "rgba(20, 184, 166, 1)" })),  // Teal
    ...fsTags.map(t => ({ text: t, color: "rgba(59, 130, 246, 1)" })),  // Blue
    ...bridgeTags.map(t => ({ text: t, color: "rgba(255, 255, 255, 1)" })) // White (The Bridge)
];

new ConstellationEffect('heroCanvas', { 
    tags: heroData,
    lineDist: 120,
    lineWidth: 0.6,
    density: 1.5 // High density for the hero section
});


// 2. ID EXPERTISE CARD
// Only use ID tags. Color: Teal
const idCardData = idTags.map(t => ({ text: t, color: "rgba(20, 184, 166, 1)" }));

new ConstellationEffect('designCanvas', { 
    tags: idCardData,
    baseColor: {r:20, g:184, b:166},
    lineDist: 100,
    density: 0.8,
    enableText: true // Show text inside the card
});


// 3. FULL STACK EXPERTISE CARD
// Only use FS tags. Color: Blue
const fsCardData = fsTags.map(t => ({ text: t, color: "rgba(59, 130, 246, 1)" }));

new ConstellationEffect('codeCanvas', { 
    tags: fsCardData,
    baseColor: {r:59, g:130, b:246},
    lineDist: 100,
    density: 0.8,
    enableText: true
});
// --- PROJECT DATA & MODAL LOGIC ---

const projectsData = {
    design: [
        {
            title: "Automotive Mirror Housing",
            status: "Finished",
            desc: "A complex aesthetic surface study for a luxury vehicle side mirror.",
            tech: ["CATIA V5", "GSD", "Rendering"],
            thoughts: "The main challenge was maintaining G2 continuity across the primary housing curves.",
            link: "https://www.behance.net/" // Add your real link here
        },
        {
            title: "Ergonomic Handheld Device",
            status: "Ongoing",
            desc: "Concept design for a medical scanner focusing on grip comfort.",
            tech: ["SolidWorks", "3D Printing", "User Testing"],
            thoughts: "Currently iterating on the handle thickness based on user feedback.",
            link: "#"
        }
    ],
    dev: [
        {
            title: "CHTR Clothing E-Commerce",
            status: "Finished",
            desc: "A fully functional e-commerce platform built for a clothing brand. Handles user authentication, real-time product inventory, and secure data management.",
            tech: ["React.js", "Firebase Auth", "Firestore DB", "Material UI"],
            thoughts: "The biggest challenge was structuring the NoSQL database to handle variable product sizes and colors efficiently while keeping queries fast.",
            link: "#" // Add the live link if you have one, or keep #
        },
        {
            title: "Bio-Metric Health & Attendance",
            status: "Finished",
            desc: "An IoT-integrated web app that uses facial recognition for attendance while reading health data from ESP32 sensors.",
            tech: ["Face-api.js", "ESP32 C++", "Node.js", "c++"],
            thoughts: "Bridging the hardware-software gap was fun. I used WebSockets to stream data from the ESP32 directly to the client dashboard with near-zero latency.",
            link: "#"
        },
        // Keeping your Python tool as a 3rd item is good (shows automation skills)
        {
            title: "CATIA BOM Auto-Formatter",
            status: "Ongoing",
            desc: "Python automation script to clean up and structure raw Excel exports from CATIA for manufacturing teams.",
            tech: ["Python", "Pandas", "OpenPyXL"],
            thoughts: "Saved the engineering team approx. 4 hours/week by removing manual data entry errors.",
            link: "https://github.com/topher1993"
        }
    ]
};

// 2. Modal Functions
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalList = document.getElementById('modalProjectList');

function openModal(category) {
    modalList.innerHTML = '';
    
    // Set Title
    modalTitle.innerText = category === 'design' ? "Industrial Design Projects" : "Development Projects";
    
    const data = projectsData[category];

    data.forEach((project) => {
        const statusClass = project.status === 'Finished' ? 'status-done' : 'status-ongoing';
        
        // We render the Link Button only if a link exists and isn't just "#"
        const linkHtml = project.link && project.link !== "#" 
            ? `<a href="${project.link}" target="_blank" class="modal-btn">View Project <i class="fas fa-external-link-alt"></i></a>` 
            : '';

        const html = `
            <div class="project-item" onclick="toggleDetails(this)">
                <div class="project-summary">
                    <div class="project-title">
                        <h4>${project.title} <span class="project-status ${statusClass}">${project.status}</span></h4>
                    </div>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div class="project-details">
                    <div class="detail-section">
                        <h5>Description</h5>
                        <p>${project.desc}</p>
                    </div>
                    <div class="detail-section">
                        <h5>Technologies</h5>
                        <div class="tech-tags">
                            ${project.tech.map(t => `<span>${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="detail-section">
                        <h5>Key Thoughts</h5>
                        <p style="font-style: italic; color: #94a3b8;">"${project.thoughts}"</p>
                    </div>
                    <!-- The New Link Button -->
                    ${linkHtml}
                </div>
            </div>
        `;
        modalList.innerHTML += html;
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Keep the toggle function as is
function toggleDetails(element) {
    // Optional: Check if we are clicking the Link Button. If so, don't toggle the accordion.
    // However, since the link is inside the details (which are hidden until opened), 
    // we don't need complex logic here. The click to open happens on the 'summary'.
    
    // Logic to close others
    const allItems = document.querySelectorAll('.project-item');
    allItems.forEach(item => {
        if (item !== element) item.classList.remove('active');
    });
    element.classList.toggle('active');
}


// --- CONTACT FORM HANDLING (FORMSPREE) ---

const contactForm = document.getElementById("contact-form");

async function handleSubmit(event) {
    event.preventDefault(); // Stop page from reloading

    const status = document.getElementById("my-form-status");
    const btn = document.getElementById("submit-btn");
    
    // 1. Get the data from the form
    const data = new FormData(event.target);

    // Change button text to indicate loading
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    // 2. Send to Formspree 
    fetch("https://formspree.io/f/xwpgqarz", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Success!
            status.innerHTML = "Thanks! Message received.";
            status.classList.remove("status-error");
            status.classList.add("status-success");
            contactForm.reset(); // Clear the form fields
        } else {
            // Error from Formspree
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form";
                }
                status.classList.remove("status-success");
                status.classList.add("status-error");
            });
        }
    }).catch(error => {
        // Network Error
        status.innerHTML = "Oops! Network error. Please try again.";
        status.classList.remove("status-success");
        status.classList.add("status-error");
    }).finally(() => {
        // Reset button
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
        
        // Hide status message after 5 seconds
        setTimeout(() => {
            status.classList.remove("status-success", "status-error");
            status.style.display = 'none';
        }, 5000);
    });
}

contactForm.addEventListener("submit", handleSubmit);

// --- MOBILE MENU INTERACTION ---

// Select elements
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const menuIcon = document.querySelector('.menu-icon');

// 1. Close menu when clicking a link (Improvement)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.checked = false;
    });
});

// 2. Close menu when clicking OUTSIDE
document.addEventListener('click', (e) => {
    // If the menu is open...
    if (menuToggle.checked) {
        // AND the click is NOT on the menu itself
        // AND the click is NOT on the hamburger icon
        if (!navLinks.contains(e.target) && !menuIcon.contains(e.target) && e.target !== menuToggle) {
            menuToggle.checked = false; // Close it
        }
    }
});