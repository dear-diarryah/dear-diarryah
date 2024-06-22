document.addEventListener("DOMContentLoaded", function() {
  // Check for authentication token
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, please log in first.");
    window.location.href = "/";
    return;
  }

  // Enable or disable date inputs based on vaccine selection
  const vaccines = ["rabies", "tetanus", "influenza"];
  vaccines.forEach(vaccine => {
      const selectElement = document.getElementById(vaccine);
      const dateInput = document.getElementById(vaccine + "_date");

      selectElement.addEventListener('change', function() {
          if (this.value === "Yes") {
              dateInput.disabled = false;
          } else {
              dateInput.disabled = true;
              dateInput.value = ''; // Clear the date input if "No" is selected
          }
      });
  });

  // Handle form submission
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

  // Logout button functionality
  document.getElementById("logoutButton").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/";
  });


});