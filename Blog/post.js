async function post() {
    let userId = JSON.parse(sessionStorage.getItem("loggedInUser")).id;
    console.log(sessionStorage.getItem("loggedInUser"));
    let title = document.querySelector(".post-title").value;
    let category = document.querySelector(".post-category").value;
    let content = document.querySelector(".post-content").value;

    if (title === "" || category === "" || content === "") {
        alert("Please fill in all fields.");
        return;
    }
    try {
        const response = await fetch("http://localhost:5000/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, title, category, content })
        });
        if (response.ok) {
            alert("Post created successfully!");
            document.querySelector(".post-title").value = "";
            document.querySelector(".post-category").value = "";
            document.querySelector(".post-content").value = "";
        } else {
            const data = await response.json();
            alert(data.message || "Failed to create post.");
        }
    } catch (err) {
        console.error({Error: err});
        alert("Error connecting to server.");
        return;
    }

    window.location.href = "index.html";
}