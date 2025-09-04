/*
Hozz létre egy js fájlt, mely megoldaj a az alábbi feladatokat.
Mindegyik feladatot függvénnyel old meg!

1. getOtosLotteryNumbers - Ötöslottó számokat generál le véletlenszerűen, melyeket egy tömbben ad vissza.
2. getSortedtLotteryNumbers - paraméterrként kapott tömböt növekvő sorrendbe rendezi, a rendezett tömböt visszaadja
3. getNumberOfHits - két paramétert kap, egy tömböt lottószámokkal és egy tömböt a tippekkel. Visszaadja, hogy a tippekből ány egyezett meg a lottószámokkal
4. getMonthlyLotteryArrayNumbers - négy hét lottószámait adja vissza egy tömbben, mely a heti lottószámok tömbjét tartalmazza (meghívja a getOtosLotteryNumbers függvényt)
5. getMonthlyLotteryArrayNumbers - paraméterként kapja a négy hét lottószámainak tömbjét és visszaadja, hogy a hónapban mely számokat húzták ki. A viszatérő listában, minden szám csak egyszer szerepelhet.
6. monthlyStatistics - paranéterként kapha a havi lottószámok tömbjét. Egy tömböt ad vissza, melynek elemei tömbök, melyben az első elem a lottószám, a második eleme, hogy a hónapban a számot hányszor húzták ki.
*/

const getOtosLotteryNumbers = () => {
  const lotteryNumbers = [];
  while (lotteryNumbers.length < 5) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    if (!lotteryNumbers.includes(randomNumber)) {
      lotteryNumbers.push(randomNumber);
    }
  }
  return lotteryNumbers;
};

let lotteryNumbers = getOtosLotteryNumbers();

console.log(lotteryNumbers);

const getSortedLotteryNumbers = (numbers) => {
  return numbers.slice().sort((a, b) => a - b);
};

console.log(getSortedLotteryNumbers(lotteryNumbers));

const getNumberOfHits = (lotteryNumbers, userTips) => {
  let hits = 0;
  userTips.forEach((userTip) => {
    if (lotteryNumbers.includes(userTip)) {
      hits++;
    }
  });
  return hits;
};

console.log("\n3. Feladat:");
console.log(getNumberOfHits(lotteryNumbers, [5, 12, 23, 34, 45]));

const getMonthlyLotteryArrayNumbers = () => {
  const monthlyStatistics = [];
  for (let i = 0; i < 4; i++) {
    monthlyStatistics.push(getOtosLotteryNumbers());
  }
  return monthlyStatistics;
};

let monthlyNumbers = getMonthlyLotteryArrayNumbers();

console.log("\n4. Feladat:");
console.log(monthlyNumbers);

const getMonthlyLotteryArrayNumbersUnique = (monthlyNumbers) => [
  ...new Set(monthlyNumbers),
];

console.log("\n5. Feladat:");
console.log(getMonthlyLotteryArrayNumbersUnique(monthlyNumbers));

const monthlyStatistics = (monthlyNumbers) => {
  let stats = [];
  monthlyNumbers.forEach((week) => {
    week.forEach((number) => {
      let stat = stats.find((stat) => stat[0] === number);
      if (stat) {
        stat[1]++;
      } else {
        stats.push([number, 1]);
      }
    });
  });
  return stats;
};

console.log("\n6. Feladat:");
console.log(monthlyStatistics(monthlyNumbers));
