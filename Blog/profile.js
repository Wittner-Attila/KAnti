let blogsData = [];
let userProfile;

function loadBlogs() {
    return Promise.all([
        fetch('http://localhost:5000/blogs/').then(res => res.json()).then(data => { blogsData = data; }),
    ]);
}

window.onload = function () {
    loadBlogs().then(() => {
        displayUserProfile();
    }).catch(error => {
        console.error('Error loading blogs:', error);
    });
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


    const blogContainer = document.querySelector('.blog-main');
    blogContainer.innerHTML = ``;
    blogsData.forEach(blog => {
        if (blog.userId !== userProfile.id) return;
        const article = document.createElement('article');
        article.className = 'blog-post';
        article.innerHTML = `
        <div class="blog-meta">
        <a class="blog-directions" href="#${blog.category}" onclick="filterBlogsByCategory('${blog.category}')">${blog.category}</a>
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

function viewBlogDetails(blogId) {
    const blog = blogsData.find(b => b.id === blogId);
    let existingOverlay = document.getElementById('blog-details-overlay');
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'blog-details-overlay';

    overlay.innerHTML += `
        <div class="blog-post">
            <h2>
                <div class="form-title">${blog.title}</div>
                <button class="delete-button" onclick="deleteBlog(${blog.id})">Delete</button>
            </h2>
            <div><textarea class="blog-edit-content" rows="6" cols="40" maxlength="350">${blog.content}</textarea></div>
            <button class="form-button" onclick="updatePost(${blog.id})">Save</button>
        </div>
    `;

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    }
    document.body.appendChild(overlay);
}

function filterBlogsByCategory(category) {
    const filteredBlogs = blogsData.filter(blog => blog.category === category);
    const blogContainer = document.querySelector('.blog-main');
    blogContainer.innerHTML = '';
    filteredBlogs.forEach(blog => {
        if (blog.userId !== userProfile.id) return;
        const article = document.createElement('article');
        article.className = 'blog-post';

        article.innerHTML = `
            <div class="blog-meta">
                <a class="blog-directions" href="#" onclick="displayUserProfile()">Back</a>
            </div>
            <h2 onclick="viewBlogDetails(${blog.id})">
                ${blog.title} <span class="time-ago">(${timeAgo(blog.createdAt)})</span>
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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        })
    })

    userProfile.email = email;
    userProfile.username = username;
    userProfile.password = password;

    sessionStorage.setItem('loggedInUser', JSON.stringify(userProfile));
    
    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Profile updated successfully!';
}

function updatePost(blogId) {
    const blog = blogsData.find(b => b.id === blogId);
    if (!blog) return;

    const contentInput = document.querySelector('.blog-edit-content').value;

    if (!contentInput) {
        alert('Please fill in all fields.');
        return;
    }

    fetch(`http://localhost:5000/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: contentInput
        })
    }).then(setTimeout = () => {window.location.reload(),1000;})
}

function deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    fetch(`http://localhost:5000/blogs/${blogId}`, {
        method: 'DELETE'
    }).then(() => {
        alert('Blog deleted successfully.');
        window.location.reload();
    }).catch(error => {
        console.error('Error deleting blog:', error);
    });
}

function deleteProfile() {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;

    fetch(`http://localhost:5000/users/${userProfile.id}`, {
        method: 'DELETE'
    }).then(() => {
        sessionStorage.removeItem('loggedInUser');
        alert('Profile deleted successfully.');
        window.location.href = 'login.html';
    }).catch(error => {
        console.error('Error deleting profile:', error);
    });
}