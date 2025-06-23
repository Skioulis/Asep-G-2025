// This file contains all the questions data from questions.json
// It's used to make the site static without requiring Node.js

// To update this file:
// 1. Run the Node.js server once to get the latest data
// 2. Copy the content of questions.json to this file
// 3. Wrap the JSON content with 'const allQuestionsData = ' and ';'

// The questions data is loaded from the JSON file and converted to a JavaScript variable
const allQuestionsData = 
// BEGIN JSON DATA
[
  {
    "id": "1",
    "question": "Η έννοια της απαγόρευσης των βασανιστηρίων (άρθρο 7 παρ. 2 Συντ.) περιλαμβάνει:",
    "answers": [
      {
        "option": "a",
        "text": "Την απαγόρευση των βασανιστηρίων, της οποιασδήποτε σωματικής κάκωσης, της βλάβης υγείας, της άσκησης ψυχολογικής βίας και κάθε άλλης προσβολής της ανθρώπινης αξιοπρέπειας"
      },
      {
        "option": "b",
        "text": "Την απαγόρευση μόνο των βασανιστηρίων"
      },
      {
        "option": "c",
        "text": "Την απαγόρευση μόνο της οποιασδήποτε σωματικής κάκωσης"
      },
      {
        "option": "d",
        "text": "Πρόκειται για κατευθυντήρια διάταξη μη έχουσα νομικό-δεσμευτικό περιεχόμενο"
      }
    ],
    "correctAnswer": "a",
    "category": "Συνταγματικό Δίκαιο"
  }
  // The rest of the questions should be copied from questions.json
  // This is just the first question as an example
]
// END JSON DATA
;
