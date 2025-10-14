import React from 'react';

const QuizDetailsModal = ({ quizResult, onClose }) => {
  const percentage = ((quizResult.score / quizResult.total_questions) * 100).toFixed(1);
  const completedDate = new Date(quizResult.completed_at).toLocaleString('fr-FR');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Détails du Quiz</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="quiz-summary">
          <div className="student-info">
            <h3>{quizResult.students.first_name} {quizResult.students.last_name}</h3>
            <p><strong>Score:</strong> {quizResult.score} / {quizResult.total_questions}</p>
            <p><strong>Pourcentage:</strong> {percentage}%</p>
            <p><strong>Date:</strong> {completedDate}</p>
          </div>
        </div>

        <div className="answers-section">
          <h4>Détail des réponses:</h4>
          <div className="answers-list">
            {quizResult.answers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                <div className="answer-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className={`answer-status ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                    {answer.is_correct ? '✅ Correct' : '❌ Incorrect'}
                  </span>
                </div>
                <p className="question-text"><strong>Question:</strong> {answer.question}</p>
                <p className="answer-text"><strong>Réponse donnée:</strong> {answer.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailsModal;