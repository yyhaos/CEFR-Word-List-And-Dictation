const fs = require('fs').promises;
const gTTS = require('gtts');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const tempDir = path.join(__dirname, 'temp'); // 使用 __dirname 获取脚本所在目录的绝对路径

// 创建 temp 文件夹
const createTempDir = async () => {
  try {
    await fs.access(tempDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(tempDir);
    } else {
      throw error;
    }
  }
};
function removeChinese(text) {
  // Define a regular expression to match Chinese characters.
  const chineseRegex = /[\u4e00-\u9fa5]+/g;

  // Replace all occurrences of Chinese characters with empty strings.
  const englishText = text.replace(chineseRegex, "");

  return englishText;
}
const generateAudio = async (text, filename) => {
  const filePath = path.join(tempDir, filename);
  text = removeChinese(text);
  const gtts = new gTTS(text);
  result = await gtts.save(filePath);
  // sleep
  await new Promise(resolve => setTimeout(resolve, 100));
  return result
};

const combineAudio = async (files, outputFile) => {
  // 使用绝对路径
  let fileList = files
    .map(file => `file '${path.join(tempDir, file)}'`)
    .join('\n');
  await fs.writeFile(path.join(tempDir, 'fileList.txt'), fileList);
  const command = `ffmpeg -f concat -safe 0 -i ${path.join(
    tempDir,
    'fileList.txt'
  )} -c copy ${outputFile}`;
  console.log(command);
  await execAsync(command);
  await fs.unlink(path.join(tempDir, 'fileList.txt'));
};

(async () => {
  try {
    await createTempDir();
    file = "wrong-word"
    const data = await fs.readFile(`${file}.txt`, 'utf-8');
    const words = data.split('\n').filter(word => word.trim() !== '');
    const audioFiles = [];
    count = 1;
    for (const word of words) {
      console.log(`${count}/${words.length}`)
      count+=1;
      const safeWord = word.replace(/ /g, '_').replace(/\//g, '_').replace(/\?/g, '_').replace(/'/g, '_').replace(/|/g, '_')
      const filename = `temp_${safeWord}.mp3`;
      await generateAudio(word, filename);
      for (let i = 0; i < 4; i++) {
        audioFiles.push(filename);
      }
    }

    await combineAudio(audioFiles, `${file}.mp3`);
    console.log('音频生成完成');
  } catch (error) {
    console.error('发生错误：', error);
  }
})();