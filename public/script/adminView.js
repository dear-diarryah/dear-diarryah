document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();

    async function fetchUsers() {

        try {
            const response = await fetch("/getUsers", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            })
            /*.then(response => console.log(response.user))
            .then(users => displayUsers(users));*/
            const data = await response.json();
            const users = data.user;
            console.log(users);
            displayUsers(users);
        
        }
            catch(error) {
                console.error("Error:", error);
                alert("Failed to fetch entries");
            }
    }

    function displayUsers(users) {
        const container = document.getElementById('userListContainer');
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user';
            userDiv.textContent = user.username;
            userDiv.onclick = () => showUserOptions(user);
            container.appendChild(userDiv);
        });
    }

    function showUserOptions(user) {
        const options = confirm(`Wählen Sie eine Option für ${user.username}: 
        1. Username ändern 
        2. Passwort ändern 
        3. Sperren 
        4. Löschen`);
        // Hier Logik für die Auswahl implementieren
    }
});