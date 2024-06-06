const fs = require('fs');
const readline = require('readline');

const levelA2File = 'wrong-word.txt';
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

function removeChinese(text) {
  // Define a regular expression to match Chinese characters.
  const chineseRegex = /[\u4e00-\u9fa5]+/g;

  // Replace all occurrences of Chinese characters with empty strings.
  const englishText = text.replace(chineseRegex, "");

  return englishText.replace(/[,;．。，；]/g, '');;
}
async function compareFiles() {
  try {
    const levelA2Words = await readLines(levelA2File);
    const practiceWords = await readLines(practiceFile);
    const outputLines = [];

    levelA2Words.forEach((sentence, index) => {
      var noChineseSentence = removeChinese(sentence)
      const words = noChineseSentence.split(' '); // 将句子拆分成单词
      isWrong = false;
      words.forEach((word) => {
        if (!practiceWords.includes(word)) {
          isWrong = true;
        }
      });
      if(isWrong) {
        outputLines.push(`${sentence}`);
      }
    });

    fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');
    console.log(`比较结果已保存到 ${outputFile}`);
  } catch (error) {
    console.error('Error reading or comparing files:', error);
  }
}

compareFiles();
