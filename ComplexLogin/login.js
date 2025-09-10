let usersData = [];

window.onload = function () {
    loadInitialData().then(() => {
        console.log('Initial data loaded:', usersData);
    }).catch(error => {
        console.error('Error loading initial data:', error);
    });
}

function loadInitialData() {
    return Promise.all([
        fetch('http://localhost:5000/users/').then(res => res.json()).then(data => { usersData = data; })
    ]);
}

function login(){
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = '';

    if (!username || !password) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Please fill in all fields.';
        return;
    }

    const user = usersData.find(user => 
        (user.username === username || user.email === username) && user.password === password
    );
    
    if (user) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Login successful!';
        sessionStorage.setItem('loggedInUser', JSON.stringify({ username: user.username, email: user.email, id: user.id, password: user.password }));
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Invalid username or password.';
    }
}