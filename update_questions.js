const fs = require('fs');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read the questions.json file
const questionsPath = './data/questions.json';
let questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Get starting index from command line arguments
const startIndex = process.argv[2] ? parseInt(process.argv[2]) : 0;
const validStartIndex = isNaN(startIndex) || startIndex < 0 || startIndex >= questions.length ? 0 : startIndex;

console.log(`Loaded ${questions.length} questions from ${questionsPath}`);
console.log(`Starting from question index ${validStartIndex}`);
console.log('\nInstructions:');
console.log('For each question, you will be prompted to enter:');
console.log('1. The category of the question');
console.log('2. The option letter (a, b, c, or d) of the correct answer');
console.log('\nYou can:');
console.log('- Press Enter to keep the current value');
console.log('- Type "skip" or "s" to skip to the next question');
console.log('- Press Ctrl+C to exit at any time (your progress will be saved)');
console.log('- Restart the script with a specific index: node update_questions.js [index]');
console.log('\nProgress is automatically saved after every 10 questions.');

// Function to prompt for category and correct answer
function promptForQuestionInfo(index) {
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

  // Display current category and correct answer if set
  const currentCategory = question.category ? 
    `Current category: ${question.category}` : 
    'No category set';
  const currentCorrect = question.correctAnswer ? 
    `Current correct answer: ${question.correctAnswer}` : 
    'No correct answer set';

  console.log(currentCategory);
  console.log(currentCorrect);

  // Prompt for category
  rl.question('Enter category (press Enter to keep current, "skip" or "s" to skip question): ', (category) => {
    // Check if user wants to skip this question
    if (category.trim().toLowerCase() === 'skip' || category.trim().toLowerCase() === 's') {
      console.log('Skipping to next question...');
      promptForQuestionInfo(index + 1);
      return;
    }

    // Update category if provided
    if (category.trim() !== '') {
      question.category = category.trim();
      console.log(`Set category to "${category.trim()}"`);
    }

    // Prompt for correct answer
    rl.question('Enter correct answer option (a, b, c, or d, press Enter to keep current, "skip" or "s" to skip): ', (answer) => {
      // Check if user wants to skip this question
      if (answer.trim().toLowerCase() === 'skip' || answer.trim().toLowerCase() === 's') {
        console.log('Skipping to next question...');
        promptForQuestionInfo(index + 1);
        return;
      }

      // Update correct answer if provided
      if (answer.trim() !== '') {
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
        } else {
          console.log('Invalid input. Correct answer not updated.');
        }
      }

      // Save progress periodically
      if (index % 10 === 0) {
        fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');
        console.log('Progress saved.');
      }

      // Move to next question
      promptForQuestionInfo(index + 1);
    });
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
promptForQuestionInfo(validStartIndex);
