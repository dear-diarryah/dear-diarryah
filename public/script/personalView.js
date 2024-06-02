window.onload = function () {
  const listNavElement = document.querySelector("nav");
};

const postData = [
  { title: "Megi Voj.", content: "Ich liebe Sammy" },
  { title: "Ivan B.", content: "Ich liebe meine Frau." },
  { title: "Post C", content: "Test" },
];

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
});

function displayEntries(entries) {
  const postContainer = document.getElementById("postContainer");

  entries.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
        `;
    postContainer.appendChild(postElement);
    // Create Like button
    const positiveVote = document.createElement("button");
    positiveVote.classList.add("positiveVoteButton");
    positiveVote.textContent = "Helpful";
    // Create Dislike button
    const negativeVote = document.createElement("button");
    negativeVote.classList.add("negativeVoteButton");
    negativeVote.textContent = "Dislike";
    postElement.appendChild(positiveVote);
    postElement.appendChild(negativeVote);
    // Event listener for the new entry button
    positiveVote.addEventListener("click", function () {
      alert("Thanks for voting!");
      // Here you can add functionality to open a form for entering new post data
    });
    // Event listener for the new entry button
    negativeVote.addEventListener("click", function () {
      alert("Thanks for voting!");
      // Here you can add functionality to open a form for entering new post data
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
