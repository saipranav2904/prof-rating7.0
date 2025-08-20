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

// Load averages + reviews
async function loadRatings() {
  let res = await fetch(scriptURL);
  let ratings = await res.json();

  let output = "<h2>🌟 Average Ratings</h2>";
  let reviewOutput = "<h2>📝 Student Reviews</h2>";

  for (let prof in ratings) {
    output += `<h3>${prof}</h3>`;
    for (let course in ratings[prof]) {
      let tAvg = avg(ratings[prof][course].teaching).toFixed(1);
      let gAvg = avg(ratings[prof][course].grading).toFixed(1);

      output += `
        <p><b>${course}</b></p>
        <div class="result-bar"><div class="result-fill" style="width:${tAvg*10}%">Teaching ⭐ ${tAvg}/10</div></div>
        <div class="result-bar"><div class="result-fill" style="width:${gAvg*10}%">Grading ⭐ ${gAvg}/10</div></div>
      `;

      ratings[prof][course].reviews.forEach(r => {
        reviewOutput += `
          <div class="review-card">
            <p><b>${prof} - ${course}</b></p>
            <p>Teaching: ${"⭐".repeat(r.teaching)}</p>
            <p>Grading: ${"⭐".repeat(r.grading)}</p>
            <p>"${r.review}"</p>
          </div>
        `;
      });
    }
  }

  document.getElementById("results").innerHTML = output;
  document.getElementById("reviews").innerHTML = reviewOutput;
}

function avg(arr) {
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

loadRatings();

