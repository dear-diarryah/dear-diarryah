document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found, please log in first.");
      window.location.href = "/";
      return;
    }

    document.getElementById("profileForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      const nickname = document.getElementById("nickname").value;
      const biography = document.getElementById("biography").value;
      const age = document.getElementById("age").value;

      try {
        const response = await fetch("/updateProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({ nickname, biography, age }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Profile updated successfully");
          window.location.href = "/profile.html";
        } else {
          alert("Failed to update profile");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

    document.getElementById("logoutButton").addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "/";
    });

    function onEditClicked() {
      document.getElementById('nickname').disabled = false;
      document.getElementById('biography').disabled = false;
      document.getElementById('age').disabled = false;
    }

    function onSaveClicked() {
      document.getElementById("profileForm").submit();
    }

    function onCancelClicked() {
      window.location.href = './profile.html';
    }

    // Initially disable form fields
    document.getElementById('nickname').disabled = true;
    document.getElementById('biography').disabled = true;
    document.getElementById('age').disabled = true;
  });