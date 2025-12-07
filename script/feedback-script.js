// 1. IMPORTS
// Assumes this file is in the ROOT folder. If in 'script' folder, remove the 'script/' prefix below.
import { db } from './firebase-config.js'; 
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. DOM ELEMENTS
const select = document.getElementById("projectId");
const feedbackForm = document.getElementById("feedback-form");
const btn = document.getElementById("fb-btn");
const status = document.getElementById("feedback-status");

// 3. POPULATE DROPDOWN (Filtered)
async function loadProjectDropdown() {
    console.log("Fetching projects..."); 
    
    try {
        select.innerHTML = '<option value="" disabled selected>Select the project...</option>';

        // Fetch all projects sorted by title
        const q = query(collection(db, "projects"), orderBy("title"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            const option = document.createElement("option");
            option.text = "No projects found";
            select.appendChild(option);
            return;
        }

        let eligibleProjectsCount = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // --- FILTER LOGIC ---
            // Convert to lowercase to make checking easier (e.g., "Paid" vs "paid")
            const type = data.type ? data.type.toLowerCase() : "";
            const role = data.roleType ? data.roleType.toLowerCase() : "";

            // Check: Is it Paid? OR Is it Collaborated?
            // We use .includes() so if you wrote "Paid Project" or just "Paid", it both works.
            const isPaid = type.includes("paid");
            const isCollab = role.includes("collaborated") || role.includes("team");

            // Only add to dropdown if it meets criteria
            if (isPaid || isCollab) {
                const option = document.createElement("option");
                option.value = data.id; 
                option.text = data.title;
                select.appendChild(option);
                eligibleProjectsCount++;
            }
        });

        // If projects exist in DB but none matched the filter
        if (eligibleProjectsCount === 0) {
            const option = document.createElement("option");
            option.text = "No reviewable projects available";
            select.appendChild(option);
        }

    } catch (error) {
        console.error("Error fetching projects:", error);
        const option = document.createElement("option");
        option.text = "Error loading projects";
        select.appendChild(option);
    }
}

// 4. HANDLE FORM SUBMISSION
if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Collect Data
        const reviewData = {
            author: document.getElementById("clientName").value,
            position: document.getElementById("clientRole").value,
            projectId: document.getElementById("projectId").value,
            text: document.getElementById("reviewText").value,
            approved: false, 
            createdAt: serverTimestamp()
        };

        // UI Feedback
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        try {
            await addDoc(collection(db, "reviews"), reviewData);
            
            status.innerHTML = "Review sent! It will appear on the site after approval.";
            status.style.color = "#4ade80";
            status.style.display = "block";
            feedbackForm.reset();
        } catch (error) {
            console.error("Error sending review:", error);
            status.innerHTML = "Error connecting to server.";
            status.style.color = "#f87171";
            status.style.display = "block";
        } finally {
            btn.innerHTML = 'Submit Review <i class="fas fa-paper-plane"></i>';
            btn.disabled = false;
        }
    });
}

// 5. RUN ON LOAD
// Ensure DOM is ready before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjectDropdown);
} else {
    loadProjectDropdown();
}