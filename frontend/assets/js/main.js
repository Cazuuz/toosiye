async function loadNavbar() {
  const navbar = await fetch("navbar.html").then((res) => res.text());
  document.getElementById("navbar-container").innerHTML = navbar;

  // Now personalize it
  const authArea = document.getElementById("navbar-auth-area");
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  if (accessToken) {
    fetch(`${BASE_URL}/accounts/profile/${username}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        authArea.innerHTML = `
        <div class="flex items-center space-x-2">
        <a href="myAccount.html"><span class="font-semibold hidden lg:inline">${username}</span></a>
        
        <a href="myAccount.html"><img src="http://127.0.0.1:8000/${user.profile_image}" alt="profile" class="w-8 h-8 rounded-full" /></a>
        </div>
      `;
      });
  } else {
    authArea.innerHTML = `
    <a href="login.html"
      class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log in</a>
    <a href="register.html"
      class="text-white bg-green-400 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Get
      started</a>
  `;
  }
}

loadNavbar();

window.addEventListener("DOMContentLoaded", loadNavbar);
