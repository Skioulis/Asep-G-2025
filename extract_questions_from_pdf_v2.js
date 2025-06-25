import fs from 'fs';
import path from 'path';

// Path for the output JSON file
const outputPath = path.resolve('./data/questions_from_pdf.json');

// Function to generate template questions
function generateTemplateQuestions() {
  console.log('Generating template for 400 questions...');
  
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
  
  // Create an array with the sample question and 399 empty questions
  const questions = [sampleQuestion];
  
  // Generate 399 empty questions
  for (let i = 2; i <= 400; i++) {
    questions.push({
      id: i.toString(),
      question: `Question ${i}`,
      answers: [
        { option: "a", text: "Answer option A" },
        { option: "b", text: "Answer option B" },
        { option: "c", text: "Answer option C" },
        { option: "d", text: "Answer option D" }
      ],
      correctAnswer: "a", // Default, to be updated later
      category: "Category" // Default, to be updated later
    });
  }
  
  // Save the questions to a JSON file
  fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf8');
  
  console.log(`Template JSON file with 400 questions created at ${outputPath}`);
  console.log('Please manually update the questions from the PDF.');
  console.log('The first question is provided as an example of the required format.');
  console.log('Use set_correct_answers_from_pdf.js to set the correct answers after updating the questions.');
}

// Run the function to generate template questions
generateTemplateQuestions();