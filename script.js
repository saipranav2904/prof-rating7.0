// Replace this with your Google Apps Script Web App URL
const scriptURL = "https://script.google.com/macros/s/AKfycbx2wJ7jDboiFSyCQOvb57oC1eYYXSHipsxAKzVy7kkU99YlhsIIIVK3dUOP4tohCyFY/exec";

// Handle form submission
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

  loadRatings(); // Refresh averages
  e.target.reset(); // Clear form
});

// Load ratings and display averages + reviews
async function loadRatings() {
  let res = await fetch(scriptURL);
  let ratings = await res.json();
  let output = "<h3>Ratings & Reviews</h3>";

  for (let prof in ratings) {
    output += `<h2>${prof}</h2>`;
    for (let course in ratings[prof]) {
      let teachingArr = ratings[prof][course].teaching;
      let gradingArr = ratings[prof][course].grading;

      let tAvg = (teachingArr.reduce((a,b)=>a+b,0) / teachingArr.length).toFixed(1);
      let gAvg = (gradingArr.reduce((a,b)=>a+b,0) / gradingArr.length).toFixed(1);

      output += `<h4>${course}</h4>`;

      // Teaching Rating Bar
      output += `<p>Teaching Rating: ${tAvg}/10</p>
                 <div class="bar-container"><div class="bar" style="width:${tAvg*10}%">${tAvg}</div></div>`;

      // Grading Rating Bar
      output += `<p>Grading Rating: ${gAvg}/10</p>
                 <div class="bar-container"><div class="bar" style="width:${gAvg*10}%">${gAvg}</div></div>`;

      // Reviews
      if (ratings[prof][course].reviews && ratings[prof][course].reviews.length > 0) {
        output += "<h5>Student Reviews:</h5>";
        ratings[prof][course].reviews.forEach(r => {
          output += `<div class="review-box">${r}</div>`;
        });
      }
    }
  }

  document.getElementById("results").innerHTML = output;
}

// Initial load
loadRatings();
