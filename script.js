// Submit form
document.getElementById("ratingForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const prof = document.getElementById("professor").value;
  const course = document.getElementById("course").value;
  const teaching = document.getElementById("teaching").value;
  const grading = document.getElementById("grading").value;
  const review = document.getElementById("review").value;

  fetch("https://script.google.com/macros/s/AKfycbx2wJ7jDboiFSyCQOvb57oC1eYYXSHipsxAKzVy7kkU99YlhsIIIVK3dUOP4tohCyFY/exec", {
    method: "POST",
    body: JSON.stringify({ prof, course, teaching, grading, review }),
  })
  .then(res => res.json())
  .then(data => {
    alert("Review submitted successfully!");
    document.getElementById("ratingForm").reset();
    loadRatings();
  })
  .catch(err => console.error(err));
});

// Load ratings + reviews
function loadRatings() {
  fetch("https://script.google.com/macros/s/AKfycbx2wJ7jDboiFSyCQOvb57oC1eYYXSHipsxAKzVy7kkU99YlhsIIIVK3dUOP4tohCyFY/exec?action=getRatings")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("ratingsContainer");
      container.innerHTML = "";

      data.forEach(item => {
        const card = document.createElement("div");
        card.className = "review-card";

        const avg = ((parseFloat(item.teaching) + parseFloat(item.grading)) / 2).toFixed(2);

        card.innerHTML = `
          <h3>${item.prof} - ${item.course}</h3>
          <div class="rating-bar">
            <div class="rating-fill" style="width: ${avg * 10}%"></div>
          </div>
          <p><strong>Average Rating:</strong> ${avg} ⭐</p>
          <h4>Reviews:</h4>
          <div class="reviews-list">
            ${item.reviews.map(r => `
              <div class="single-review">
                <p>"${r.text}"</p>
                <span>Teaching: ${r.teaching} ⭐ | Grading: ${r.grading} ⭐</span>
              </div>
            `).join("")}
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error(err));
}

// Initial load
window.onload = loadRatings;
