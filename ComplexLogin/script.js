let blogsData = [];
let usersData = [];
let categoriesData = [];
let loggedInUser;

window.onload = function () {
    if (sessionStorage.getItem('loggedInUser')) {
        loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        const headerLogin = document.querySelector('.header-login');
        headerLogin.innerHTML = `
            <div class="user-dropdown">
            <span class="user-dropdown-toggle" style="cursor:pointer;">${loggedInUser.username} ▼</span>
            <div class="user-dropdown-menu">
                <a href="#" id="profile-link">Profile</a>
                <a href="#" id="logout-link">Logout</a>
            </div>
            </div>
        `;

        const dropdownToggle = headerLogin.querySelector('.user-dropdown-toggle');
        const dropdownMenu = headerLogin.querySelector('.user-dropdown-menu');
        dropdownToggle.onclick = function (e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        };
        document.addEventListener('click', function () {
            dropdownMenu.style.display = 'none';
        });

        headerLogin.querySelector('#logout-link').onclick = function (e) {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            location.reload();
        };

        headerLogin.querySelector('#profile-link').onclick = function (e) {
            e.preventDefault();
            window.location.href = 'profile.html';
        };
    }
    loadInitialData();
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
