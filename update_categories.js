import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the categories and their ranges
const categoryRanges = [
    { count: 62, category: "Συνταγματικό Δίκαιο" },
    { count: 81, category: "Διοικητικό Δίκαιο" },
    { count: 55, category: "Ευρωπαϊκοί Θεσμοί και Δίκαιο" },
    { count: 68, category: "Οικονομικές Επιστήμες" },
    { count: 41, category: "Δημόσια Διοίκηση και Διαχείριση Ανθρώπινου Δυναμικού" },
    { count: 52, category: "Πληροφορική και Ψηφιακή Διακυβέρνηση" },
    { count: 41, category: "Σύγχρονη Ιστορία της Ελλάδος (1875-σήμερα)" }
];

// Calculate total expected questions
const totalExpectedQuestions = categoryRanges.reduce((sum, range) => sum + range.count, 0);

// Path to the questions.json file
const questionsFilePath = path.join(__dirname, 'data', 'questions.json');

// Create a backup of the original file
const backupFilePath = path.join(__dirname, 'data', `questions.json.backup.${Date.now()}`);

try {
    // Read the questions file
    const questionsData = fs.readFileSync(questionsFilePath, 'utf8');

    // Create a backup
    fs.writeFileSync(backupFilePath, questionsData);
    console.log(`Backup created at: ${backupFilePath}`);

    // Parse the JSON data
    const questions = JSON.parse(questionsData);

    // Check if the number of questions matches the expected total
    if (questions.length !== totalExpectedQuestions) {
        console.warn(`Warning: The number of questions (${questions.length}) does not match the expected total (${totalExpectedQuestions}).`);
    }

    // Update categories based on the defined ranges
    let questionIndex = 0;

    for (const range of categoryRanges) {
        for (let i = 0; i < range.count && questionIndex < questions.length; i++) {
            questions[questionIndex].category = range.category;
            questionIndex++;
        }
    }

    // Write the updated data back to the file
    fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2));

    console.log(`Successfully updated categories for ${questionIndex} questions.`);
    console.log('Categories distribution:');

    // Print the distribution of categories
    const categoryCount = {};
    questions.forEach(q => {
        categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    });

    for (const category in categoryCount) {
        console.log(`- ${category}: ${categoryCount[category]} questions`);
    }

} catch (error) {
    console.error('Error updating categories:', error);
}
