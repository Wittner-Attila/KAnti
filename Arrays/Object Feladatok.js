/*


Object létrehozása
----------------------------------------
const person = {
    name: "Alice",
    age: 19,
    city: "Szeged",
driverLicen
}----------------------------------------

Object érték elérése
vagy a változó neve pont és a kulcs
vagy a változó neve szögketes zárójelben a kulcs, mint sztring
----------------------------------------

console.log(person.name)
console.log(person["age"])
----------------------------------------

Új értékpár hozzáadása

a változónak új értékpárt adunk meg
----------------------------------------
person.country = "Hungary"
console.log(person.country)
----------------------------------------

Object módosítása

A kulcsra hivatkozva új értéket adunk meg.
----------------------------------------
person.city = "Budapest"
console.log(person.city)
----------------------------------------


Metódus megadása

Az objectben a létrehozásakor, vagy később is létrehozhatunk metódust.
A metódus nevét kell megadni és 
kettőspontot az object létehozásakor vagy  egynlőséget a későbbi létrehozáskor.
Mindkét esetben anonim függvényt adunk meg a function kulcsszóval.
----------------------------------------
person.greet = function() {
    console.log(`Hello, my name is ${this.name}`)
}
person.greet()
----------------------------------------
vagy
----------------------------------------
const person2 = {
    name: "Alice",
    age: 19,
    city: "Szeged",
    greet: function() {
        console.log(`Hello, my name is ${this.name}`)
    }
}
person2.greet()
----------------------------------------
vagy
----------------------------------------
const person3 = {
    name: "Alice",
    age: 19,
    city: "Szeged",
    greet() {
        console.log(`Hello, my name is ${this.name}`)
    }
}
person3.greet()
----------------------------------------


Object bejárása

for - in cilkus
----------------------------------------
for (let key in person2) {
    console.log(`${key}: ${person2[key]}`)
}
----------------------------------------


A kulcsok, értékek, kulcs-érték párok, mint tömbbök
----------------------------------------
const keys = Object.keys(person)
console.log(keys)
const values = Object.values(person)
console.log(values)
const entries = Object.entries(person)
console.log(entries)
----------------------------------------


Constructor használata

----------------------------------------
class Person {
    constructor(name, age, city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }
    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
}
const alice = new Person('Alice', 19, 'Szeged');
alice.greet();
----------------------------------------

1. feladat
Hozz létre egy programot, melyben a tanulók adatair tárolod.
A tanuló neve és e-mail címe legyen tárolva.
A felhasználótól bekéred, hogy hány adatot szeretne megadni és a bevitt adatokat egy tömbben rátolod.
A vevitelt követpen írasd ki az összes tanuló adatát!

Például:
Hány adatot szeretnél megadni? 2
Név: John Doe
E-mail: john.doe@example.com
Név: Jane Doyl
E-mail: jane.doyl@example.com
A tanulók adatai:
Név: John Doe E-mail: john.doe@example.com
Név: Jane Doyl E-mail: jane.doyl@example.com

2. feladat
Hozd létre az órarend programot, mely a heti órarend adatait tartalmazza.
Az adatokat tömbben és objectben tárold.
Írask ki a heti órarendet.
*/