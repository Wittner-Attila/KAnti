import input from "./input.js";

const students = async () => {
  let studentsArray = [];
  console.clear();
  const numberOfStudents = parseInt(await input("Felvitendő tanulók száma:"));
  for (let i = 0; i < numberOfStudents; i++) {
    console.clear();
    const name = await input("Név:");
    const email = await input("E-mail:");
    const student = {
      name: name,
      email: email,
    };
    studentsArray.push(student);
  }
  return studentsArray;
};

const studentsArray = await students();
console.clear();
console.log("A tanulók adatai:");
studentsArray.forEach((student) => {
  console.log(`Név: ${student.name} E-mail: ${student.email}`);
});
