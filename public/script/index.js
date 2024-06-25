document
  .getElementById("signUpForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const response = await fetch("/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.auth) {
        // alert("Registration successful");
        localStorage.setItem("token", data.token);
        window.location.href = "/personalView.html";
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.auth) {
        // alert("Login successful");
        localStorage.setItem("token", data.token);
        console.log(data);
        if (data.isAdmin) {
          window.location.href = "/adminView.html";
        } else {
          window.location.href = "/personalView.html";
        }
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
