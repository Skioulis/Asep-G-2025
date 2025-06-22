import fs from 'fs';

// Path to the questions file
const questionsPath = './data/questions.json';
const backupPath = './data/questions.json.backup';

console.log(`Reading questions from ${questionsPath}...`);

// Read the questions.json file
let questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
console.log(`Loaded ${questions.length} questions.`);

// Create a backup of the original file
fs.writeFileSync(backupPath, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Created backup at ${backupPath}`);

// Counter for modified answers
let modifiedAnswers = 0;

// Process each question
questions.forEach(question => {
  if (question.answers && Array.isArray(question.answers)) {
    question.answers.forEach(answer => {
      if (answer.text) {
        const originalText = answer.text;

        // Trim trailing spaces
        const newText = originalText.replace(/\s+$/g, '');

        // Update if changed
        if (newText !== originalText) {
          answer.text = newText;
          modifiedAnswers++;
        }
      }
    });
  }
});

console.log(`Modified ${modifiedAnswers} answer texts by removing trailing spaces.`);

// Save the updated questions
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Updated questions saved to ${questionsPath}`);
