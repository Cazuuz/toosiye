document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  if (!accessToken || !username) {
    window.location.href = "login.html";
    return;
  }

  const profileForm = document.getElementById("profileForm");
  const profileImageInput = document.getElementById("profile_image");
  const profileImagePreview = document.getElementById("profileImagePreview");

  // Fetch profile details and populate the form
  fetch(`${BASE_URL}/accounts/profile/${username}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.profile_image);
      console.log(data);
      if (data) {
        // Fill form fields
        document.getElementById("full_name").value = data.full_name || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("phone_number").value = data.phone_number || "";
        document.getElementById("whatsapp_link").value =
          data.whatsapp_link || "";
        document.getElementById("profession").value = data.profession || "";
        document.getElementById("city").value = data.city || "";
        document.getElementById("zone").value = data.zone || "";
        document.getElementById("experience_years").value =
          data.experience_years || "";
        document.getElementById("services").value = data.services || "";
        document.getElementById("about").value = data.about || "";

        if (data.profile_image) {
          profileImagePreview.src = `http://127.0.0.1:8000/${data.profile_image}`;
          console.log(profileImagePreview.src);
        }
      }
    })
    .catch((err) => {
      console.error("Failed to load profile:", err);
      alert("Failed to load profile.");
    });

  // Update preview when image selected
  profileImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      profileImagePreview.src = URL.createObjectURL(file);
    }
  });

  // Submit updated profile
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", document.getElementById("full_name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append(
      "phone_number",
      document.getElementById("phone_number").value
    );
    formData.append(
      "whatsapp_link",
      document.getElementById("whatsapp_link").value
    );
    formData.append("profession", document.getElementById("profession").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("zone", document.getElementById("zone").value);
    formData.append(
      "experience_years",
      document.getElementById("experience_years").value
    );
    formData.append("services", document.getElementById("services").value);
    formData.append("about", document.getElementById("about").value);

    const profileImageFile = profileImageInput.files[0];
    if (profileImageFile) {
      formData.append("profile_image", profileImageFile);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/accounts/profile/create-or-update/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong while saving.");
    }
  });
});

// Logout functionality
const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default anchor behavior

  // Clear all localStorage data
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
  localStorage.removeItem("refreshToken"); // if you stored user info as an object

  // Redirect to login page
  window.location.href = "login.html";
});
