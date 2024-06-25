document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, please log in first.");
    window.location.href = "/";
    return;
  }

  document
    .getElementById("diaryForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const title = document.getElementById("titleInput").value;
      const date = document.getElementById("dateInput").value;
      const city = document.getElementById("cityInput").value;
      const content = document.getElementById("contentTextarea").value;

      try {
        const response = await fetch("/postEntry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token, // Token im Header senden
          },
          body: JSON.stringify({ title, date, city, content }),
        });
        const data = await response.json();
        if (response.ok) {
          // alert("Entry posted successfully");
          window.location.href = "/personalView.html";
        } else {
          alert("Failed to post entry");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

  document
    .getElementById("logoutButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      // alert("Logged out successfully");
      window.location.href = "/";
    });
});
