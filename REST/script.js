const toggleSwitch = document.getElementById('themeToggle');

toggleSwitch.addEventListener('change', toggleTheme);

function toggleTheme() {
    if (toggleSwitch.checked) {
        document.documentElement.style.setProperty('--color', 'rgb(0, 0, 0)');
        document.documentElement.style.setProperty('--color-second', 'rgb(40, 40, 40)');
        document.documentElement.style.setProperty('--color-opposite', 'rgb(255, 255, 255)');
    } else {
        document.documentElement.style.setProperty('--color', 'rgb(215, 215, 215)');
        document.documentElement.style.setProperty('--color-second', 'rgb(255, 255, 255)');
        document.documentElement.style.setProperty('--color-opposite', 'rgb(40, 40, 40)');
    }
}

function back() {
    backToCourses();
    backToStudents();
    document.getElementById("students").classList.add("hide");
    document.getElementById("courses").classList.add("hide");
    document.getElementById("choice").classList.remove("hide");
}

function students() {
    document.getElementById("choice").classList.add("hide");
    document.getElementById("students").classList.remove("hide");

    const studentDropdown = document.getElementById("studentDropdown");
    studentDropdown.innerHTML = "";

    fetch('https://vvri.pythonanywhere.com/api/students')
        .then(response => response.json())
        .then(json => {
            json.forEach(student => {
                const option = document.createElement("option");
                option.value = student.id;
                option.textContent = student.name;
                studentDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching students:", error));
}

function deleteStudent() {
    const studentDropdown = document.getElementById("studentDropdown");
    const studentId = studentDropdown.value;

    fetch(`https://vvri.pythonanywhere.com/api/students/${studentId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert("Student deleted successfully");
                students();
            } else {
                alert("Error deleting student");
            }
        })
        .catch(error => console.error("Error deleting student:", error));
}

function editStudent() {
    const studentDropdown = document.getElementById("studentDropdown");
    const studentId = studentDropdown.value;

    document.getElementById("chooseStudent").classList.add("hide");
    document.getElementById("editStudent").classList.remove("hide");

    fetch(`https://vvri.pythonanywhere.com/api/students/${studentId}`)
        .then(response => response.json())
        .then(json => {
            document.getElementById("studentName").value = json.name;
        })
        .catch(error => console.error("Error fetching student:", error));
}

function backToStudents() {
    document.getElementById("editStudent").classList.add("hide");
    document.getElementById("addStudent").classList.add("hide");
    document.getElementById("chooseStudent").classList.remove("hide");
}

function saveStudent() {
    const studentDropdown = document.getElementById("studentDropdown");
    const studentId = studentDropdown.value;

    const studentName = document.getElementById("studentName").value;

    fetch(`https://vvri.pythonanywhere.com/api/students/${studentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: studentName
        })
    })
        .then(response => {
            if (response.ok) {
                alert("Student updated successfully");
                students();
            } else {
                alert("Error updating student");
            }
        })
        .catch(error => console.error("Error updating student:", error));
    backToStudents();
}

function newStudent() {
    document.getElementById("chooseStudent").classList.add("hide");
    document.getElementById("addStudent").classList.remove("hide");
}

function saveNewStudent() {
    const studentName = document.getElementById("newStudentName").value;

    fetch('https://vvri.pythonanywhere.com/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: studentName
        })
    })
        .then(response => {
            if (response.ok) {
                alert("Student added successfully");
                students();
            } else {
                alert("Error adding student");
            }
        })
        .catch(error => console.error("Error adding student:", error));
    backToStudents();
}

function courses() {
    document.getElementById("choice").classList.add("hide");
    document.getElementById("courses").classList.remove("hide");

    const courseDropdown = document.getElementById("coursesDropdown");
    courseDropdown.innerHTML = "";

    fetch('https://vvri.pythonanywhere.com/api/courses')
        .then(response => response.json())
        .then(json => {
            json.forEach(course => {
                const option = document.createElement("option");
                option.value = course.id;
                option.textContent = course.name;
                courseDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching courses:", error));
}

function deleteCourse() {
    const coursesDropdown = document.getElementById("coursesDropdown");
    const coursesId = coursesDropdown.value;

    fetch(`https://vvri.pythonanywhere.com/api/courses/${coursesId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert("course deleted successfully");
                courses();
            } else {
                alert("Error deleting course");
            }
        })
        .catch(error => console.error("Error deleting courses:", error));
}

function editCourse() {
    const coursesDropdown = document.getElementById("coursesDropdown");
    const coursesId = coursesDropdown.value;

    document.getElementById("chooseCourses").classList.add("hide");
    document.getElementById("editCourse").classList.remove("hide");
    document.getElementById("studentsInCourse").innerHTML = "";



    fetch(`https://vvri.pythonanywhere.com/api/courses/${coursesId}`)
        .then(response => response.json())
        .then(json => {
            document.getElementById("courseName").value = json.name;
        })
    fetch('https://vvri.pythonanywhere.com/api/students')
        .then(response => response.json())
        .then(students => {
            fetch(`https://vvri.pythonanywhere.com/api/courses/${coursesId}`)
                .then(response => response.json())
                .then(course => {
                    const studentsInCourse = course.students.map(student => student.id);
                    students.forEach(student => {
                        const isChecked = studentsInCourse.includes(student.id) ? 'checked' : '';
                        document.getElementById("studentsInCourse").innerHTML += `<input type="checkbox" name="student" id="student${student.id}" value="${student.id}" ${isChecked}> ${student.name}<br>`;
                    });
                })
                .catch(error => console.error("Error fetching course:", error));
        })
        .catch(error => console.error("Error fetching students:", error));
};

function backToCourses() {
    document.getElementById("editCourse").classList.add("hide");
    document.getElementById("addCourse").classList.add("hide");
    document.getElementById("chooseCourses").classList.remove("hide");
}

function saveCourse() {
    const coursesDropdown = document.getElementById("coursesDropdown");
    const coursesId = coursesDropdown.value;

    const courseName = document.getElementById("courseName").value;

    const students = [];

    document.querySelectorAll('input[type="checkbox"][name="student"]').forEach(studentCheckbox => {
        if (studentCheckbox.checked) {
            students.push({
                id: studentCheckbox.value,
                name: studentCheckbox.nextSibling.textContent.trim()
            });
        }
    });

    console.log(courseName);
    console.log(students);

    fetch(`https://vvri.pythonanywhere.com/api/courses/${coursesId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: courseName,
            students: students
        })
    })
        .then(response => {
            if (response.ok) {
                alert("Course updated successfully");
                courses();
            } else {
                alert("Error updating course");
            }
        })
        .catch(error => console.error("Error updating course:", error));
    backToCourses();
}

function newCourse() {
    document.getElementById("chooseCourses").classList.add("hide");
    document.getElementById("addCourse").classList.remove("hide");
    document.getElementById("studentsInNewCourse").innerHTML = "";

    fetch('https://vvri.pythonanywhere.com/api/students')
        .then(response => response.json())
        .then(students => {
            students.forEach(student => {
                document.getElementById("studentsInNewCourse").innerHTML += `<input type="checkbox" name="student" id="student${student.id}" value="${student.id}"> ${student.name}<br>`;
            });
        })
        .catch(error => console.error("Error fetching students:", error));
}

function saveNewCourse() {
    const courseName = document.getElementById("newCourseName").value;

    const students = [];
    document.querySelectorAll('input[type="checkbox"][name="student"]').forEach(studentCheckbox => {
        if (studentCheckbox.checked) {
            students.push({
                id: studentCheckbox.value,
                name: studentCheckbox.nextSibling.textContent.trim()
            });
        }
    });

    fetch('https://vvri.pythonanywhere.com/api/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: courseName,
            students: students
        })
    })
        .then(response => {
            if (response.ok) {
                alert("Course added successfully");
                courses();
            } else {
                alert("Error adding course");
            }
        })
        .catch(error => console.error("Error adding course:", error));
    backToCourses();
}