import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// API endpoint to get all questions
app.get('/api/questions', (req, res) => {
    try {
        const questionsPath = path.join(__dirname, 'data', 'questions.json');
        const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
        res.json(questions);
    } catch (error) {
        console.error('Error reading questions:', error);
        res.status(500).json({ error: 'Failed to load questions' });
    }
});

// API endpoint to save changes to questions
app.post('/api/questions', (req, res) => {
    try {
        const questionsPath = path.join(__dirname, 'data', 'questions.json');

        // Create a backup before saving
        const backupPath = path.join(__dirname, 'data', `questions_backup_${Date.now()}.json`);
        fs.copyFileSync(questionsPath, backupPath);

        // Save the updated questions
        fs.writeFileSync(questionsPath, JSON.stringify(req.body, null, 2), 'utf8');

        res.json({ success: true, message: 'Questions saved successfully' });
    } catch (error) {
        console.error('Error saving questions:', error);
        res.status(500).json({ error: 'Failed to save questions' });
    }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
    console.log('Or visit http://localhost:' + PORT + '/stop to stop the server');
});

// API endpoint to stop the server
app.get('/stop', (req, res) => {
    res.send('Server is shutting down...');
    console.log('Server shutdown requested via /stop endpoint');
    setTimeout(() => {
        server.close(() => {
            console.log('Server has been stopped');
            process.exit(0);
        });
    }, 1000); // Give the response time to be sent
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
