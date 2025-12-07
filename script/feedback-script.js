// Import DB from our config file
         import { db } from './script/firebase-config.js';
        // Import getDocs to fetch projects
        import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

        // 1. Populate Dropdown Automatically
        async function loadProjectDropdown() {
            const select = document.getElementById("projectId");
            const q = query(collection(db, "projects"), orderBy("title"));
            const snapshot = await getDocs(q);

            snapshot.forEach(doc => {
                const data = doc.data();
                const option = document.createElement("option");
                option.value = data.id; // The slug
                option.text = data.title;
                select.appendChild(option);
            });
        }
        loadProjectDropdown(); // Run on load

        const feedbackForm = document.getElementById("feedback-form");
        
        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById("fb-btn");
            const status = document.getElementById("feedback-status");
            
            // Collect Data
            const reviewData = {
                author: document.getElementById("clientName").value,
                position: document.getElementById("clientRole").value,
                projectId: document.getElementById("projectId").value,
                text: document.getElementById("reviewText").value,
                approved: false, // DEFAULT IS FALSE (You must approve it in Console)
                createdAt: serverTimestamp()
            };

            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            try {
                // Add to 'reviews' collection in Firestore
                await addDoc(collection(db, "reviews"), reviewData);
                
                status.innerHTML = "Review sent! It will appear on the site after approval.";
                status.style.color = "#4ade80";
                status.style.display = "block";
                feedbackForm.reset();
            } catch (error) {
                console.error("Error:", error);
                status.innerHTML = "Error connecting to server.";
                status.style.color = "#f87171";
                status.style.display = "block";
            } finally {
                btn.innerHTML = 'Submit Review <i class="fas fa-paper-plane"></i>';
                btn.disabled = false;
            }
        });