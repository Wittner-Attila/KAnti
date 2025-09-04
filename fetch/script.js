document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode === "dark") {
        document.body.classList.add("dark");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    if (username) {
        document.getElementById("username").value = username;
        fetchUserData(username);
    }

    const savedData = JSON.parse(localStorage.getItem("userData"));
    if (savedData) {
        displayUserData(savedData);
    }
});

function searchUser() {
    const username = document.getElementById("username").value.trim();
    if (!username) return;

    const newUrl = `${window.location.pathname}?${username}`;
    history.pushState(null, "", newUrl);

    fetchUserData(username);
}

function fetchUserData(username) {
    fetch(`https://www.codewars.com/api/v1/users/${username}`)
        .then((response) => {
            if (!response.ok) throw new Error("No user found");
            return response.json();
        })
        .then((data) => {
            displayUserData(data);
            localStorage.setItem("userData", JSON.stringify(data));
        })
        .catch((error) => {
            alert(error.message);
        });
}

function displayUserData(data) {
    typewriterEffect(document.getElementById("username-display"), data.username || "No data");
    typewriterEffect(document.getElementById("name"), data.name || "No data");
    typewriterEffect(document.getElementById("clan"), data.clan || "No data");

    const languagesList = document.getElementById("languages");
    languagesList.innerHTML = "";
    if (data.ranks && data.ranks.languages) {
        Object.keys(data.ranks.languages).forEach((lang) => {
            const li = document.createElement("li");
            typewriterEffect(li, `${lang}: ${data.ranks.languages[lang].rank}`);
            languagesList.appendChild(li);
        });
    } else {
        languagesList.innerHTML = "<li>No data</li>";
    }

    document.getElementById("user-card").style.display = "block";
}

function typewriterEffect(element, text, delay = 100) {
    element.textContent = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }
    type();
}

function toggleMode() {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("mode", mode);
}

function clearData() {
    localStorage.removeItem("userData");
    document.getElementById("user-card").style.display = "none";
    document.getElementById("username").value = "";
    const newUrl = window.location.pathname;
    history.pushState(null, "", newUrl);
}