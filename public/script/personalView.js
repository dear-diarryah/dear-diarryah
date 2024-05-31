window.onload = function () {
    const listNavElement = document.querySelector("nav");

    /*
    // Home Button
    const homeBtn = document.createElement('button');
    homeBtn.textContent = 'Home';
    listNavElement.appendChild(homeBtn);

    // Diary Button
    const diaryBtn = document.createElement('button');
    diaryBtn.textContent = 'Diary';
    listNavElement.appendChild(diaryBtn);

    // Health Button
    const healthBtn = document.createElement('button');
    healthBtn.textContent = 'Health';
    listNavElement.appendChild(healthBtn);

    // Diary Button
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    listNavElement.appendChild(logoutBtn);
*/

    //const navListElements = document.querySelector('nav');

    
};

const postData = [
    { title: "Megi Voj.", content: "Ich liebe Sammy" },
    { title: "Ivan B.", content: "Ich liebe meine Frau." },
    { title: "Post C", content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. " + "23#" +
    "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, nos" }
];


document.addEventListener('DOMContentLoaded', function() {
const postContainer = document.getElementById('postContainer');

postData.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML= `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
    `;
    postContainer.appendChild(postElement);

    // Create Like button
    const positiveVote = document.createElement('button');
    positiveVote.classList.add('positiveVoteButton');
    positiveVote.textContent = 'Helpful';

    // Create Dislike button
    const negativeVote = document.createElement('button');
    negativeVote.classList.add('negativeVoteButton');
    negativeVote.textContent = 'Dislike';


    postElement.appendChild(positiveVote);
    postElement.appendChild(negativeVote);


    // Event listener for the new entry button
    positiveVote.addEventListener('click', function() {
    alert('Thanks for voting!');
    // Here you can add functionality to open a form for entering new post data
});

// Event listener for the new entry button
    negativeVote.addEventListener('click', function() {
    alert('Thanks for voting!');
    // Here you can add functionality to open a form for entering new post data
});

    
});

const addButton = document.createElement('button');
    addButton.textContent = 'Create New';
    addButton.id = 'addEntryButton'; // ID for styling and event handling
    postContainer.appendChild(addButton);

  // Event listener for the new entry button
  addButton.addEventListener('click', function() {
    alert('Add button clicked! Implement the functionality to create a new entry.');
    // Here you can add functionality to open a form for entering new post data
});

});






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
