const fs = require('fs');

// Read the questions.json file
const questionsPath = './data/questions.json';
let questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Loaded ${questions.length} questions from ${questionsPath}`);

// Count questions that need category added
let categoriesAdded = 0;

// Add category field to each question
questions.forEach(question => {
    // If the question doesn't already have a category field, add it
    if (!question.hasOwnProperty('category')) {
        question.category = ''; // Empty string as placeholder for manual entry
        categoriesAdded++;
    }
});

// Write the updated questions back to the file
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');

console.log(`Added category field to ${categoriesAdded} questions`);
console.log(`Updated questions.json with category fields`);
console.log(`You can now manually set the category for each question.`);