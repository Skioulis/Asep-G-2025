# ASEP Question Manager

A web application for managing ASEP questions with Bootstrap and Font Awesome.

## Features

- **35 Random Questions**: Display a set of 35 randomly selected questions from the database.
- **All Questions**: View the complete list of all questions in the database with pagination.
- **Edit Questions**: Edit all questions to fix errors or update content.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Asep
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. To stop the server:
   - Press `Ctrl+C` in the terminal where the server is running
   - Or navigate to `http://localhost:3000/stop` in your browser

## Usage

### 35 Random Questions
Click the "Show Random Questions" button to display 35 randomly selected questions from the database. This is useful for quick review or practice.

### All Questions
Click the "Show All Questions" button to view all questions in the database. The questions are paginated for easier navigation.

### Edit Questions
Click the "Edit Questions" button to enter edit mode. You will need to enter the correct password to access the edit functionality. In edit mode, each question has an "Edit" button that allows you to modify:
- The question text
- The category
- The correct answer
- The text of each answer option

Changes are automatically saved to both localStorage (for quick access) and the server (for permanent storage).

#### Changing the Password
The default password is "123456". You can change this password by modifying the `userPassword` variable in the `app.js` file.

## Data Structure

Each question has the following structure:
```json
{
  "id": "1",
  "question": "Question text goes here?",
  "answers": [
    {
      "option": "a",
      "text": "Answer option A"
    },
    {
      "option": "b",
      "text": "Answer option B"
    },
    {
      "option": "c",
      "text": "Answer option C"
    },
    {
      "option": "d",
      "text": "Answer option D"
    }
  ],
  "correctAnswer": "a",
  "category": "Category Name"
}
```

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5, Font Awesome 6
- **Backend**: Node.js, Express
- **Data Storage**: JSON file, localStorage

## Extracting Questions from PDF

To extract questions from a PDF file and add them to the database:

### Method 1: Single Template Question

1. Run the extraction script to create a template JSON file with a single sample question:
   ```
   node extract_questions_from_pdf.js
   ```

2. This will create a file at `data/questions_from_pdf.json` with a sample question in the required format.

3. Manually extract questions from the PDF file and add them to the template JSON file, following the format of the sample question.

### Method 2: Template with 400 Questions

1. Run the extraction script to create a template JSON file with 400 questions:
   ```
   node extract_questions_from_pdf_v2.js
   ```

2. This will create a file at `data/questions_from_pdf.json` with 400 questions:
   - The first question is a complete example with the correct format
   - The remaining 399 questions have placeholder text that you need to replace with the actual questions from the PDF

3. Each question should follow this format:
   ```json
   {
     "id": "1",
     "question": "Question text goes here?",
     "answers": [
       {
         "option": "a",
         "text": "Answer option A"
       },
       {
         "option": "b",
         "text": "Answer option B"
       },
       {
         "option": "c",
         "text": "Answer option C"
       },
       {
         "option": "d",
         "text": "Answer option D"
       }
     ],
     "correctAnswer": "a",
     "category": "Category Name"
   }
   ```

### Method 3: Extracting Text with Color Information

1. Run the extraction script to extract text with color information from the PDF:
   ```
   node extract_questions_with_color.js
   ```

2. This will create a file at `data/questions_with_color.json` with questions that include color information for each answer option:
   ```json
   {
     "id": "1",
     "question": "Question text goes here?",
     "answers": [
       {
         "option": "a",
         "text": "Answer option A",
         "color": "red"  // This indicates it's the correct answer
       },
       {
         "option": "b",
         "text": "Answer option B",
         "color": "black"
       },
       {
         "option": "c",
         "text": "Answer option C",
         "color": "black"
       },
       {
         "option": "d",
         "text": "Answer option D",
         "color": "black"
       }
     ],
     "correctAnswer": "a",
     "category": "Category Name"
   }
   ```

3. The script automatically identifies the correct answers based on text color (red text indicates the correct answer).

4. Note: The current implementation is a placeholder that demonstrates the concept. For a complete implementation, you would need to:
   - Install a more advanced PDF library that supports extracting text with style information
   - Update the script to use that library to extract all questions with color information
   - Process the extracted data to automatically identify correct answers based on text color

### Setting Correct Answers

If you used Method 1 or Method 2, you can use the `set_correct_answers_from_pdf.js` script to set the correct answers:
```
node set_correct_answers_from_pdf.js
```

This script will prompt you to enter the correct answer for each question, which should be the option that appears in red text in the PDF.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
