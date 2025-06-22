const fs = require('fs');
const pdfParse = require('pdf-parse');

// Path to the PDF file
const pdfPath = './data/asep_questions.pdf';

// Read the PDF file
const dataBuffer = fs.readFileSync(pdfPath);

// Function to extract questions and answers from text
function extractQuestions(text) {
    const questions = [];

    // Regular expression to match question patterns
    // Looking for patterns like: "41. Question text? a. Answer1 b. Answer2 c. Answer3 d. Answer4"
    const questionRegex = /(\d+)\.\s+(.*?)(?=\n[αβγδ]\.\s+|\n\d+\.|\n$)/gs;
    const answerRegex = /([αβγδ])\.\s+(.*?)(?=\n[αβγδ]\.\s+|\n\d+\.|\n$)/gs;

    let questionMatch;
    while ((questionMatch = questionRegex.exec(text)) !== null) {
        const questionNumber = questionMatch[1];
        const questionText = questionMatch[2].trim();

        // Skip if the question text is empty or too short (likely a false match)
        if (questionText.length < 5) continue;

        // Extract the portion of text that might contain answers for this question
        const nextQuestionIndex = text.indexOf(`${parseInt(questionNumber) + 1}.`, questionMatch.index);
        const questionEndIndex = nextQuestionIndex !== -1 ? nextQuestionIndex : text.length;
        const questionSection = text.substring(questionMatch.index, questionEndIndex);

        // Extract answers for this question
        const answers = [];
        let answerMatch;
        answerRegex.lastIndex = 0; // Reset regex index
        let correctAnswer = null;

        while ((answerMatch = answerRegex.exec(questionSection)) !== null) {
            const greekOption = answerMatch[1]; // α, β, γ, or δ
            const answerText = answerMatch[2].trim();

            // Convert Greek option to English
            let englishOption = greekOption;
            if (greekOption === 'α') englishOption = 'a';
            if (greekOption === 'β') englishOption = 'b';
            if (greekOption === 'γ') englishOption = 'c';
            if (greekOption === 'δ') englishOption = 'd';

            // In the PDF, the correct answer is in red letters
            // Since we can't directly detect colors from the text extraction,
            // we'll need to manually set the correct answers later

            answers.push({
                option: englishOption,
                text: answerText
            });
        }

        // Only add if we found both question and answers
        if (answers.length > 0) {
            questions.push({
                id: questionNumber,
                question: questionText,
                correctAnswer: null, // This will be set manually later
                answers: answers
            });
        }
    }

    return questions;
}

// Parse the PDF content
pdfParse(dataBuffer).then(data => {
    // Extract questions from the PDF text
    const questions = extractQuestions(data.text);

    // Save questions to JSON file
    fs.writeFileSync('./data/questions.json', JSON.stringify(questions, null, 2), 'utf8');
    console.log(`Extracted ${questions.length} questions and saved to questions.json`);

    // Save questions to CSV file
    const csvHeader = 'ID,Question,OptionA,OptionB,OptionC,OptionD\n';
    const csvRows = questions.map(q => {
        const options = {};
        q.answers.forEach(a => {
            options[a.option] = a.text.replace(/,/g, ' ');
        });

        return `${q.id},"${q.question.replace(/"/g, '""')}","${options['a'] || ''}","${options['b'] || ''}","${options['c'] || ''}","${options['d'] || ''}"`;
    });

    fs.writeFileSync('./data/questions.csv', csvHeader + csvRows.join('\n'), 'utf8');
    console.log(`Extracted ${questions.length} questions and saved to questions.csv`);

}).catch(error => {
    console.error('Error reading PDF:', error);
});
