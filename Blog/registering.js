let usersData = [];

window.onload = function () {
    loadInitialData()
        .then(() => {
            console.log('Initial data loaded:', usersData);
        })
        .catch((error) => {
            console.error('Error loading initial data:', error);
        });
};

function loadInitialData() {
    return Promise.all([
        fetch('http://localhost:5000/users/')
            .then((res) => res.json())
            .then((data) => {
                usersData = data;
            }),
    ]);
}

async function registration() {
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const messageDiv = document.getElementById('register-message');
    messageDiv.textContent = '';

    if (!email || !username || !password) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Please fill in all fields.';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Please enter a valid email address.';
        return;
    }
    if (username.length < 3 || username.length > 20) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Username must be between 3 and 20 characters.';
        return;
    }
    if (password.length < 6) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Password must be at least 6 characters long.';
        return;
    }
    for (const user of usersData) {
        if (user.email === email) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'Email is already registered.';
            return;
        }
        if (user.username === username) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'Username is already taken.';
            return;
        }
    }

    try {
        const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
        });
        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Registration successful! You can now log in.';
        } else {
            const data = await response.json();
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Registration failed.';
        }
    } catch (err) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Error connecting to server.';
    }

    alert('Registration successful! You can now log in.');

    setTimeout(() => {
        messageDiv.textContent = '';
        window.location.href = 'login.html';
    }, 100);
}
