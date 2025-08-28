
const fs = require("fs");
const path = require("path");

function parseBigInt(str, base) {

  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = 0n;
  const baseBigInt = BigInt(base);

  for (const char of str) {
    const digitValue = BigInt(digits.indexOf(char.toLowerCase()));


    if (digitValue < 0 || digitValue >= baseBigInt) {
      throw new Error(`Invalid character '${char}' for base ${base}`);
    }
    result = result * baseBigInt + digitValue;
  }
  return result;
}


function solve(filename) {
  try {
    console.log(`\nProcessing ${path.basename(filename)}...`);

    
    const rawData = fs.readFileSync(filename);
    const data = JSON.parse(rawData);

    const k = data.keys.k;
    const points = [];
    for (let i = 1; i <= k; i++) {
      const x = BigInt(i);
      const yData = data[i.toString()];

      if (!yData) {
        throw new Error(`Data for point x=${i} is missing from the JSON file.`);
      }

      const base = parseInt(yData.base, 10);
      const y = parseBigInt(yData.value, base);
      points.push({ x, y });
    }

    console.log(`Successfully parsed ${k} points.`);


    let secret = 0n;


    for (let j = 0; j < k; j++) {
      const yj = points[j].y;
      let numerator = 1n;
      let denominator = 1n;

      
      for (let i = 0; i < k; i++) {
        if (i === j) continue; 

        numerator *= points[i].x;
        denominator *= points[i].x - points[j].x;
      }

      const term = (yj * numerator) / denominator;
      secret += term;
    }

    console.log(`The calculated secret is: ${secret}`);
    return secret;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
}


console.log("--- Catalog Placements Assignment Solution ---");
solve("testcase1.json");
solve("testcase2.json");
