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
    alert("Failed to fetch entries");
  }

  document.getElementById("logoutButton").addEventListener("click", function (event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Links
    localStorage.removeItem("token"); // Entfernt den Token aus dem LocalStorage
    // alert("Logged out successfully");
    window.location.href = "/"; // Weiterleitung zur Login-Seite
  });
});

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

    const deleteEntry = document.createElement("button");
    deleteEntry.classList.add("deleteEntry");
    deleteEntry.textContent = "Delete Entry";
    postElement.appendChild(deleteEntry);
    deleteEntry.addEventListener("click", async function(event) {
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
    })
  });

  const addButton = document.createElement("button");
  addButton.textContent = "Create New";
  addButton.id = "addEntryButton"; // ID for styling and event handling
  postContainer.appendChild(addButton);
  addButton.addEventListener("click", function () {
    window.location.href = "/diary.html";
  });
}

//TODO - create function that automatically adds most recent 3 posts - facebook style
/*
reference to Exercise 3

function appendMovie(movie, element) {
  new ElementBuilder("article").id(movie.imdbID)
          .append(new ElementBuilder("img").with("src", movie.Poster))
          .append(new ElementBuilder("h1").text(movie.Title))
          .append(new ElementBuilder("p")
              .append(new ElementBuilder("button").text("Edit")
                    .listener("click", () => location.href = "edit.html?imdbID=" + movie.imdbID)))
          .append(new ParagraphBuilder().items(
              "Runtime " + formatRuntime(movie.Runtime),
              "\u2022",
              "Released on " +
                new Date(movie.Released).toLocaleDateString("en-US")))
          .append(new ParagraphBuilder().childClass("genre").items(movie.Genres))
          .append(new ElementBuilder("p").text(movie.Plot))
          .append(new ElementBuilder("h2").pluralizedText("Director", movie.Directors))
          .append(new ListBuilder().items(movie.Directors))
          .append(new ElementBuilder("h2").pluralizedText("Writer", movie.Writers))
          .append(new ListBuilder().items(movie.Writers))
          .append(new ElementBuilder("h2").pluralizedText("Actor", movie.Actors))
          .append(new ListBuilder().items(movie.Actors))
          .appendTo(element);
}
*/
//post element
