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
                <a href="#" id="create-post-link">Create Post</a>
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

        headerLogin.querySelector('#create-post-link').onclick = function (e) {
            e.preventDefault();
            window.location.href = 'post.html';
        };
    }
    loadInitialData().then(() => {
        categoriesData = [...new Set(blogsData.map(blog => blog.category))];
        ShowBlogs();
        ShowCategories();
    }).catch(error => {
        console.error('Error loading initial data:', error);
    });
}

function loadInitialData() {
    return Promise.all([
        fetch('http://localhost:5000/blogs/').then(res => res.json()).then(data => { blogsData = data; }),
        fetch('http://localhost:5000/users/').then(res => res.json()).then(data => { usersData = data; })
    ]);
}

function ShowBlogs() {
    const blogContainer = document.querySelector('.blog-main');
    blogContainer.innerHTML = `
            <article class="blog-post">
                <h2>Welcome to Blogger!</h2>
                <p>Enjoy an ad-free blogging experience, made by devs for devs!</p>
                <p>Click on the title to search</p>
            </article>`;
    blogsData.forEach(blog => {
        const article = document.createElement('article');
        article.className = 'blog-post';
        const user = usersData.find(user => user.id === blog.userId);
        const author = user ? user.username : 'Unknown User';
        article.innerHTML = `
        <div class="blog-meta">
        <a class="blog-directions" href="#${blog.category}" onclick="filterBlogsByCategory('${blog.category}')">${blog.category}</a>
        •
        <a class="blog-directions" href="#${author}" onclick="filterBlogsByUser(${blog.userId})">${author}</a>
        </div>
        <div onclick="viewBlogDetails(${blog.id})">
        <h2>
        ${blog.title} <span class="time-ago" title="Last updated: ${timeAgo(blog.updatedAt)}">(${timeAgo(blog.createdAt)})</span>
        </h2>
        <div>${blog.content}</div>
        </div>
        `;
        blogContainer.appendChild(article);
    });
}

function ShowCategories() {
    const categoryContainer = document.querySelector('.sidebar-list');
    categoryContainer.innerHTML = `<li><a href="#All Categories" onclick="ShowBlogs()">All Categories</a></li>`;
    categoriesData.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<a href="#${category}">${category}</a>`;
        categoryItem.onclick = () => filterBlogsByCategory(category);
        categoryContainer.appendChild(categoryItem);
    });
}

function filterBlogsByCategory(category) {
    const filteredBlogs = blogsData.filter(blog => blog.category === category);
    const blogContainer = document.querySelector('.blog-main');
    blogContainer.innerHTML = '';
    filteredBlogs.forEach(blog => {
        const article = document.createElement('article');
        article.className = 'blog-post';
        const user = usersData.find(user => user.id === blog.userId);
        const author = user ? user.username : 'Unknown User';

        article.innerHTML = `
            <div class="blog-meta">
                ${blog.category}
                •
                <a class="blog-directions" href="#${author}" onclick="filterBlogsByUser(${blog.userId})">${author}</a>
            </div>
            <h2 onclick="viewBlogDetails(${blog.id})">
                ${blog.title} <span class="time-ago">(${timeAgo(blog.createdAt)})</span>
            </h2>
            <div onclick="viewBlogDetails(${blog.id})">${blog.content}</div>
        `;
        blogContainer.appendChild(article);
    });
}

function filterBlogsByUser(userId) {
    const filteredBlogs = blogsData.filter(blog => blog.userId === userId);
    const blogContainer = document.querySelector('.blog-main');
    blogContainer.innerHTML = '';
    filteredBlogs.forEach(blog => {
        const article = document.createElement('article');
        article.className = 'blog-post';
        const user = usersData.find(user => user.id === blog.userId);
        const author = user ? user.username : 'Unknown User';

        article.innerHTML = `
            <div class="blog-meta">
                <a class="blog-directions" href="#${blog.category}" onclick="filterBlogsByCategory('${blog.category}')">${blog.category}</a>
                •
                ${author}
            </div>
            <h2 onclick="viewBlogDetails(${blog.id})">
                ${blog.title} <span class="time-ago" title="Last updated: ${timeAgo(blog.updatedAt)}">(${timeAgo(blog.createdAt)})</span>
            </h2>
            <div onclick="viewBlogDetails(${blog.id})">${blog.content}</div>
        `;
        blogContainer.appendChild(article);
    });
}

function timeAgo(dateString) {
    const now = new Date();
    const posted = new Date(dateString);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}

function viewBlogDetails(blogId) {
    const blog = blogsData.find(b => b.id === blogId);
    let existingOverlay = document.getElementById('blog-details-overlay');
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'blog-details-overlay';

    overlay.innerHTML += `
        <div class="blog-post">
            <div class="blog-meta">
                ${blog.category} • ${usersData.find(user => user.id === blog.userId).username}
            </div>
            <h2>
                ${blog.title} <span class="time-ago" title="Last updated: ${timeAgo(blog.updatedAt)}">(${timeAgo(blog.createdAt)})</span>
            </h2>
            <div>${blog.content}</div>
        </div>
    `;

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    }
    document.body.appendChild(overlay);
}

function showHeaderSearch() {
    document.getElementById('blogger-title').style.display = 'none';
    document.getElementById('header-search-container').style.display = 'block';
    document.getElementById('header-search').value = '';
    document.getElementById('header-search').focus();
}
function hideHeaderSearch() {
    document.getElementById('header-search-container').style.display = 'none';
    document.getElementById('blogger-title').style.display = 'block';
}


function searchCategory() {
    const searchInput = document.getElementById('search-category');
    const query = searchInput.value.toLowerCase();
    const filteredCategories = categoriesData.filter(category => category.toLowerCase().includes(query));

    const categoryContainer = document.querySelector('.sidebar-list');
    categoryContainer.innerHTML = `<li><a href="#All Categories" onclick="ShowBlogs()">All Categories</a></li>`;

    filteredCategories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<a href="#${category}">${category}</a>`;
        categoryItem.onclick = () => filterBlogsByCategory(category);
        categoryContainer.appendChild(categoryItem);
    });
}
function search() {
    const query = document.getElementById('header-search').value.trim().toLowerCase();
    if (!query) {
        ShowBlogs();
        return;
    }
    fetch(`http://localhost:5000/users/search/${encodeURIComponent(query)}`)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw err; });
            }
            return res.json();
        })
        .then(filteredUsers => {
            if (filteredUsers.length > 0) {
                showUsers(filteredUsers);
            } else {
                searchBlogs(query);
            }
        })
        .catch(error => {
            console.error('Error searching users:', error);
            searchBlogs(query);
        });
}
function showUsers(users) {
    const userContainer = document.querySelector('.blog-main');
    userContainer.innerHTML = '';
    users.forEach(user => {
        const article = document.createElement('article');
        article.className = 'blog-post';
        article.innerHTML = `
            <div class="blog-meta">
                <h2><a class="blog-directions" href="#${user.username}" onclick="filterBlogsByUser(${user.id})">${user.username}</a></h2>
            </div>
        `;
        userContainer.appendChild(article);
    })
}
    function searchBlogs(query) {
    if (!query) {
        ShowBlogs();
        return;
    }
    fetch(`http://localhost:5000/blogs/search/${encodeURIComponent(query)}`)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw err; });
            }
            return res.json();
        })
        .then(filteredBlogs => {
            const blogContainer = document.querySelector('.blog-main');
            blogContainer.innerHTML = '';
            filteredBlogs.forEach(blog => {
                const article = document.createElement('article');
                article.className = 'blog-post';
                const user = usersData.find(user => user.id === blog.userId);
                const author = user ? user.username : 'Unknown User';

                article.innerHTML = `
                    <div class="blog-meta">
                        <a class="blog-directions" href="#${blog.category}" onclick="filterBlogsByCategory('${blog.category}')">${blog.category}</a>
                        •
                        <a class="blog-directions" href="#${author}" onclick="filterBlogsByUser(${blog.userId})">${author}</a>
                    </div>
                    <h2 onclick="viewBlogDetails(${blog.id})">
                        ${blog.title} <span class="time-ago" title="Last updated: ${timeAgo(blog.updatedAt)}">(${timeAgo(blog.createdAt)})</span>
                    </h2>
                    <div onclick="viewBlogDetails(${blog.id})">${blog.content}</div>
                `;
                blogContainer.appendChild(article);
            });
        })
        .catch(error => {
            const blogContainer = document.querySelector('.blog-main');
            blogContainer.innerHTML = `
                <article class="blog-post">
                    <h2>No blogs found</h2>
                    <p>${error && error.message ? error.message : 'No blogs match your search.'}</p>
                </article>
            `;
        });
}
