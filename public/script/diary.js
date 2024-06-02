document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("diaryForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const title = document.getElementById("titleInput").value;
        const content = document.getElementById("contentTextarea").value;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("/postEntry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token, // Token im Header senden
            },
            body: JSON.stringify({ title, content }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Entry posted successfully");
                window.location.href = "/personalView.html";
            } else {
                alert("Failed to post entry");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        });
    });

window.onload = function () {
    // const sliderContainer = document.querySelector("#sliderContainer");
    // // Create a post-like wrapper div for all sliders
    // const slidersWrapper = document.createElement('div');
    // slidersWrapper.classList.add('slidersWrapper');
    // const sliderCount = 3; // Number of sliders to create
    // for (let i = 1; i <= sliderCount; i++) {
    //     // Create slider
    //     let slider = document.createElement('input');
    //     slider.type = 'range';
    //     slider.id = 'myRange' + i;
    //     slider.value = 50; // Default value
    //     // Create output display
    //     let output = document.createElement('span');
    //     output.id = 'demo' + i;
    //     output.innerHTML = slider.value; // Display the default slider value
    //     // Create a div to wrap each slider and its output
    //     let sliderDiv = document.createElement('div');
    //     sliderDiv.appendChild(slider);
    //     sliderDiv.appendChild(output);
    //     // Append the individual slider wrapper div to the sliders wrapper
    //     slidersWrapper.appendChild(sliderDiv);
    //     // Add event listener to update the output on input
    //     slider.oninput = function() {
    //         output.innerHTML = this.value;
    //     }
    // }
    // // Append the sliders wrapper to the main container
    // sliderContainer.appendChild(slidersWrapper);
    //  // Create a textbox for comments
    //  const commentBox = document.createElement('textarea');
    //  commentBox.placeholder = "Add a comment...";
    //  commentBox.id = "commentBox";
    //  commentBox.rows = 3; // Set the number of rows
    //  // Create the submit button
    //  const submitButton = document.createElement('button');
    //  submitButton.textContent = 'Submit';
    //  submitButton.id = 'submitButton';
    //  // Create the cancel button
    //  const cancelButton = document.createElement('button');
    //  cancelButton.textContent = 'Cancel';
    //  cancelButton.id = 'cancelButton';
    //  // Append the comment box and buttons to the sliders wrapper
    //  slidersWrapper.appendChild(commentBox);
    //  slidersWrapper.appendChild(submitButton);
    //  slidersWrapper.appendChild(cancelButton);
    //  // Append the sliders wrapper to the main container
    //  sliderContainer.appendChild(slidersWrapper);
    //  // Optional: Add event listeners for the buttons
    //  submitButton.addEventListener('click', function() {
    //      alert('Submit Clicked!');
    //      // Implement the action for the submit button
    //  });
    };