# ASEP Questions Parser

This project extracts questions and answers from a PDF file and saves them to JSON and CSV formats.

## Features

- Extracts questions and multiple-choice answers from PDF files
- Saves the extracted data to JSON and CSV formats
- Supports adding correct answers to the questions
- Supports categorizing questions for better organization

## How to Use

### Extracting Questions from PDF

To extract questions and answers from the PDF file:

```bash
node index.js
```

This will:
1. Read the PDF file from `./data/asep_questions.pdf`
2. Extract questions and answers
3. Save them to `./data/questions.json` and `./data/questions.csv`

### Adding Correct Answers

Since the PDF marks correct answers in red text, but the PDF parser cannot detect colors, you need to manually add the correct answers:

#### Option 1: Using the Interactive Script

Run the interactive script to set correct answers for each question:

```bash
node set_correct_answers.js
```

This script will:
1. Display each question and its answer options
2. Prompt you to enter the correct answer option (a, b, c, or d)
3. Save your progress periodically and when you exit

You can press Ctrl+C at any time to save your progress and exit.

#### Option 2: Bulk Update

If you already know the correct answers, you can update the JSON file directly:

```bash
node update_json.js
```

This script adds a `correctAnswer` field to each question in the JSON file. By default, it sets the first option as the correct answer, but you can modify the script to set the correct answers based on your knowledge.

### Adding Categories

To add a category field to each question:

```bash
node add_category.js
```

This script will:
1. Add an empty `category` field to each question in the JSON file
2. Save the updated questions back to the file

You can then manually edit the JSON file to set the appropriate category for each question. This allows you to organize questions by topic, difficulty, or any other classification system you prefer.

## JSON Structure

The questions are stored in the following format:

```json
[
  {
    "id": "1",
    "question": "Question text",
    "correctAnswer": "a",
    "category": "Constitutional Law",
    "answers": [
      {
        "option": "a",
        "text": "Answer text"
      },
      {
        "option": "b",
        "text": "Answer text"
      },
      ...
    ]
  },
  ...
]
```

## Requirements

- Node.js
- pdf-parse library
