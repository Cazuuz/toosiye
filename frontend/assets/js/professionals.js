document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  const professionalsContainer = document.getElementById(
    "professionalsContainer"
  );
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  async function fetchProfessionals(query = "") {
    let url = `${BASE_URL}/accounts/search/`;
    if (query) {
      url += `?q=${encodeURIComponent(query)}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      renderProfessionals(data);
    } catch (err) {
      console.error("Error fetching professionals:", err);
    }
  }

  function renderProfessionals(professionals) {
    professionalsContainer.innerHTML = ""; // Clear previous content

    if (!professionals.length) {
      professionalsContainer.innerHTML = `<p class="text-center col-span-full text-gray-500">No professionals found.</p>`;
      return;
    }

    professionals.forEach((pro) => {
      const card = document.createElement("div");
      card.className =
        "bg-white w-full rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700";

      const imgSrc = pro.profile_image
        ? `${pro.profile_image}`
        : "https://shorturl.at/BpzlD";

      const location = pro.city || "Unknown";
      const rating =
        pro.average_rating !== null ? pro.average_rating.toFixed(1) : "N/A";

      card.innerHTML = `
        <div class="flex flex-col items-center p-3">
          <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="${imgSrc}" alt="${pro.full_name}" />
          <h3 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">${pro.full_name}</h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">${pro.profession}</span>
          <div class="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300 text-center space-y-1">
            <p class="flex items-center justify-center gap-1">
              <svg class="w-4 h-4 " fill="#4ade80" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
              ${location}
            </p>
            <p class="flex items-center justify-center gap-1">
              <svg class="w-4 h-4 text-yellow-400" fill="#4ade80" viewBox="0 0 576 512"><path d="M316.6 17.7L370.7 150l140.5 20.5c26.2 3.8 36.7 36 17.7 54.6L439 347.7l24 139.9c4.5 26.2-23 46-46.4 33.7L288 439.6 158.4 521.3c-23.4 12.3-50.9-7.5-46.4-33.7l24-139.9L47.1 225.1c-19-18.6-8.5-50.8 17.7-54.6L205.3 150 259.4 17.7C270.4-5.9 305.6-5.9 316.6 17.7z"/></svg>
              ${rating}
            </p>
          </div>
          <div class="flex w-full mt-4 space-x-3 lg:mt-6">
            <a href="profile.html?id=${pro.id}" class="w-full flex items-center py-2 px-4 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-800">See Profile</a>
            <a href="tel:${pro.phone_number}" class="flex items-center py-2 px-4 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-800"><svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" 
            viewBox="0 0 512 512">
            <path fill="#ffff" 
            d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></a>
          </div>
        </div>
      `;
      professionalsContainer.appendChild(card);
    });
  }

  // Initial fetch
  fetchProfessionals();

  // Handle search
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    fetchProfessionals(query);
  });
});
