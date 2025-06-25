# Implementation Plan for Extracting Text with Color Information from PDFs

This document outlines a detailed plan for implementing a complete solution to extract text with color information from PDF files, specifically for the ASEP Question Manager project.

## Current Limitations

The current implementation (`extract_questions_with_color.js`) is a placeholder that demonstrates the concept of extracting text with color information from PDFs. It doesn't actually extract data from the PDF but shows the expected output format.

## Requirements

To implement a complete solution, we need to:

1. Extract text content from the PDF
2. Extract color information for each text element
3. Identify questions, answers, and correct answers based on text and color
4. Format the data into the required JSON structure

## Proposed Solution

### 1. Install a More Advanced PDF Library

The current `pdf-parse` library doesn't support extracting text with style information. We need a more advanced library like:

- **pdf.js** or **pdfjs-dist**: Mozilla's PDF.js library can extract text with style information
- **pdf-lib**: A library for creating and modifying PDF documents
- **hummus**: A high-performance PDF library

Installation:
```bash
npm install pdfjs-dist
```

### 2. Extract Text with Color Information

```javascript
import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
const pdfjsWorker = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.js');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Path for the input PDF file and output JSON file
const pdfPath = path.resolve('./data/questions.pdf');
const outputPath = path.resolve('./data/questions_with_color.json');

async function extractTextWithColor() {
  // Load the PDF document
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;
  
  const questionsWithColor = [];
  
  // Process each page
  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    
    // Extract text content with style information
    const textContent = await page.getTextContent({ normalizeWhitespace: true });
    
    // Process text items to identify questions and answers
    // This part will depend on the specific structure of your PDF
    // You'll need to analyze the text items and their styles to identify:
    // - Question text
    // - Answer options (a, b, c, d)
    // - Answer text
    // - Text color (to identify correct answers)
    
    // Example processing logic (simplified):
    let currentQuestion = null;
    let currentAnswers = [];
    
    for (const item of textContent.items) {
      const text = item.str;
      const color = item.color || 'black'; // Default to black if color not specified
      
      // Check if this is a new question
      if (text.match(/^\d+\.\s/)) {
        // If we have a complete question, add it to the results
        if (currentQuestion) {
          questionsWithColor.push({
            id: currentQuestion.id,
            question: currentQuestion.text,
            answers: currentAnswers,
            correctAnswer: currentAnswers.find(a => a.color === 'red')?.option || 'a',
            category: 'Category' // You might need to determine this from the PDF structure
          });
        }
        
        // Start a new question
        currentQuestion = {
          id: questionsWithColor.length + 1,
          text: text.replace(/^\d+\.\s/, '')
        };
        currentAnswers = [];
      }
      // Check if this is an answer option
      else if (text.match(/^[a-d]\)\s/)) {
        const option = text.charAt(0);
        const answerText = text.replace(/^[a-d]\)\s/, '');
        
        currentAnswers.push({
          option,
          text: answerText,
          color
        });
      }
      // Otherwise, it's part of the current question or answer
      else if (currentQuestion) {
        currentQuestion.text += ' ' + text;
      }
    }
    
    // Add the last question
    if (currentQuestion) {
      questionsWithColor.push({
        id: currentQuestion.id,
        question: currentQuestion.text,
        answers: currentAnswers,
        correctAnswer: currentAnswers.find(a => a.color === 'red')?.option || 'a',
        category: 'Category'
      });
    }
  }
  
  return questionsWithColor;
}

// Main function
async function main() {
  console.log(`Extracting text and color information from ${pdfPath}...`);
  
  try {
    const questionsWithColor = await extractTextWithColor();
    
    // Save the questions with color information to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(questionsWithColor, null, 2), 'utf8');
    
    console.log(`JSON file with text and color information created at ${outputPath}`);
    console.log(`Extracted ${questionsWithColor.length} questions with color information.`);
  } catch (error) {
    console.error('Error extracting text with color information:', error);
  }
}

main();
```

### 3. Challenges and Considerations

1. **PDF Structure**: The success of this approach depends on the structure of the PDF. If the PDF is well-structured with consistent formatting, it will be easier to extract the data.

2. **Color Detection**: PDF.js might not always provide accurate color information. You might need to use additional techniques to detect text color, such as:
   - Analyzing the PDF's content stream
   - Using OCR (Optical Character Recognition) with color detection
   - Using a PDF viewer that can extract text with style information

3. **Text Ordering**: PDFs don't always store text in reading order. You might need to sort text items based on their positions on the page.

4. **Performance**: Processing large PDFs can be memory-intensive. Consider processing the PDF page by page and implementing memory management techniques.

### 4. Testing and Validation

1. Test the extraction with a sample of the PDF to verify that:
   - Questions are correctly identified
   - Answer options are correctly identified
   - Text color is correctly detected
   - Correct answers are correctly identified based on color

2. Compare the extracted data with the original PDF to ensure accuracy.

3. Implement error handling and logging to identify and fix issues.

## Next Steps

1. Install the selected PDF library
2. Implement the extraction logic based on the specific structure of your PDF
3. Test and validate the extraction
4. Refine the implementation based on testing results
5. Update the documentation with the final solution