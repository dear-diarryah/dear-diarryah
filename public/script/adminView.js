document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();

    function fetchUsers() {
        fetch('/getUsers')
            .then(response => response.json())
            .then(users => displayUsers(users));
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