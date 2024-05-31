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

    const navList = document.getElementById('navList');

    const navListItems = navList.getElementsByTagName('li');
    Array.from(navListItems).forEach(function(item) {
        item.addEventListener("click", function() {
            console.log("Navigating to: " + this.textContent);
        })
    })

    
};
