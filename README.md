# ASEP Question Manager

A web application for managing ASEP questions with Bootstrap and Font Awesome.

## Features

- **25 Random Questions**: Display a set of 25 randomly selected questions from the database.
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

### 25 Random Questions
Click the "Show Random Questions" button to display 25 randomly selected questions from the database. This is useful for quick review or practice.

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
