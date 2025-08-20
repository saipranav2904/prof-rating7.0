// Replace this with your Google Apps Script Web App URL
const scriptURL = "https://script.google.com/macros/s/AKfycbx2wJ7jDboiFSyCQOvb57oC1eYYXSHipsxAKzVy7kkU99YlhsIIIVK3dUOP4tohCyFY/exec";

document.getElementById("ratingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  let data = {
    professor: document.getElementById("professor").value,
    course: document.getElementById("course").value,
    teaching: parseInt(document.getElementById("teaching").value),
    grading: parseInt(document.getElementById("grading").value),
    review: document.getElementById("review").value
  };

  await fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  loadRatings();
});

// Fetch & Display Ratings
async function loadRatings() {
  let res = await fetch(scriptURL);
  let ratings = await res.json();
  let output = "<h2>⭐ Ratings & Reviews ⭐</h2>";

  for (let prof in ratings) {
    for (let course in ratings[prof]) {
      let tArr = ratings[prof][course].teaching;
      let gArr = ratings[prof][course].grading;
      let reviews = ratings[prof][course].reviews || [];

      let tAvg = (tArr.reduce((a,b)=>a+b,0) / tArr.length).toFixed(1);
      let gAvg = (gArr.reduce((a,b)=>a+b,0) / gArr.length).toFixed(1);

      output += `
        <div class="result-card">
          <h3>${prof} - ${course}</h3>
          <p>Teaching: ⭐ ${tAvg}/10</p>
          <div class="bar-container"><div class="bar" style="width:${tAvg*10}%"></div></div>
          <p>Grading: ⭐ ${gAvg}/10</p>
          <div class="bar-container"><div class="bar" style="width:${gAvg*10}%"></div></div>
          <h4>Reviews:</h4>
          ${reviews.length > 0 ? reviews.map(r => `<p class="review-text">💬 "${r}"</p>`).join("") : "<p class='review-text'>No reviews yet.</p>"}
        </div>
      `;
    }
  }

  document.getElementById("results").innerHTML = output;
}

loadRatings();

