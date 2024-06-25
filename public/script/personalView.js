window.onload = function () {
  const listNavElement = document.querySelector("nav");
};

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, please log in first.");
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("/getEntries", {
      method: "GET",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch entries");
    }
    const data = await response.json();
    const entries = data.entries;

    displayEntries(entries);
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Failed to fetch entries, redirecting to landing page. Please log in again."
    );
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  document
    .getElementById("logoutButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      // alert("Logged out successfully");
      window.location.href = "/";
    });

  /*Fetch the fact data from the API using the fetchFact function
   and create an object to hold the fact details if fetch is true*/
  const fact = await fetchFact();
  if (fact) {
    const factObject = {
      title: "Interesting Fact",
      date: new Date().toLocaleDateString(), // Setting the current date
      content: fact.attributes.body,
    };
    displayFact(factObject);
  }
});
/*asynchronous function to fetch fact data from  API */
async function fetchFact() {
  try {
    const response = await fetch("/api/fact");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error fetching fact");
    }
    /*return first fact from array, it is also possible to take more facts (change limit in request on server.js) */
    return data.data[0]; // Assuming the fact is in data.data[0]
  } catch (error) {
    console.error("Error fetching fact:", error);
    return null;
  }
}

/* for <div id="dailyFactsContainer"></div> in personalView.html */
function displayFact(fact) {
  const dailyFactsContainer = document.getElementById("dailyFactsContainer");

  const factElement = document.createElement("div");
  factElement.classList.add("fact");
  factElement.innerHTML = `<h3>${fact.title} - ${fact.date}</h3><p>${fact.content}</p>`;
  dailyFactsContainer.appendChild(factElement);

  const positiveVote = document.createElement("button");
  positiveVote.classList.add("positiveVoteButton");
  positiveVote.textContent = "Helpful";
  factElement.appendChild(positiveVote);
  positiveVote.addEventListener("click", function () {
    alert("Thanks for voting!");
  });

  const negativeVote = document.createElement("button");
  negativeVote.classList.add("negativeVoteButton");
  negativeVote.textContent = "Dislike";
  factElement.appendChild(negativeVote);
  negativeVote.addEventListener("click", function () {
    alert("Thanks for voting!");
  });
}
/* ----------------------------------------------------------------- */

function displayEntries(entries) {
  const postContainer = document.getElementById("postContainer");

  entries.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `<h3>${post.title} - ${post.date} in ${post.city}, ${post.weather}°C</h3><p>${post.content}</p>`;
    postContainer.appendChild(postElement);

    const positiveVote = document.createElement("button");
    positiveVote.classList.add("positiveVoteButton");
    positiveVote.textContent = "Helpful";
    postElement.appendChild(positiveVote);
    positiveVote.addEventListener("click", function () {
      alert("Thanks for voting!");
    });

    const negativeVote = document.createElement("button");
    negativeVote.classList.add("negativeVoteButton");
    negativeVote.textContent = "Dislike";
    postElement.appendChild(negativeVote);
    negativeVote.addEventListener("click", function () {
      alert("Thanks for voting!");
    });

    const editEntry = document.createElement("button");
    editEntry.classList.add("editEntry");
    editEntry.textContent = "Edit Entry";
    postElement.appendChild(editEntry);
    editEntry.addEventListener("click", function () {
      window.location.href = "./edit.html?entryId=" + post.id;
    });

    const deleteEntry = document.createElement("button");
    deleteEntry.classList.add("deleteEntry");
    deleteEntry.textContent = "Delete Entry";
    postElement.appendChild(deleteEntry);
    deleteEntry.addEventListener("click", async function (event) {
      event.preventDefault();
      const entryId = post.id;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("/deleteEntry", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({ entryId }),
        });

        if (response.ok) {
          // alert("Entry deleted successfully");
          location.reload();
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete entry");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });

  const addButton = document.createElement("button");
  addButton.textContent = "Create New";
  addButton.id = "addEntryButton"; // ID for styling and event handling
  postContainer.appendChild(addButton);
  addButton.addEventListener("click", function () {
    window.location.href = "/diary.html";
  });
}
