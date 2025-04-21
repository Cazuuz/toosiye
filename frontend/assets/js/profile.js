document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");

  // Grab the ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const professionalId = urlParams.get("id");

  if (!professionalId) {
    alert("No professional ID found in URL!");
    return;
  }

  // Fetch professional data
  async function fetchProfessionalDetails() {
    try {
      const response = await fetch(
        `${BASE_URL}/accounts/professionals/${professionalId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch professional");

      const data = await response.json();
      populateProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  // Inject data into the HTML
  function populateProfile(pro) {
    document.getElementById("profileImage").src =
      pro.profile_image ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&ss";
    document.getElementById("fullName").textContent = pro.full_name;
    document.getElementById("profession").textContent = pro.profession;
    document.getElementById("email").textContent = pro.email || "N/A";
    document.getElementById("phoneNumber").textContent =
      pro.phone_number || "N/A";
    document.getElementById("city").textContent = pro.city || "N/A";
    document.getElementById("zone").textContent = pro.zone || "N/A";
    document.getElementById("experience").textContent = pro.experience || "N/A";
    document.getElementById("services").textContent = pro.services || "N/A";
    document.getElementById("about").textContent = pro.about || "N/A";
  }

  fetchProfessionalDetails();
  fetchReviews(professionalId);
  setupReviewForm(professionalId, accessToken);
});

function fetchReviews(professionalId) {
  fetch(`${BASE_URL}/accounts/reviews/${professionalId}/`)
    .then((res) => res.json())
    .then((reviews) => {
      const container = document.getElementById("reviewsContainer");
      container.innerHTML = "";

      console.log(reviews);

      if (reviews.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center">No reviews yet.</p>`;
        return;
      }

      reviews.forEach((review) => {
        const stars =
          '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';

        const reviewHTML = `
          <div class="max-w-xl rounded-2xl px-10 py-4 hover:shadow-2xl transition duration-500">
            <div class="flex mt-2">${stars.repeat(review.rating)}</div>
            <p class="mt-4 text-md text-gray-600">
              ${review.comment}
            </p>
            <div class="flex justify-between items-center">
              <div class="mt-4 flex items-center space-x-4 py-6">
                <div>
                  <img class="w-12 h-12 rounded-full" src="${
                    review.reviewer_image || "https://shorturl.at/BpzlD"
                  }" alt="Reviewer"/>
                </div>
                <div class="text-sm font-semibold">
                  ${
                    review.reviewer
                  } • <span class="font-normal">${formatTimeAgo(
          review.created_at
        )}</span>
                </div>
              </div>
             
            </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", reviewHTML);
      });
    })
    .catch((err) => {
      console.error("Failed to load reviews:", err);
    });
}

// Submit review
function setupReviewForm(professionalId, accessToken) {
  const form = document.getElementById("reviewForm");
  const ratingInput = document.getElementById("rating");
  const commentInput = document.getElementById("comment");
  const messageBox = document.getElementById("reviewMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rating = ratingInput.value;
    const comment = commentInput.value.trim();

    if (!rating) {
      messageBox.textContent = "Please select a rating.";
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/accounts/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          professional: professionalId,
          rating,
          comment,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        messageBox.textContent =
          data.detail || "You’ve already submitted a review.";
        return;
      }

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      messageBox.textContent = "Review submitted successfully!";
      form.reset();

      // Refresh reviews
      fetchReviews(professionalId);
    } catch (err) {
      console.error("Failed to submit review:", err);
      messageBox.textContent = "Failed to submit review.";
    }
  });
}
