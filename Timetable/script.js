const hideTable = () => {
    document.getElementById("fullTable").style.display="none";
    document.getElementById("oneDay").style.display="table";
}

const fillNewTable = (dayName) => {
    let data = JSON.parse(localStorage.getItem("tableData"));
    let day = data[dayName];
    document.getElementById("dayName").innerHTML = dayName;
    for (let i = 0; i <= 10; i++) {
        document.getElementById(`class${i}`).innerHTML = "";
    }
    day.forEach((item) => {
        document.getElementById(`class${item.period}`).innerHTML = `<h3>${item.className}</h3><p>classroom:${item.room}<br>teacher:${item.teacher}</p>`;
    });
}

const fetchAllData = () => {
    fetch(`http://localhost:3000/table`)
        .then((response) => {
            if (!response.ok) throw new Error("No table found");
            return response.json();
        })
        .then((data) => {
            loadTimetable(data);
            localStorage.setItem(("tableData"), JSON.stringify(data));
        })
        .catch((error) => {
            alert(error.message);
        });
}

const loadTimetable = (data) => {
    let timetable = [data.Monday, data.Tuesday, data.Wednesday, data.Thursday, data.Friday];
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    timetable.forEach((day, dayNumber) => {
        document.querySelectorAll(`.${days[dayNumber].toLowerCase()}`).forEach((element, index) => {
            day.forEach((item) => {
                if (index === item.period+1) {
                    element.innerHTML = `<h3>${item.className}</h3><p>classroom:${item.room}<br>teacher:${item.teacher}</p>`;
                }
            });
        });
    });
}

const showTable = () => {
    document.getElementById("fullTable").style.display="table";
    document.getElementById("oneDay").style.display="none";
}

window.onclick = (object) => {
    if (document.getElementById("fullTable").style.display === "table") {
        let monday = document.querySelectorAll(".monday, .monday *");
        let tuesday = document.querySelectorAll(".tuesday, .tuesday *");
        let wednesday = document.querySelectorAll(".wednesday, .wednesday *");
        let thursday = document.querySelectorAll(".thursday, .thursday *");
        let friday = document.querySelectorAll(".friday, .friday *");
        
        monday.forEach(element => {if (element === object.target){hideTable();fillNewTable("Monday");}});
        tuesday.forEach(element => {if (element === object.target){hideTable();fillNewTable("Tuesday");}});
        wednesday.forEach(element => {if (element === object.target){hideTable();fillNewTable("Wednesday");}});
        thursday.forEach(element => {if (element === object.target){hideTable();fillNewTable("Thursday");}});
        friday.forEach(element => {if (element === object.target){hideTable();fillNewTable("Friday");}});
    }
    else {
        let classes = document.querySelectorAll(".classes, .classes *");
        classes.forEach(element => {
            if (element === object.target) {
                if (element.innerHTML === "") {
                    element.innerHTML = `
                    <input type="text" id="${element.id}Input" placeholder="Enter class name">
                    <input type="text" id="${element.id}Room" placeholder="Enter room number">
                    <input type="text" id="${element.id}Teacher" placeholder="Enter teacher name">
                    <button onclick="saveClass(${element.id})">Add</button>`
                }
                else {
                    if (element.innerHTML.split("<h3>")[1] === undefined || element.innerHTML.split("classroom:")[1] === undefined || element.innerHTML.split("<br>teacher:")[1] === undefined) {
                        element = element.parentElement;
                    }
                        element.innerHTML = `
                        <input type="text" id="${element.id}Input" placeholder="Enter class name" Value="${element.innerHTML.split("<h3>")[1].split("</h3>")[0]}">
                        <input type="text" id="${element.id}Room" placeholder="Enter room number" Value="${element.innerHTML.split("classroom:")[1].split("<br>")[0]}">
                        <input type="text" id="${element.id}Teacher" placeholder="Enter teacher name" Value="${element.innerHTML.split("<br>teacher:")[1].split("</p>")[0]}">
                        <button onclick="saveClass(${element.id})">Save</button>
                        <button onclick="deleteClass(${element.id})">Delete</button>`
                }
            }
        });
    }
}

const saveClass = (classNumber) => {
    let className = document.getElementById(classNumber.id+"Input").value;
    let teacher = document.getElementById(classNumber.id+"Teacher").value;
    let room = document.getElementById(classNumber.id+"Room").value;

    if (className === "" || teacher === "" || room === "") {
        alert("Please fill all fields");
        return;
    }

    let data = JSON.parse(localStorage.getItem("tableData"));
    let period = classNumber.id.replace("class", "");
    let newClass = {className: className, teacher: teacher, room: room, period: period};
    let day = data[document.getElementById("dayName").innerHTML];
    let index = day.findIndex((item) => item.period == period);
    if (index === -1){
        day.push(newClass);
        localStorage.setItem("tableData", JSON.stringify(data));
        document.getElementById(classNumber.id).innerHTML = "<h3>"+className+"</h3><p>classroom:"+room+"<br>teacher:"+teacher+"</p>";
        
        fetch(`http://localhost:3000/${document.getElementById("dayName").innerHTML}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newClass)
        })
        .then((response) => {
            if (!response.ok) throw new Error("Error saving class");
            return response.json();
        })
    }
    else {
        day[index] = newClass;
        localStorage.setItem("tableData", JSON.stringify(data));
        document.getElementById(classNumber.id).innerHTML = "<h3>"+className+"</h3><p>classroom:"+room+"<br>teacher:"+teacher+"</p>";
        
        fetch(`http://localhost:3000/${document.getElementById("dayName").innerHTML}/${index+1}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newClass)
        })
        .then((response) => {
            if (!response.ok) throw new Error("Error saving class");
            return response.json();
        })
    }
}

const deleteClass = (classNumber) => {
    let day = JSON.parse(localStorage.getItem("tableData"))[document.getElementById("dayName").innerHTML];
    let period = classNumber.id.replace("class", "");
    fetch(`http://localhost:3000/${document.getElementById("dayName").innerHTML}/${day.findIndex((item) => item.period == period)+1}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then((response) => {
        if (!response.ok) throw new Error("Error deleting class");
        return response.json();
    })
    .then((data) => {
        day.splice(day.findIndex((item) => item.period == period), 1);
        localStorage.setItem("tableData", JSON.stringify(data));
        document.getElementById(classNumber.id).innerHTML = "";
    })
    .catch((error) => {
        alert(error.message);
    });
}

window.onload = () => {
    fetchAllData();
    document.getElementById("fullTable").style.display="table";
    document.getElementById("oneDay").style.display="none";
}