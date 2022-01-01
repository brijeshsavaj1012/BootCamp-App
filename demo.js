let x = 10;
let y = 20;

z = x + y;
console.log(z);
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name? ", function (answer) {
  console.log(`Oh, so your name is ${answer}`);
  console.log("Closing the interface");
  rl.close();
});

for (let i = 0; i < 1; i++) {
  console.log(i);
}
