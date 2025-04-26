document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return (window.location.href = "login.html");

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // ----- ICONS for stats -----
  const statIcons = {
    users: `<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6.13a4 4 0 01-8 0 4 4 0 018 0z"></path></svg>`,
    active: `<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2l4-4"/></svg>`,
    banned: `<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg>`,
    admins: `<svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z"/></svg>`,
  };

  const statColors = {
    users: "bg-blue-50 border-blue-200",
    active: "bg-green-50 border-green-200",
    banned: "bg-red-50 border-red-200",
    admins: "bg-purple-50 border-purple-200",
    default: "bg-gray-50 border-gray-200",
  };

  // Load stats
  fetch(`${BASE_URL}/accounts/admin/stats/`, { headers })
    .then((res) => res.json())
    .then((data) => {
      const statsContainer = document.getElementById("statsContainer");
      statsContainer.innerHTML = "";
      for (const [key, value] of Object.entries(data)) {
        const color = statColors[key] || statColors.default;
        const icon =
          statIcons[key] ||
          `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>`;
        const label = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        statsContainer.innerHTML += `
          <div class="flex flex-col items-center justify-center p-5 border ${color} rounded-xl shadow transition hover:scale-105 hover:shadow-lg">
            <div class="mb-2">${icon}</div>
            <div class="text-2xl font-bold text-gray-800">${value}</div>
            <div class="text-sm text-gray-600">${label}</div>
          </div>
        `;
      }
    });

  // Status badge helper
  function getStatusBadge(status) {
    switch (status?.toLowerCase()) {
      case "active":
        return `<span class="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">Active</span>`;
      case "pending":
        return `<span class="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-xs">Pending</span>`;
      case "banned":
        return `<span class="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">Banned</span>`;
      default:
        return `<span class="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs">${status}</span>`;
    }
  }

  // Role badge helper
  function getRoleBadge(role) {
    switch (role.toLowerCase()) {
      case "admin":
        return `<span class="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">Admin</span>`;
      case "user":
        return `<span class="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">User</span>`;
      default:
        return `<span class="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs">${role}</span>`;
    }
  }

  // Avatar helper (initials)
  function getAvatar(name) {
    const initials = name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
    const bgColors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
    ];
    const color = bgColors[Math.floor(Math.random() * bgColors.length)];
    return `<div class="w-9 h-9 rounded-full flex items-center justify-center ${color} text-white font-bold mr-3 shadow">${initials}</div>`;
  }

  // Action button with icon
  function actionButton(action, userId, color, icon, label) {
    return `
      <button
        onclick="adminAction('${action}', ${userId})"
        class="inline-flex items-center px-3 py-1.5 rounded-md font-medium text-xs ${color} hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-offset-1 mr-2 mb-1"
        title="${label}">
        <span class="mr-1">${icon}</span>${label}
      </button>
    `;
  }

  // Load users
  fetch(`${BASE_URL}/accounts/admin/users/`, { headers })
    .then((res) => res.json())
    .then((users) => {
      const tbody = document.getElementById("usersTableBody");
      tbody.innerHTML = "";
      users.forEach((user) => {
        // Choose avatar color based on username for consistency
        const colorSeed = user.username
          .split("")
          .reduce((a, c) => a + c.charCodeAt(0), 0);
        const bgColors = [
          "bg-blue-500",
          "bg-green-500",
          "bg-purple-500",
          "bg-yellow-500",
          "bg-pink-500",
          "bg-indigo-500",
          "bg-red-500",
        ];
        const color = bgColors[colorSeed % bgColors.length];
        const initials = user.username
          .split(" ")
          .map((n) => n[0]?.toUpperCase())
          .join("")
          .slice(0, 2);

        const tr = document.createElement("tr");
        tr.className = "hover:bg-blue-50 transition";

        tr.innerHTML = `
          <td class="px-4 py-3 flex items-center min-w-[170px]">
            <div class="w-9 h-9 flex items-center justify-center rounded-full ${color} text-white font-bold mr-3 shadow text-base">${initials}</div>
            <span class="font-medium text-gray-800">${user.username}</span>
          </td>
          <td class="px-4 py-3">${getRoleBadge(user.role)}</td>
          <td class="px-4 py-3">${getStatusBadge(user.status)}</td>
          <td class="px-4 py-3">
            ${actionButton(
              "approve",
              user.id,
              "bg-green-100 text-green-700 hover:bg-green-200",
              '<i data-feather="check-circle"></i>',
              "Approve"
            )}
            ${actionButton(
              "disapprove",
              user.id,
              "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
              '<i data-feather="slash"></i>',
              "Disapprove"
            )}
            ${actionButton(
              "ban",
              user.id,
              "bg-red-100 text-red-700 hover:bg-red-200",
              '<i data-feather="user-x"></i>',
              "Ban"
            )}
          </td>
        `;
        tbody.appendChild(tr);
      });
      // Replace icons
      if (window.feather) feather.replace();
    });

  // Action handler
  window.adminAction = (action, userId) => {
    fetch(`${BASE_URL}/accounts/admin/${action}/${userId}/`, {
      method: "POST",
      headers,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.detail || "Action completed");
        window.location.reload();
      });
  };
});
