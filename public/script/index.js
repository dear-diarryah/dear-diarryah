window.onload = function () {
    const listElement = document.querySelector("main");

    //Dear Diarryah Header Item
    const welcomeHeader = document.createElement('h1');
    welcomeHeader.textContent = "Dear Diarryah";
    listElement.appendChild(welcomeHeader);

    //Body Welcome Text paragraph
    const welcomeText = document.createElement('p');
    welcomeText.textContent = 'A place for you to write your pets diary and track its health status.';
    listElement.appendChild(welcomeText);

    // Sign Up Button
    const signUpBtn = document.createElement('button');
    signUpBtn.textContent = 'Sign Up';
    listElement.appendChild(signUpBtn);

    // Login Button
    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Login';
    listElement.appendChild(loginBtn);

    // Form for Sign Up
    const signUpForm = document.createElement('form');
    
        // Name
        const signUpNameLabel = document.createElement('label');
        signUpNameLabel.textContent = 'Name: ';
        const signUpNameInput = document.createElement('input');
        signUpNameInput.type = 'text';
        signUpNameInput.name = 'name';
        signUpForm.appendChild(signUpNameLabel);
        signUpForm.appendChild(signUpNameInput);

        // Email
        const signUpEmailLabel = document.createElement('label');
        signUpEmailLabel.textContent = 'Email:';
        const signUpEmailInput = document.createElement('input');
        signUpEmailInput.type = 'email';
        signUpEmailInput.name = 'email';
        signUpForm.appendChild(signUpEmailLabel);
        signUpForm.appendChild(signUpEmailInput);
        
        // Password
        const signUpPasswordLabel = document.createElement('label');
        signUpPasswordLabel.textContent = 'Password:';
        const signUpPasswordInput = document.createElement('input');
        signUpPasswordInput.type = 'password';
        signUpPasswordInput.name = 'password';
        signUpForm.appendChild(signUpPasswordLabel);
        signUpForm.appendChild(signUpPasswordInput);

        // Phone
        const signUpPhoneLabel = document.createElement('label');
        signUpPhoneLabel.textContent = 'Phone:';
        const signUpPhoneInput = document.createElement('input');
        signUpPhoneInput.type = 'text';
        signUpPhoneInput.name = 'phone';
        signUpForm.appendChild(signUpPhoneLabel);
        signUpForm.appendChild(signUpPhoneInput);
        
        // Submit Button
        const signUpSubmitButton = document.createElement('button');
        signUpSubmitButton.type = 'submit';
        signUpSubmitButton.textContent = 'Sign Up';
        signUpForm.appendChild(signUpSubmitButton);

        // Append the form to the main element
        listElement.appendChild(signUpForm);

    // End Form Sign Up

    // Form for Login
    const loginForm = document.createElement('form');

        // Email
        const loginEmailLabel = document.createElement('label');
        loginEmailLabel.textContent = 'Email:';
        const loginEmailInput = document.createElement('input');
        loginEmailInput.type = 'email';
        loginEmailInput.name = 'email';
        loginForm.appendChild(loginEmailLabel);
        loginForm.appendChild(loginEmailInput);
        
        // Password
        const loginPasswordLabel = document.createElement('label');
        loginPasswordLabel.textContent = 'Password:';
        const loginPasswordInput = document.createElement('input');
        loginPasswordInput.type = 'password';
        loginPasswordInput.name = 'password';
        loginForm.appendChild(loginPasswordLabel);
        loginForm.appendChild(loginPasswordInput);

        // Submit Button
        const loginButton = document.createElement('button');
        loginButton.type = 'submit';
        loginButton.textContent = 'Login';
        loginForm.appendChild(loginButton);

        listElement.appendChild(loginForm);

    // End Form Login
    
    //Sign UP Eventhandler

    signUpBtn.addEventListener('click', function () {
        signUpBtn.style.display = 'none';
        loginBtn.style.display = 'none';
        signUpForm.style.display = 'flex';
    });

    signUpForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // Handle form submission for sign up
        console.log('Sign Up form submitted!');
    });

    //Login Eventhandler
    loginBtn.addEventListener('click', function () {
        signUpBtn.style.display = 'none';
        loginBtn.style.display = 'none';
        loginForm.style.display = 'flex';
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // Handle form submission for login
        console.log('Login form submitted!');
    });
};
