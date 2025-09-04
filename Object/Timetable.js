import input from "./input.js";
const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];

const timetableInput = async () => {
  const timetable = [];
  for (let day = 0; day < days.length; day++) {
    let subjects = [];
    const begin = parseInt(
      await input(
        "Adja meg a " + days[day] + "i kezdő óra számát (pl 0. óra): "
      )
    );
    const end = parseInt(
      await input(
        "Adja meg a " + days[day] + "i utolsó óra számát (pl 8. óra): "
      )
    );
    for (let hour = begin; hour <= end; hour++) {
      const subject = await input(
        `Adja meg a ${days[day]} ${hour}. órájának tárgyát: `
      );
      subjects.push({ period: hour, subject: subject });
    }
    timetable.push({ day: days[day], subjects });
  }
  return timetable;
};

const timetable = await timetableInput();

timetable.forEach((day) => {
  let subjectsList = "";
  for (let i = 0; i < day.subjects.length; i++) {
    const subject = day.subjects[i];
    subjectsList += `${subject.period}. óra: ${subject.subject}\t`;
  }
  console.log(day.day + ":\n" + subjectsList + "\n");
});
