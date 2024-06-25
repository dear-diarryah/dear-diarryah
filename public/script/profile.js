document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, please log in first.");
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/getProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });
    if (response.ok) {
      const data = await response.json();
      const profile = data.profile;

      if (profile) {
        document.getElementById("nickname").value = profile.nickname || "";
        document.getElementById("biography").value = profile.biography || "";
        document.getElementById("age").value = profile.age || 0;
        document.getElementById("ageOutput").value = profile.age || 0;
        if (profile.rabies_date) {
          document.getElementById("rabies").value = "Yes";
          document.getElementById("rabies_date").value = profile.rabies_date;
          document.getElementById("rabies_date").disabled = false;
        }
        if (profile.tetanus_date) {
          document.getElementById("tetanus").value = "Yes";
          document.getElementById("tetanus_date").value = profile.tetanus_date;
          document.getElementById("tetanus_date").disabled = false;
        }
        if (profile.borreliose_date) {
          document.getElementById("borreliose").value = "Yes";
          document.getElementById("borreliose_date").value =
            profile.borreliose_date;
          document.getElementById("borreliose_date").disabled = false;
        }
        if (profile.gender) {
          document.querySelector(
            `input[name="gender"][value="${profile.gender}"]`
          ).checked = true;
        }
      }
    } else {
      console.error("Failed to fetch profile");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  // Enable or disable date inputs based on vaccine selection
  const vaccines = ["rabies", "tetanus", "borreliose"];
  vaccines.forEach((vaccine) => {
    const selectElement = document.getElementById(vaccine);
    const dateInput = document.getElementById(vaccine + "_date");

    selectElement.addEventListener("change", function () {
      if (this.value === "Yes") {
        dateInput.disabled = false;
      } else {
        dateInput.disabled = true;
        dateInput.value = ""; // Clear the date input if "No" is selected
      }
    });
  });

  document
    .getElementById("logoutButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "/";
    });
});
