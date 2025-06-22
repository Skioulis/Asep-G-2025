const fs = require('fs');

// Read the questions.json file
const questionsPath = './data/questions.json';
let questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Loaded ${questions.length} questions from ${questionsPath}`);

// Function to convert Greek letters to English
function convertGreekToEnglish(letter) {
  switch (letter) {
    case 'α': return 'a';
    case 'β': return 'b';
    case 'γ': return 'c';
    case 'δ': return 'd';
    default: return letter; // Return as is if not a Greek letter
  }
}

// Count of conversions
let optionConversions = 0;
let correctAnswerConversions = 0;

// Convert all option values from Greek to English
questions.forEach(question => {
  // Convert correctAnswer if it exists and is a Greek letter
  if (question.correctAnswer && ['α', 'β', 'γ', 'δ'].includes(question.correctAnswer)) {
    question.correctAnswer = convertGreekToEnglish(question.correctAnswer);
    correctAnswerConversions++;
  }

  // Convert options in answers array
  if (question.answers && Array.isArray(question.answers)) {
    question.answers.forEach(answer => {
      if (answer.option && ['α', 'β', 'γ', 'δ'].includes(answer.option)) {
        answer.option = convertGreekToEnglish(answer.option);
        optionConversions++;
      }
    });
  }
});

// Write the updated questions back to the file
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');

console.log(`Conversion complete!`);
console.log(`Converted ${optionConversions} option values from Greek to English`);
console.log(`Converted ${correctAnswerConversions} correctAnswer values from Greek to English`);