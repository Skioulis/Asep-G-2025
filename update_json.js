const fs = require('fs');

// Read the questions.json file
const questionsPath = './data/questions.json';
let questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Count questions with and without correctAnswer
let withCorrectAnswer = 0;
let withoutCorrectAnswer = 0;

// Add correctAnswer field to each question
// For demonstration, we'll set the first option as the correct answer for questions without one
// In a real scenario, you would need to determine the correct answer for each question
questions.forEach(question => {
    // If the question already has a correctAnswer field, skip it
    if (!question.correctAnswer && question.answers && question.answers.length > 0) {
        // Set the first option as the correct answer (this is just a placeholder)
        question.correctAnswer = question.answers[0].option;
        withoutCorrectAnswer++;
    } else if (question.correctAnswer) {
        withCorrectAnswer++;
    }
});

// Write the updated questions back to the file
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');

console.log(`Updated questions.json with correctAnswer fields`);
console.log(`Questions with correct answer already set: ${withCorrectAnswer}`);
console.log(`Questions that needed a default correct answer: ${withoutCorrectAnswer}`);
