import React from 'react';

const QuizResultsList = ({ quizResults, loading, onViewDetails, onRefresh }) => {
  if (loading) {
    return (
      <div className="loading-container flex flex-col items-center justify-center py-12">
        <div className="loading-spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Chargement des résultats...</p>
      </div>
    );
  }

  return (
    <div className="quiz-results-section bg-white rounded-2xl shadow-lg p-6">
      <div className="section-header flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tous les résultats de quiz</h2>
        <button 
          className="btn-refresh bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
          onClick={onRefresh}
        >
          <span>🔄</span>
          Actualiser
        </button>
      </div>

      {quizResults.length === 0 ? (
        <div className="no-results text-center py-12">
          <p className="text-gray-500 text-lg">Aucun résultat de quiz trouvé</p>
        </div>
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="results-table min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Étudiant</th>
                <th className="px-6 py-4 text-left font-semibold">Âge</th>
                <th className="px-6 py-4 text-left font-semibold">Score</th>
                <th className="px-6 py-4 text-left font-semibold">Pourcentage</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quizResults.map((result, index) => {
                const percentage = ((result.score / result.total_questions) * 100).toFixed(1);
                const completedDate = new Date(result.completed_at).toLocaleDateString('fr-FR');
                const isPerfectScore = result.score === result.total_questions;
                const isTopThree = index < 3;

                return (
                  <tr 
                    key={result.id} 
                    className={`hover:bg-gray-50 transition duration-200 ${
                      isPerfectScore ? 'bg-green-50 border-l-4 border-green-500' : ''
                    } ${isTopThree ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {isTopThree && (
                          <span className={`mr-3 text-lg ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-500' :
                            'text-orange-500'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                        <strong className="text-gray-800">
                          {result.students.first_name} {result.students.last_name}
                        </strong>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{result.students.age} ans</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {result.score} / {result.total_questions}
                        </span>
                        {isPerfectScore && (
                          <span className="perfect-badge bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            ✨ Parfait
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="percentage-bar bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className={`percentage-fill h-6 rounded-full transition-all duration-1000 ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <span className="percentage-text absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{completedDate}</td>
                    <td className="px-6 py-4">
                      <button 
                        className="btn-details bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
                        onClick={() => onViewDetails(result.id)}
                      >
                        <span>📊</span>
                        Détails
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