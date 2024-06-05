const fs = require('fs');
const readline = require('readline');

const levelA2File = 'level-A2-word1.txt';
const practiceFile = 'practice.txt';
const outputFile = 'out.txt';

async function readLines(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const lines = [];

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    lines.push(line.trim());
  }

  return lines;
}

async function compareFiles() {
  try {
    const levelA2Words = await readLines(levelA2File);
    const practiceWords = await readLines(practiceFile);
    const outputLines = [];

    levelA2Words.forEach((word, index) => {
      if (!practiceWords.includes(word)) {
        outputLines.push(`${word}`);
      }
    });

    fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');
    console.log(`比较结果已保存到 ${outputFile}`);
  } catch (error) {
    console.error('Error reading or comparing files:', error);
  }
}

compareFiles();
