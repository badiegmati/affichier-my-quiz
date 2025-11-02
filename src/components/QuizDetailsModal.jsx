import React from 'react';

const QuizDetailsModal = ({ quizResult, onClose }) => {
  const percentage = ((quizResult.score / quizResult.total_questions) * 100).toFixed(1);
  const completedDate = new Date(quizResult.completed_at).toLocaleString('fr-FR');
  const correctAnswers = quizResult.answers.filter(answer => answer.is_correct).length;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Détails du Quiz</h2>
          <button 
            className="btn-close text-white hover:text-gray-200 text-2xl font-bold transition duration-200"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Résumé du quiz */}
          <div className="quiz-summary p-6 border-b border-gray-200">
            <div className="student-info">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {quizResult.students.first_name[0]}{quizResult.students.last_name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {quizResult.students.first_name} {quizResult.students.last_name}
                  </h3>
                  <p className="text-gray-600">Étudiant</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{quizResult.score}/{quizResult.total_questions}</div>
                  <div className="text-sm text-blue-800 font-medium">Score</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-600">{percentage}%</div>
                  <div className="text-sm text-green-800 font-medium">Pourcentage</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">{correctAnswers}/{quizResult.answers.length}</div>
                  <div className="text-sm text-purple-800 font-medium">Réponses correctes</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  <strong>Date de complétion:</strong> {completedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Détail des réponses */}
          <div className="answers-section p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📋</span>
              Détail des réponses ({quizResult.answers.length} questions)
            </h4>
            <div className="answers-list space-y-4">
              {quizResult.answers.map((answer, index) => (
                <div 
                  key={index} 
                  className={`answer-item rounded-xl p-4 border-2 transition-all duration-200 ${
                    answer.is_correct 
                      ? 'bg-green-50 border-green-300 hover:border-green-400' 
                      : 'bg-red-50 border-red-300 hover:border-red-400'
                  }`}
                >
                  <div className="answer-header flex justify-between items-center mb-3">
                    <span className="question-number font-bold text-gray-800">
                      Question {index + 1}
                    </span>
                    <span className={`answer-status px-3 py-1 rounded-full text-sm font-bold ${
                      answer.is_correct 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {answer.is_correct ? '✅ Correct' : '❌ Incorrect'}
                    </span>
                  </div>
                  
                  <p className="question-text text-gray-700 mb-2">
                    <strong className="text-gray-800">Question:</strong> {answer.question}
                  </p>
                  
                  <p className="answer-text text-gray-700">
                    <strong className="text-gray-800">Réponse donnée:</strong> {answer.answer}
                  </p>

                  {!answer.is_correct && (
                    <p className="correct-answer text-green-700 mt-2 text-sm">
                      <strong>Bonne réponse:</strong> {answer.correct_answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button 
              className="btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailsModal;