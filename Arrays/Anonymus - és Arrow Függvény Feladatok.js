/*
Tömb másolat készítése - spread operátor

const numbers = [3,7,1,2,6,4,5]
const copyArray = [... originalArray]

sort()
numbers.sort((a, b) => a - b)

forEach()
numbers.forEach((item) => { console.log(item) })
numbers.forEach((item, index) => { console.log(`${index + 1}. ${item}`) })

map()
numbers.map(item => item - 1)
numbers.map((item, index) => `${index + 1}. ${item}`)

filter()
numbers.filter(item => item > 10)
numbers.filter((item, index) => item > 10 && index > 5)

find() findLast() findIndex() findLastIndex()
numbers.find(item => item > 10)
numbers.find((item, index) => item > 10 && index > 5)

every()
numbers.every(item => item > 0)

some()
numbers.some(item => item % 2 == 0)

reduce()
numbers.reduce((total, item) => total + item)
numbers.reduce((total, item, index) => total + item * 10 **index)
numbers.reduce((total, item) => total + item, 100)


----------------------------------------
Feladat:
Adottak az alábbi tömbök:
const numbers = [2,13,3,7,17,5,11,19,9]
const names = ['Eva', 'Adel', 'Cedric', 'Dior', 'Frank', 'Bob']
const fruits = ['pineapple', 'kiwi', 'banana', 'pear', 'cherry']

Hozd létre az alábbi függvényeket:
sortByLength() - String tömböt a szavak hossza szerint rendezi és a rendezett tömböz adja vissza
sortByLengthAsc() - String tömböt a szavak hossza szerint rendezi ABC sorrendbe és a rendezett tömböz adja vissza
sortFrom15() - számokat rendez a 15-től való távolság alapján és a rendezett tömböt adja vissza
addAsterisk() - String tömb mindegy elemének az elejére és végére egy csillagot tesz és visszaadja a módosított tömböt
between5And15() - számokat tartalmazó tömb 5 és 15 közötti elemeit adja vissza egy tömbben
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