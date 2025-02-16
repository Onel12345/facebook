document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form refresh

    let username = document.querySelector('input[name="username"]').value.trim();
    let password = document.querySelector('input[name="password"]').value.trim();

    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }

    try {
        let response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Parse the response as JSON
        const data = await response.json();

        // If the redirectUrl is present, redirect the user
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // Perform the redirect
        } else {
            alert("Login failed.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred.");
    }
});
