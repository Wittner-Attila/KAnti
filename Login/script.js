let users = [
    { email: 'test@gmail.com', password: 'test123' },
    { email: 'example@gmail.com', password: 'example123' },
];

function login() {
    if (localStorage.getItem('isSignedIn') === 'true') {
        window.location.href = 'dashboard.html';
        return;
    }
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    console.log(email, password);
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('isSignedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error-message').innerText = 'Invalid email or password';
    }
}

function checkSignIn() {
    const isSignedIn = localStorage.getItem('isSignedIn');
    if (isSignedIn === 'true') {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.setItem('isSignedIn', 'false');
    window.location.href = 'login.html';
}

function register() {
    let email = document.getElementById('emailReg').value;
    let password = document.getElementById('passwordReg').value;
    let passwordConfirm = document.getElementById('passwordConfirm').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (password !== passwordConfirm) {
        document.getElementById('error-message-reg').innerText = 'Passwords do not match';
        return;
    }
    if (!emailRegex.test(email)) {
        document.getElementById('error-message-reg').innerText = 'Invalid email format';
        return;
    }
    if (users.find((user) => user.email === email)) {
        document.getElementById('error-message-reg').innerText = 'Email already registered';
        return;
    }
    users.push({ email: email, password: password });
    localStorage.setItem('isSignedIn', 'true');
    window.location.href = 'dashboard.html';
}
