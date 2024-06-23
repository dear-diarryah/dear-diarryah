document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();

    /* TODO
    ich habe die initiale verison mal aufgesetzt.
    der endpoint muss implementiert werden.
    die funktion changeUsernameLogic greift leider nicht, ich weiß nicht wie ich den eventhandler richtig einbinde (click)
    vom HTML form die aufpoppt wenn man edit username anklickt.

    die user aufrufen ist ein GET
    edit username = PUT
    reset password = POST (default z.B. WeLoveDiarryah1#) (kann weg gelassen werden)
    delete = post

    somit sind 3 endpoints gecalled und das must requirement gedeckt.

    es wäre gut wenn man auch einen einzelnen user suchen könnte
    bsp in eigener form darüber und dann ein getUser so wie Taufner uns bei der präsi gefragt hat
    es ist ineffizient immer ALLE user abzurufen.
    > muss implementiert werden.

    diese form sollte aufscheinen als landingpage für den user admin
    sonst kommt keiner rein

    evtl. token hinterlegen
    */
});

async function fetchUsers() {
    try {
        const response = await fetch("/admin/getUsers", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        const users = data.users;

        const container = document.getElementById('userListContainer');

        if (container.hasChildNodes()) {
            container.innerHTML = '';
        }

        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user';
            const userLabel = document.createElement('span');
            userLabel.textContent = "Affected User: " + user.username + " UID: " + user.id;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'buttonContainer';

            const btnChangeUsername = createButton('Change Username', 'button changeButton', () => showUsernameChangeForm(user));
            const btnResetPassword = createButton('Reset Password', 'button changeButton', () => resetPassword(user));
            const btnLockUser = createButton('Lock User', 'button lockButton', () => lockUser(user));
            const btnDeleteUser = createButton('Delete User', 'button deleteButton', () => deleteUser(user));

            buttonContainer.append(btnChangeUsername, btnResetPassword, btnLockUser, btnDeleteUser);
            userDiv.append(userLabel, buttonContainer);
            container.appendChild(userDiv);
        });
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to fetch entries");
    }
}

function createButton(text, className, onClickFunction) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    button.onclick = onClickFunction;
    return button;
}

function showUsernameChangeForm(user) {
    console.log(user);
    const form = document.getElementById("usernameChangeForm");
    
    if (form) {
        document.getElementById("newUsername").placeholder = "New username for " + user.username;
        document.getElementById("newUsername").value = "";
        form.style.display = "block";

        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            await changeUsername(user.id);
        });
    }
}

function hideUsernameChangeForm() {
    const form = document.getElementById("usernameChangeForm");
    if (form) form.style.display = "none";
}

async function changeUsername(userId) {
    console.log(userId);
    const newUsername = document.getElementById("newUsername").value;
    try {
        const response = await fetch(`/admin/updateUsername/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newUsername: newUsername })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            fetchUsers();
        } else {
            alert(data.error);
        }
        hideUsernameChangeForm();
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating username.");
    }
}
