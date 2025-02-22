import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchStudentDashboard } from "../../api/apiservice";
import "../../utils/css/QuizComponent.css";

const QuizComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const username = "student10"; // Change dynamically if needed

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const result = await fetchStudentDashboard(username);
      if (result.success) {
        setData(result.data);
      } else {
        console.error("Error:", result.error);
      }
      setLoading(false);
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    if (quizStarted) {
      setTimeLeft(selectedQuiz?.time * 60);
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = () => {
    alert("Quiz Submitted!");
    resetQuiz();
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  if (loading) return <p>Loading...</p>;
  if (!data || !data.quizzes?.length) return <p>No quizzes available.</p>;

  return (
    <div className="quiz-container">
      {!selectedQuiz ? (
        // Show available quizzes
        <div className="quiz-cards-container">
          {data.quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card" onClick={() => setSelectedQuiz(quiz)}>
              <div className="quiz-card-content">
                <img src="https://via.placeholder.com/150" alt={quiz.quiz_name} />
                <h3>{quiz.quiz_name}</h3>
                <p>Topic: {quiz.topic}</p>
                <p>{quiz.no_of_questions} Questions | {quiz.time} mins</p>
              </div>
            </div>
          ))}
        </div>
      ) : !quizStarted ? (
        // Show quiz details
        <div className="quiz-details">
          <h2>{selectedQuiz.quiz_name}</h2>
          <p><strong>Topic:</strong> {selectedQuiz.topic}</p>
          <p><strong>Number of Questions:</strong> {selectedQuiz.no_of_questions}</p>
          <p><strong>Time Limit:</strong> {selectedQuiz.time} minutes</p>
          <p><strong>Passing Score:</strong> {selectedQuiz.passing_score_percentage}%</p>
          <button onClick={() => setQuizStarted(true)} className="start-quiz-btn">Start Quiz</button>
          <button onClick={resetQuiz} className="back-btn">Back</button>
        </div>
      ) : (
        // Display quiz questions
        <div className="quiz-content">
          <div className="quiz-header">
            <h2>{selectedQuiz.quiz_name}</h2>
            <p>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
          </div>

          {selectedQuiz.questions.length > 0 ? (
            <div className="quiz-question">
              <h3>Q{currentQuestionIndex + 1}: {selectedQuiz.questions[currentQuestionIndex].question}</h3>
              <div className="quiz-options">
                {selectedQuiz.questions[currentQuestionIndex].answers.map((answer) => (
                  <button
                    key={answer.id}
                    className={selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === answer.id ? "selected" : ""}
                    onClick={() => handleAnswerSelect(selectedQuiz.questions[currentQuestionIndex].id, answer.id)}
                  >
                    {answer.answer}
                  </button>
                ))}
              </div>

              {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                <button onClick={handleNextQuestion} className="next-btn">Next</button>
              ) : (
                <button onClick={handleSubmitQuiz} className="submit-btn">Submit</button>
              )}
            </div>
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
