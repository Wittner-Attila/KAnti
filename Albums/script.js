const AddAlbum = async () => {
    const albumName = prompt("Enter the name of the new album:");
    if (albumName === null) {
        console.log("User cancelled the prompt.");
        return;
    }
    if (albumName.trim() === "") {
        console.log("User did not enter a name.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/albums");
        const data = await response.json();

        const albumExists = data.some((album) => album === albumName);

        if (albumExists) {
            alert("Album with the same name already exists.");
            return;
        }

        // Only if it doesn't exist, create a new album
        const createResponse = await fetch("http://localhost:5000/newAlbum", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ albumName }),
        });

        if (createResponse.ok) {
            console.log("Album created successfully");
            RefreshAlbums(); // Refresh the album list after creating a new album
        } else {
            console.error("Error creating album:", createResponse.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const RefreshAlbums = () => {
    //get all albums from the server and display them in the album list
    fetch("http://localhost:5000/albums")
        .then((response) => response.json())
        .then((data) => {
            let albums = "";
            data.forEach((album) => {
                albums += `<li><button onclick="OpenAlbum('${album}')">${album}</button></li>`;
            });
            document.getElementById("albumList").innerHTML = `<li><button onclick="AddAlbum()">+</button></li>` + albums;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const OpenAlbum = (albumName) => {
    document.getElementById("albumName").innerText = albumName;
    document.getElementById("buttons").innerHTML = `<button class="deleteButton" onclick="DeleteAlbum('${albumName}')">Delete Album</button><button class="EditButton" onclick="EditAlbum('${albumName}')">Edit Album</button>`;
    document.getElementById("albumInfo").innerHTML = `<li id="newSong"><button onclick="AddSong()">Add Song</button></li>`;
    RefreshAlbumSongs(albumName); // Fetch and display songs for the selected album
}

const DeleteAlbum = (albumName) => {
    // Send a DELETE request to the server with the album name
    fetch(`http://localhost:5000/${albumName}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                console.log("Album deleted successfully");
                RefreshAlbums(); // Refresh the album list after deleting an album
            } else {
                console.error("Error deleting album:", response.statusText);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const EditAlbum = async (albumName) => {
    const newAlbumName = prompt("Enter the new name for the album:", albumName);

    if (newAlbumName === null) {
        console.log("User cancelled the prompt.");
        return;
    }
    if (newAlbumName.trim() === "") {
        alert("Enter a name.");
        return;
    }
    if (newAlbumName === albumName) {
        console.log("User did not change the name.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/albums");
        const data = await response.json();

        const albumExists = data.some((album) => album === newAlbumName);

        if (albumExists) {
            alert("Album with the same name already exists.");
            return;
        }

        // Only proceed to update if the new album name does not exist
        const updateResponse = await fetch(`http://localhost:5000/${albumName}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newAlbumName }),
        });

        if (updateResponse.ok) {
            console.log("Album updated successfully");
            document.getElementById("albumName").innerText = newAlbumName;
            document.getElementById("buttons").innerHTML = `<button class="deleteButton" onclick="DeleteAlbum('${newAlbumName}')">Delete Album</button><button class="EditButton" onclick="EditAlbum('${newAlbumName}')">Edit Album</button>`;
            RefreshAlbums(); // Refresh the album list after renaming
        } else {
            console.error("Error updating album:", updateResponse.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};












const AddSong = () => {
    document.getElementById("newSong").innerHTML = `
                                                    <input type="text" id="songName" placeholder="Song Name">
                                                    <input type="number" id="songLength" placeholder="Song Length (in seconds)">
                                                    <button onclick="SubmitSong()">Submit</button>`;
}

const SubmitSong = () => {
    const songName = document.getElementById("songName").value;
    const songLength = document.getElementById("songLength").value;
    const albumName = document.getElementById("albumName").innerText;

    // Validate inputs
    if (songName.trim() === "" || songLength.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Send a POST request to the server with the song details
    fetch(`http://localhost:5000/${albumName}/newSong`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ songName, songLength }),
    })
        .then((response) => {
            if (response.ok) {
                console.log("Song added successfully");
                RefreshAlbumSongs(albumName); // Refresh the album songs after adding a new song
            } else {
                console.error("Error adding song:", response.statusText);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const RefreshAlbumSongs = (albumName) => {
    //get all songs from the server and display them in the album info
    fetch(`http://localhost:5000/${albumName}`)
        .then((response) => response.json())
        .then((data) => {
            let songs = "";
            data.forEach((song) => {
                songs += `<li id="${song.songName}">
                              ${song.songName} (${song.songLength} seconds)<button class="deleteButton" onclick="DeleteSong('${albumName}', '${song.id}')">Delete</button><button class="EditButton" onclick="EditSong('${albumName}', '${song.songName}', '${song.songLength}', '${song.id}')">Edit</button>
                          </li>`;
            });
            document.getElementById("albumInfo").innerHTML = `<li id="newSong"><button onclick="AddSong()">Add Song</button></li>` + songs;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const DeleteSong = (albumName, id) => {
    // Send a DELETE request to the server with the song details
    fetch(`http://localhost:5000/${albumName}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                console.log("Song deleted successfully");
                RefreshAlbumSongs(albumName); // Refresh the album songs after deleting a song
            } else {
                console.error("Error deleting song:", response.statusText);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const EditSong = (albumName, songName, songLength, id) => {
    // Get the new song name and length from the user
    document.getElementById(songName).innerHTML = `
        <input type="text" id="newSongName" placeholder="New Song Name" value="${songName}">
        <input type="number" id="newSongLength" placeholder="New Song Length (in seconds)" value="${songLength}">
        <button onclick="UpdateSong('${albumName}', '${songName}', '${id}')">Update</button>`;
}

const UpdateSong = (albumName, songName, id) => {
    const newSongName = document.getElementById("newSongName").value;
    const newSongLength = document.getElementById("newSongLength").value;

    // Validate inputs
    if (newSongName === null || newSongLength === null) {
        console.log("User cancelled the prompt.");
        return;
    }
    if (newSongName.trim() === "" || newSongLength.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }
    // Send a PUT request to the server with the updated song details
    fetch(`http://localhost:5000/${albumName}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newSongName: newSongName, newSongLength: newSongLength }),
    })
        .then((response) => {
            if (response.ok) {
                console.log("Song updated successfully");
                document.getElementById(songName).innerHTML = `<li id="${newSongName}">
                                                                                ${newSongName} (${newSongLength} seconds)<button class="deleteButton" onclick="DeleteSong('${albumName}', '${id}')">Delete</button><button class="EditButton" onclick="EditSong('${albumName}', '${newSongName}', '${newSongLength}', '${id}')">Edit</button>
                                                                            </li>`;
            } else {
                console.error("Error updating song:", response.statusText);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}