/*
isAllOdd() - számokat tartalmazó tömb minden eleme páratlan-e. Visszatérési érték true vagy false
hasEven() - számokat tartalmazó tömb tartalmaz-e páros elemet. Visszatérési érték true vagy false
sigma() - számokat tartalmazó tömb elemeit összeszorozza és a szorzatot adja vissza

Tipp:
localeCompare
Math.abs

----------------------------------------

Kérdés:
Miért nem működik helyesen az alábbi kód:

let number = 3
const increase = (number) => number++

console.log(number)
console.log(increase(number))
console.log(number)

a number++ lefutás után növeli az értéket 1-el, helyes akkor lenne ha ++number lenne vagy number += 1
*/

const numbers = [2, 13, 3, 7, 17, 5, 11, 19, 9];
const names = ['Eva', 'Adel', 'Cedric', 'Dior', 'Frank', 'Bob'];
const fruits = ['pineapple', 'kiwi', 'banana', 'pear', 'cherry'];

const sortByLength = () => [...names].sort((a, b) => a.length - b.length);
const sortByLengthAsc = () => [...names].sort((a, b) => a.localeCompare(b));
const sortFrom15 = () => [...numbers].sort((a, b) => Math.abs(15 - a) - Math.abs(15 - b));
const addAsterisk = () => [...fruits].map((fruit) => `*${fruit}*`);
const between5And15 = () => [...numbers].filter((number) => number > 5 && number < 15);
const isAllOdd = () => [...numbers].filter((number) => number % 2 === 1).length === 0;
const hasEven = () => [...numbers].filter((number) => number % 2 === 0).length > 0;
const sigma = () => [...numbers].reduce((acc, curr) => acc * curr, 1);

console.log(sortByLength());
console.log(sortByLengthAsc());
console.log(sortFrom15());
console.log(addAsterisk());
console.log(between5And15());
console.log(isAllOdd());
console.log(hasEven());
console.log(sigma());
