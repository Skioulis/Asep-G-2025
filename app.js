document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const randomQuestionsBtn = document.getElementById('randomQuestionsBtn');
    const allQuestionsBtn = document.getElementById('allQuestionsBtn');
    const editQuestionsBtn = document.getElementById('editQuestionsBtn');
    const questionsContainer = document.getElementById('questionsContainer');
    const paginationContainer = document.getElementById('paginationContainer');
    const loadingElement = document.getElementById('loading');

    // State variables
    let allQuestions = [];
    let currentMode = null;
    let currentPage = 1;
    const questionsPerPage = 10;
    let editMode = false;

    // Variables for quiz mode (random questions)
    let randomQuestionSet = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizCompleted = false;

    // Fetch questions from API
    async function fetchQuestions() {
        showLoading(true);
        try {
            const response = await fetch('/api/questions');
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            allQuestions = await response.json();
            showLoading(false);
            return allQuestions;
        } catch (error) {
            showError('Error loading questions: ' + error.message);
            showLoading(false);
            return [];
        }
    }

    // Show/hide loading spinner
    function showLoading(show) {
        loadingElement.classList.toggle('d-none', !show);
    }

    // Display error message
    function showError(message) {
        questionsContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>${message}
            </div>
        `;
    }

    // Display 25 random questions one at a time
    async function showRandomQuestions() {
        currentMode = 'random';
        editMode = false;

        // Reset quiz state
        currentQuestionIndex = 0;
        userAnswers = {};
        quizCompleted = false;

        if (allQuestions.length === 0) {
            allQuestions = await fetchQuestions();
        }

        // Get 25 random questions
        randomQuestionSet = getRandomQuestions(allQuestions, 25);

        // Display the first question
        displayCurrentQuestion();

        // Clear standard pagination
        paginationContainer.innerHTML = '';
    }

    // Display the current question in quiz mode
    function displayCurrentQuestion() {
        if (quizCompleted) {
            displayQuizResults();
            return;
        }

        if (randomQuestionSet.length === 0) {
            showError('No questions available.');
            return;
        }

        const currentQuestion = randomQuestionSet[currentQuestionIndex];
        const questionId = currentQuestion.id;
        const totalQuestions = randomQuestionSet.length;
        const userAnswer = userAnswers[questionId];

        let html = `
            <div class="card question-card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>
                        <span class="badge bg-secondary me-2">#${questionId}</span>
                        ${currentQuestion.category ? `<span class="badge bg-info category-badge">${currentQuestion.category}</span>` : ''}
                        <span class="badge bg-primary ms-2">Question ${currentQuestionIndex + 1} of ${totalQuestions}</span>
                    </span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${currentQuestion.question}</h5>
                    <div class="list-group mt-3">
        `;

        currentQuestion.answers.forEach(answer => {
            const isSelected = userAnswer === answer.option;
            html += `
                <button type="button" class="list-group-item list-group-item-action ${isSelected ? 'active' : ''}" 
                        data-option="${answer.option}" onclick="window.selectAnswer('${answer.option}')">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${answer.option.toUpperCase()}.</h6>
                    </div>
                    <p class="mb-1">${answer.text}</p>
                </button>
            `;
        });

        html += `
                    </div>
                    <div class="d-flex justify-content-between mt-4">
                        <button class="btn btn-secondary ${currentQuestionIndex === 0 ? 'disabled' : ''}" 
                                onclick="window.previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                            <i class="fas fa-arrow-left me-2"></i>Previous
                        </button>
                        <button class="btn btn-primary" onclick="window.nextQuestion()">
                            ${currentQuestionIndex < totalQuestions - 1 ? 'Next <i class="fas fa-arrow-right ms-2"></i>' : 'Finish Quiz <i class="fas fa-check ms-2"></i>'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        questionsContainer.innerHTML = html;
    }

    // Display quiz results with score
    function displayQuizResults() {
        const totalQuestions = randomQuestionSet.length;
        let correctAnswers = 0;

        // Calculate score
        randomQuestionSet.forEach(question => {
            if (userAnswers[question.id] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

        let html = `
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0"><i class="fas fa-trophy me-2"></i>Quiz Results</h4>
                </div>
                <div class="card-body text-center">
                    <h2 class="display-4 mb-4">Your Score: ${correctAnswers} / ${totalQuestions}</h2>
                    <div class="progress mb-4" style="height: 30px;">
                        <div class="progress-bar ${getScoreColorClass(scorePercentage)}" 
                             role="progressbar" 
                             style="width: ${scorePercentage}%;" 
                             aria-valuenow="${scorePercentage}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            ${scorePercentage}%
                        </div>
                    </div>

                    <button class="btn btn-primary btn-lg mt-3" onclick="window.reviewQuiz()">
                        <i class="fas fa-search me-2"></i>Review Answers
                    </button>
                    <button class="btn btn-success btn-lg mt-3 ms-2" onclick="window.startNewQuiz()">
                        <i class="fas fa-redo me-2"></i>Start New Quiz
                    </button>
                </div>
            </div>
        `;

        questionsContainer.innerHTML = html;
    }

    // Get appropriate color class based on score percentage
    function getScoreColorClass(percentage) {
        if (percentage >= 80) return 'bg-success';
        if (percentage >= 60) return 'bg-info';
        if (percentage >= 40) return 'bg-warning';
        return 'bg-danger';
    }

    // Get n random questions from array (ensuring uniqueness)
    function getRandomQuestions(questions, n) {
        // Create a map to track questions by ID to ensure uniqueness
        const uniqueQuestions = new Map();

        // First, ensure we have a unique set of questions by ID
        questions.forEach(question => {
            if (!uniqueQuestions.has(question.id)) {
                uniqueQuestions.set(question.id, question);
            }
        });

        // Convert the unique questions back to an array
        const uniqueQuestionsArray = Array.from(uniqueQuestions.values());

        // Shuffle the array
        const shuffled = [...uniqueQuestionsArray].sort(() => 0.5 - Math.random());

        // Return the first n questions or all if there are fewer than n
        return shuffled.slice(0, Math.min(n, shuffled.length));
    }

    // Display all questions with pagination
    async function showAllQuestions() {
        currentMode = 'all';
        editMode = false;
        currentPage = 1;

        if (allQuestions.length === 0) {
            allQuestions = await fetchQuestions();
        }

        displayQuestionsPage(currentPage);
        setupPagination();
    }

    // Show edit interface for all questions
    async function showEditQuestions() {
        currentMode = 'edit';
        editMode = true;
        currentPage = 1;

        if (allQuestions.length === 0) {
            allQuestions = await fetchQuestions();
        }

        displayQuestionsPage(currentPage, true);
        setupPagination();
    }

    // Display questions for current page
    function displayQuestionsPage(page, isEditMode = false) {
        const startIndex = (page - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const questionsToShow = allQuestions.slice(startIndex, endIndex);

        displayQuestions(questionsToShow, isEditMode);
    }

    // Setup pagination controls
    function setupPagination() {
        const totalPages = Math.ceil(allQuestions.length / questionsPerPage);

        let paginationHTML = `
            <nav aria-label="Question navigation">
                <ul class="pagination">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
        `;

        // Show limited page numbers with ellipsis
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
            `;
            if (startPage > 2) {
                paginationHTML += `
                    <li class="page-item disabled">
                        <a class="page-link" href="#">...</a>
                    </li>
                `;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `
                    <li class="page-item disabled">
                        <a class="page-link" href="#">...</a>
                    </li>
                `;
            }
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }

        paginationHTML += `
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `;

        paginationContainer.innerHTML = paginationHTML;

        // Add event listeners to pagination links
        document.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.dataset.page);
                if (!isNaN(page) && page > 0 && page <= totalPages) {
                    currentPage = page;
                    displayQuestionsPage(currentPage, editMode);
                    setupPagination();
                }
            });
        });
    }

    // Display questions in container
    function displayQuestions(questions, isEditMode = false) {
        if (questions.length === 0) {
            questionsContainer.innerHTML = `
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>No questions found.
                </div>
            `;
            return;
        }

        let html = '';

        questions.forEach((question, index) => {
            const questionId = question.id;

            html += `
                <div class="card question-card mb-4" id="question-${questionId}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>
                            <span class="badge bg-secondary me-2">#${questionId}</span>
                            ${question.category ? `<span class="badge bg-info category-badge">${question.category}</span>` : ''}
                        </span>
                        ${isEditMode ? `
                            <button class="btn btn-sm btn-outline-primary edit-question-btn" data-id="${questionId}">
                                <i class="fas fa-edit me-1"></i>Edit
                            </button>
                        ` : ''}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${question.question}</h5>
                        <div class="question-display">
                            <div class="list-group mt-3">
            `;

            question.answers.forEach(answer => {
                const isCorrect = answer.option === question.correctAnswer;
                html += `
                    <div class="list-group-item ${isCorrect ? 'correct-answer' : ''}">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">
                                ${isCorrect ? '<i class="fas fa-check-circle text-success me-2"></i>' : ''}
                                ${answer.option.toUpperCase()}.
                            </h6>
                        </div>
                        <p class="mb-1">${answer.text}</p>
                    </div>
                `;
            });

            html += `
                            </div>
                        </div>
            `;

            // Add edit form if in edit mode
            if (isEditMode) {
                html += `
                    <div class="edit-form mt-3" id="edit-form-${questionId}">
                        <form id="question-form-${questionId}">
                            <div class="mb-3">
                                <label for="question-text-${questionId}" class="form-label">Question</label>
                                <textarea class="form-control" id="question-text-${questionId}" rows="2" required>${question.question}</textarea>
                            </div>
                            <div class="mb-3">
                                <label for="category-${questionId}" class="form-label">Category</label>
                                <input type="text" class="form-control" id="category-${questionId}" value="${question.category || ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Correct Answer</label>
                                <select class="form-select" id="correct-answer-${questionId}">
                                    ${question.answers.map(answer => `
                                        <option value="${answer.option}" ${answer.option === question.correctAnswer ? 'selected' : ''}>
                                            ${answer.option.toUpperCase()}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Answer Options</label>
                                ${question.answers.map(answer => `
                                    <div class="input-group mb-2">
                                        <span class="input-group-text">${answer.option.toUpperCase()}</span>
                                        <textarea class="form-control" id="answer-${questionId}-${answer.option}" rows="2" required>${answer.text}</textarea>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="d-flex justify-content-end">
                                <button type="button" class="btn btn-secondary me-2 cancel-edit-btn" data-id="${questionId}">
                                    <i class="fas fa-times me-1"></i>Cancel
                                </button>
                                <button type="submit" class="btn btn-primary save-question-btn" data-id="${questionId}">
                                    <i class="fas fa-save me-1"></i>Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            `;
        });

        questionsContainer.innerHTML = html;

        // Add event listeners for edit buttons
        if (isEditMode) {
            document.querySelectorAll('.edit-question-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const questionId = this.dataset.id;
                    const questionCard = document.getElementById(`question-${questionId}`);
                    const questionDisplay = questionCard.querySelector('.question-display');
                    const editForm = document.getElementById(`edit-form-${questionId}`);

                    questionDisplay.style.display = 'none';
                    editForm.style.display = 'block';
                });
            });

            document.querySelectorAll('.cancel-edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const questionId = this.dataset.id;
                    const questionCard = document.getElementById(`question-${questionId}`);
                    const questionDisplay = questionCard.querySelector('.question-display');
                    const editForm = document.getElementById(`edit-form-${questionId}`);

                    questionDisplay.style.display = 'block';
                    editForm.style.display = 'none';
                });
            });

            document.querySelectorAll('form[id^="question-form-"]').forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const questionId = this.id.split('-')[2];
                    saveQuestionChanges(questionId);
                });
            });
        }
    }

    // Save changes to a question
    function saveQuestionChanges(questionId) {
        const questionIndex = allQuestions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return;

        const question = allQuestions[questionIndex];

        // Update question text
        question.question = document.getElementById(`question-text-${questionId}`).value;

        // Update category
        question.category = document.getElementById(`category-${questionId}`).value;

        // Update correct answer
        question.correctAnswer = document.getElementById(`correct-answer-${questionId}`).value;

        // Update answer texts
        question.answers.forEach(answer => {
            answer.text = document.getElementById(`answer-${questionId}-${answer.option}`).value;
        });

        // Hide edit form and show updated question
        const questionCard = document.getElementById(`question-${questionId}`);
        const questionDisplay = questionCard.querySelector('.question-display');
        const editForm = document.getElementById(`edit-form-${questionId}`);

        questionDisplay.style.display = 'block';
        editForm.style.display = 'none';

        // Refresh the display to show updated content
        if (currentMode === 'random') {
            // If we're in random mode, update the randomQuestionSet and display current question
            randomQuestionSet = getRandomQuestions(allQuestions, 25);
            displayCurrentQuestion();
        } else {
            displayQuestionsPage(currentPage, editMode);
        }

        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
        successAlert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>Question #${questionId} updated successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        questionCard.appendChild(successAlert);

        // Remove success message after 3 seconds
        setTimeout(() => {
            if (successAlert.parentNode) {
                successAlert.parentNode.removeChild(successAlert);
            }
        }, 3000);

        // Save changes to localStorage
        saveChangesToLocalStorage();
    }

    // Save changes to localStorage and server
    async function saveChangesToLocalStorage() {
        // Save to localStorage
        localStorage.setItem('asepQuestions', JSON.stringify(allQuestions));

        // Save to server
        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(allQuestions)
            });

            if (!response.ok) {
                throw new Error('Failed to save questions to server');
            }

            const result = await response.json();
            console.log('Saved to server:', result);
        } catch (error) {
            console.error('Error saving to server:', error);
            // Show error message but don't interrupt the user
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-warning alert-dismissible fade show';
            errorAlert.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>Changes saved locally but failed to save to server: ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            document.querySelector('.container').prepend(errorAlert);

            // Remove error message after 5 seconds
            setTimeout(() => {
                if (errorAlert.parentNode) {
                    errorAlert.parentNode.removeChild(errorAlert);
                }
            }, 5000);
        }
    }

    // Handler functions for quiz navigation (exposed to window for button onclick)
    function selectAnswer(option) {
        const currentQuestion = randomQuestionSet[currentQuestionIndex];
        userAnswers[currentQuestion.id] = option;
        displayCurrentQuestion(); // Refresh to show selected answer
    }

    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayCurrentQuestion();
        }
    }

    function nextQuestion() {
        const totalQuestions = randomQuestionSet.length;

        // If we're on the last question, complete the quiz
        if (currentQuestionIndex === totalQuestions - 1) {
            quizCompleted = true;
            displayQuizResults();
            return;
        }

        // Otherwise, move to the next question
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            displayCurrentQuestion();
        }
    }

    function reviewQuiz() {
        // Set up review mode - show all questions with correct/incorrect answers
        let html = `
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0"><i class="fas fa-search me-2"></i>Quiz Review</h4>
                </div>
                <div class="card-body">
                    <p class="lead">Review your answers below. Correct answers are marked in green.</p>
                    <button class="btn btn-success mb-4" onclick="window.startNewQuiz()">
                        <i class="fas fa-redo me-2"></i>Start New Quiz
                    </button>
                </div>
            </div>
        `;

        randomQuestionSet.forEach((question, index) => {
            const questionId = question.id;
            const userAnswer = userAnswers[questionId] || null;
            const isCorrect = userAnswer === question.correctAnswer;

            html += `
                <div class="card question-card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>
                            <span class="badge bg-secondary me-2">#${questionId}</span>
                            ${question.category ? `<span class="badge bg-info category-badge">${question.category}</span>` : ''}
                            <span class="badge bg-primary ms-2">Question ${index + 1} of ${randomQuestionSet.length}</span>
                            ${userAnswer ? 
                                `<span class="badge ${isCorrect ? 'bg-success' : 'bg-danger'} ms-2">
                                    ${isCorrect ? 'Correct' : 'Incorrect'}
                                </span>` : 
                                '<span class="badge bg-warning ms-2">Not Answered</span>'}
                        </span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${question.question}</h5>
                        <div class="list-group mt-3">
            `;

            question.answers.forEach(answer => {
                const isUserSelection = userAnswer === answer.option;
                const isCorrectAnswer = answer.option === question.correctAnswer;

                let itemClass = 'list-group-item';
                if (isUserSelection && isCorrectAnswer) {
                    itemClass += ' list-group-item-success';
                } else if (isUserSelection && !isCorrectAnswer) {
                    itemClass += ' list-group-item-danger';
                } else if (isCorrectAnswer) {
                    itemClass += ' list-group-item-success';
                }

                html += `
                    <div class="${itemClass}">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">
                                ${answer.option.toUpperCase()}.
                                ${isUserSelection ? 
                                    `<i class="fas ${isCorrectAnswer ? 'fa-check text-success' : 'fa-times text-danger'} ms-2"></i>` : 
                                    ''}
                                ${(!isUserSelection && isCorrectAnswer) ? 
                                    '<i class="fas fa-check text-success ms-2"></i>' : 
                                    ''}
                            </h6>
                        </div>
                        <p class="mb-1">${answer.text}</p>
                    </div>
                `;
            });

            html += `
                        </div>
                    </div>
                </div>
            `;
        });

        questionsContainer.innerHTML = html;
    }

    function startNewQuiz() {
        showRandomQuestions();
    }

    // Expose handler functions to window object for button onclick
    window.selectAnswer = selectAnswer;
    window.previousQuestion = previousQuestion;
    window.nextQuestion = nextQuestion;
    window.reviewQuiz = reviewQuiz;
    window.startNewQuiz = startNewQuiz;

    // Event listeners for main buttons
    randomQuestionsBtn.addEventListener('click', showRandomQuestions);
    allQuestionsBtn.addEventListener('click', showAllQuestions);
    editQuestionsBtn.addEventListener('click', showEditQuestions);

    // Initialize the app
    async function init() {
        // Check if we have saved questions in localStorage
        const savedQuestions = localStorage.getItem('asepQuestions');
        if (savedQuestions) {
            try {
                allQuestions = JSON.parse(savedQuestions);
                console.log('Loaded questions from localStorage');
            } catch (error) {
                console.error('Error parsing saved questions:', error);
                allQuestions = await fetchQuestions();
            }
        } else {
            allQuestions = await fetchQuestions();
        }

        // Show random questions by default
        showRandomQuestions();
    }

    // Start the app
    init();
});
