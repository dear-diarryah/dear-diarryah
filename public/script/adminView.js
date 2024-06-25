document.addEventListener("DOMContentLoaded", async function () {
  fetchUsers();

  document
    .getElementById("logoutButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      // alert("Logged out successfully");
      window.location.href = "/";
    });
});

async function fetchUsers() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, please log in first.");
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/admin/getUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });
    const data = await response.json();
    const users = data.users;
    if (!response.ok) {
      throw new Error("Failed to fetch entries");
    }
    displayUsers(users);
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Failed to fetch entries, redirecting to landing page. Please log in again."
    );
    localStorage.removeItem("token");
    window.location.href = "/";
  }
}

function displayUsers(users) {
  const container = document.getElementById("userListContainer");
  if (container.hasChildNodes()) {
    container.innerHTML = "";
  }

  users.forEach((user) => {
    if (user.id != 1) {
      const userDiv = document.createElement("div");
      userDiv.className = "user";
      const userLabel = document.createElement("span");
      userLabel.textContent =
        "Affected User: " + user.username + " UID: " + user.id;

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "buttonContainer";

      const btnChangeUsername = createButton(
        "Change Username",
        "button changeButton",
        () => showUsernameChangeForm(user)
      );
      const btnResetPassword = createButton(
        "Change Password",
        "button changeButton",
        () => showPasswordChangeForm(user)
      );
      const btnDeleteUser = createButton(
        "Delete User",
        "button deleteButton",
        () => deleteUser(user)
      );

      buttonContainer.append(
        btnChangeUsername,
        btnResetPassword,
        btnDeleteUser
      );
      userDiv.append(userLabel, buttonContainer);
      container.appendChild(userDiv);
    }
  });
}

function createButton(text, className, onClickFunction) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.onclick = onClickFunction;
  return button;
}

function showUsernameChangeForm(user) {
  hidePasswordChangeForm();
  const form = document.getElementById("usernameChangeForm");

  if (form) {
    document.getElementById("newUsername").placeholder =
      "New username for " + user.username;
    document.getElementById("newUsername").value = "";
    form.style.display = "block";

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      await changeUsername(user.id);
    });
  }
}

function hideUsernameChangeForm() {
  const form = document.getElementById("usernameChangeForm");
  if (form) form.style.display = "none";
}

async function changeUsername(userId) {
  const newUsername = document.getElementById("newUsername").value;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/admin/updateUsername/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ newUsername: newUsername }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Username changed successfully!");
      fetchUsers();
    } else {
      alert(data.error);
    }
    hideUsernameChangeForm();
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while updating username.");
  }
}

function showPasswordChangeForm(user) {
  hideUsernameChangeForm();
  const form = document.getElementById("passwordChangeForm");

  if (form) {
    document.getElementById("newPassword").placeholder =
      "New password for " + user.username;
    document.getElementById("newPassword").value = "";
    form.style.display = "block";

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      await changePassword(user.id);
    });
  }
}

function hidePasswordChangeForm() {
  const form = document.getElementById("passwordChangeForm");
  if (form) form.style.display = "none";
}

async function changePassword(userId) {
  const newPassword = document.getElementById("newPassword").value;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/admin/updatePassword/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ newPassword: newPassword }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Password changed successfully!");
      fetchUsers();
    } else {
      alert(data.error);
    }
    hidePasswordChangeForm();
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while updating password.");
  }
}

async function deleteUser(user) {
  hideUsernameChangeForm();
  hidePasswordChangeForm();

  const confirmation = confirm(
    `Are you sure you want to delete user ${user.username}?`
  );
  if (!confirmation) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/admin/deleteUser/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      fetchUsers();
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while deleting the user.");
  }
}
