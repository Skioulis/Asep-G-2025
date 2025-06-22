import fs from 'fs';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read the questions.json file
const questionsPath = './data/questions.json';
let questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Loaded ${questions.length} questions from ${questionsPath}`);
console.log('For each question, enter the option letter (a, b, c, or d) of the correct answer.');
console.log('This should be the option that appears in red text in the PDF.');
console.log('Press Ctrl+C to exit at any time. Your progress will be saved.');

// Function to prompt for correct answer
function promptForCorrectAnswer(index) {
  if (index >= questions.length) {
    // All questions processed, save and exit
    fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');
    console.log(`\nAll ${questions.length} questions processed. Updated file saved to ${questionsPath}`);
    rl.close();
    return;
  }

  const question = questions[index];
  console.log(`\nQuestion ${index + 1} of ${questions.length} (ID: ${question.id}):`);
  console.log(question.question);

  // Display answer options
  question.answers.forEach(answer => {
    console.log(`${answer.option}. ${answer.text}`);
  });

  // Display current correct answer if set
  const currentCorrect = question.correctAnswer ? 
    `Current correct answer: ${question.correctAnswer}` : 
    'No correct answer set';
  console.log(currentCorrect);

  // Prompt for correct answer
  rl.question('Enter correct answer option (a, b, c, or d): ', (answer) => {
    // Validate input
    if (['α', 'β', 'γ', 'δ', 'a', 'b', 'c', 'd'].includes(answer.toLowerCase())) {
      // Convert Greek letters to English if needed
      let correctAnswer = answer.toLowerCase();
      if (correctAnswer === 'α') correctAnswer = 'a';
      if (correctAnswer === 'β') correctAnswer = 'b';
      if (correctAnswer === 'γ') correctAnswer = 'c';
      if (correctAnswer === 'δ') correctAnswer = 'd';

      // Update question
      question.correctAnswer = correctAnswer;
      console.log(`Set correct answer to ${correctAnswer}`);

      // Save progress periodically
      if (index % 10 === 0) {
        fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');
        console.log('Progress saved.');
      }

      // Move to next question
      promptForCorrectAnswer(index + 1);
    } else {
      console.log('Invalid input. Please enter a, b, c, or d.');
      promptForCorrectAnswer(index); // Retry same question
    }
  });
}

// Handle Ctrl+C to save progress and exit
process.on('SIGINT', () => {
  console.log('\nSaving progress before exit...');
  fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');
  console.log('Progress saved. Exiting.');
  process.exit(0);
});

// Start the process
promptForCorrectAnswer(0);
