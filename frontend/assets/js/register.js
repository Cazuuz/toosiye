document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");

  // Helper to map role for backend
  function mapRole(role) {
    switch (role) {
      case "Client":
        return "client";
      case "Professional":
        return "professional";
      case "Hybrid":
        return "both";
      default:
        return "";
    }
  }

  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    registerMessage.textContent = "";

    // Collect form data
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const roleRaw = document.getElementById("role").value;
    const role = mapRole(roleRaw);

    // Basic frontend validation
    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match!";
      registerMessage.className = "text-center mt-4 text-sm text-red-500";
      return;
    }
    if (!role) {
      registerMessage.textContent = "Please select a role.";
      registerMessage.className = "text-center mt-4 text-sm text-red-500";
      return;
    }

    // Build form data (for now, without image upload)
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    const profileImage = document.getElementById("profileImage").files[0];
    if (profileImage) formData.append("profile_image", profileImage);

    registerMessage.textContent = "Registering...";
    registerMessage.className = "text-center mt-4 text-sm";

    try {
      const response = await fetch(`${BASE_URL}/accounts/register/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        registerMessage.textContent =
          "Registration successful! Redirecting to login...";
        registerMessage.className = "text-center mt-4 text-sm text-green-600";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        // Show backend errors, if any
        if (data && typeof data === "object") {
          let msg = "";
          for (const key in data) {
            msg += `${key}: ${data[key]}\n`;
          }
          registerMessage.textContent = msg.trim();
        } else {
          registerMessage.textContent =
            "Registration failed. Please try again.";
        }
        registerMessage.className = "text-center mt-4 text-sm text-red-500";
      }
    } catch (error) {
      registerMessage.textContent = "Network error. Please try again later.";
      registerMessage.className = "text-center mt-4 text-sm text-red-500";
    }
  });
});
