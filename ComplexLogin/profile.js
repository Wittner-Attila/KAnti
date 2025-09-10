let userProfile;

window.onload = function () {
    displayUserProfile();
};

function displayUserProfile() {
    userProfile = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('user').innerHTML = userProfile.username;

    document.getElementById('profile-email').value = userProfile.email;
    document.getElementById('profile-name').value = userProfile.username;
    document.getElementById('profile-password').value = userProfile.password;
}

function updateProfile() {
    const email = document.getElementById('profile-email').value;
    const username = document.getElementById('profile-name').value;
    const password = document.getElementById('profile-password').value;
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = '';

    if (!email || !username || !password) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Please fill in all fields.';
        return;
    }

    fetch(`http://localhost:5000/users/${userProfile.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password,
        }),
    });

    userProfile.email = email;
    userProfile.username = username;
    userProfile.password = password;

    sessionStorage.setItem('loggedInUser', JSON.stringify(userProfile));

    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Profile updated successfully!';
}

function deleteProfile() {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.'))
        return;

    fetch(`http://localhost:5000/users/${userProfile.id}`, {
        method: 'DELETE',
    })
        .then(() => {
            sessionStorage.removeItem('loggedInUser');
            alert('Profile deleted successfully.');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error deleting profile:', error);
        });
}
