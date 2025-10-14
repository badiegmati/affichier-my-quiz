import React from 'react';

const QuizResultsList = ({ quizResults, loading, onViewDetails, onRefresh }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  return (
    <div className="quiz-results-section">
      <div className="section-header">
        <h2>Tous les résultats de quiz</h2>
        <button className="btn-refresh" onClick={onRefresh}>
          🔄 Actualiser
        </button>
      </div>

      {quizResults.length === 0 ? (
        <div className="no-results">
          <p>Aucun résultat de quiz trouvé</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Âge</th>
                <th>Score</th>
                <th>Pourcentage</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.map((result) => {
                const percentage = ((result.score / result.total_questions) * 100).toFixed(1);
                const completedDate = new Date(result.completed_at).toLocaleDateString('fr-FR');
                const isPerfectScore = result.score === result.total_questions;

                return (
                  <tr key={result.id} className={isPerfectScore ? 'perfect-score' : ''}>
                    <td>
                      <strong>{result.students.first_name} {result.students.last_name}</strong>
                    </td>
                    <td>{result.students.age} ans</td>
                    <td>
                      {result.score} / {result.total_questions}
                      {isPerfectScore && <span className="perfect-badge">✨</span>}
                    </td>
                    <td>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <span className="percentage-text">{percentage}%</span>
                      </div>
                    </td>
                    <td>{completedDate}</td>
                    <td>
                      <button 
                        className="btn-details"
                        onClick={() => onViewDetails(result.id)}
                      >
                        📊 Détails
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizResultsList;