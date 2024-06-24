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

      const entryId = new URLSearchParams(window.location.search).get("entryId");
      try {
        const response = await fetch(`/editEntry/${entryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token, // Token im Header senden
          },
          body: JSON.stringify({ title, date, city, content }),
        });
        
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

  // Call the function to fetch entry data
  fetchEntryData();
});

function setEntry(entry) {
  document.getElementById("titleInput").value = entry?.title;
  console.log(entry.date);
  console.log(new Date (entry.date));
  document.getElementById("dateInput").value = entry.date;
  document.getElementById("cityInput").value = entry?.city;
  document.getElementById("contentTextarea").value = entry?.content;

}

function formatDate(dateString) {
    const [year, month, day] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

async function fetchEntryData() {
  const token = localStorage.getItem("token");
  const entryId = new URLSearchParams(window.location.search).get("entryId");
  console.log(entryId);
  try {
    const response = await fetch(`/getEntry/${entryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token, // Token im Header senden
      },
    });
    console.log("Response status", response.status);
    const data = await response.json();
    console.log("Response data", data);
    if (response.ok) {
      setEntry(data.entries);
    } else {
      alert(
        "Loading of Entry data failed. Status was " +
          response.status +
          " - " +
          response.statusText
      );
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while loading the entry data.");
  }
}
