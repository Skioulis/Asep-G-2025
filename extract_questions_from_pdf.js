import fs from 'fs';
import path from 'path';

// Path for the output JSON file
const outputPath = path.resolve('./data/questions_from_pdf.json');

// Create a sample question in the required format
const sampleQuestion = {
  id: "1",
  question: "Η έννοια της απαγόρευσης των βασανιστηρίων (άρθρο 7 παρ. 2 Συντ.) περιλαμβάνει:",
  answers: [
    {
      option: "a",
      text: "Την απαγόρευση των βασανιστηρίων, της οποιασδήποτε σωματικής κάκωσης, της βλάβης υγείας, της άσκησης ψυχολογικής βίας και κάθε άλλης προσβολής της ανθρώπινης αξιοπρέπειας"
    },
    {
      option: "b",
      text: "Την απαγόρευση μόνο των βασανιστηρίων"
    },
    {
      option: "c",
      text: "Την απαγόρευση μόνο της οποιασδήποτε σωματικής κάκωσης"
    },
    {
      option: "d",
      text: "Πρόκειται για κατευθυντήρια διάταξη μη έχουσα νομικό-δεσμευτικό περιεχόμενο"
    }
  ],
  correctAnswer: "a",
  category: "Συνταγματικό Δίκαιο"
};

// Instructions for manual extraction
console.log('Due to issues with the PDF parsing library, we are creating a template JSON file.');
console.log('Please manually extract questions from the PDF and add them to the JSON file.');
console.log('The JSON file will contain a sample question in the required format.');

// Create an array with the sample question
const questions = [sampleQuestion];

// Save the questions to a JSON file
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf8');

console.log(`Template JSON file created at ${outputPath}`);
console.log('Please manually extract questions from the PDF and add them to this file.');
console.log('Each question should follow the format of the sample question provided.');
