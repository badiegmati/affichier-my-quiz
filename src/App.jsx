import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import QuizResultsList from './components/QuizResultsList';
import QuizDetailsModal from './components/QuizDetailsModal';
import './App.css';

function App() {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger tous les résultats de quiz
  const loadAllQuizResults = async () => {
    try {
      setLoading(true);
      
      const { data: quizResults, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          students (
            first_name,
            last_name,
            age
          )
        `)
        .order('score', { ascending: false }); // Tri par score décroissant

      if (error) {
        throw error;
      }

      setQuizResults(quizResults || []);
    } catch (error) {
      console.error('Erreur lors du chargement des résultats:', error);
      alert('Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails d'un quiz spécifique
  const loadQuizDetails = async (quizId) => {
    try {
      const { data: quizResult, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          students (
            first_name,
            last_name
          )
        `)
        .eq('id', quizId)
        .single();

      if (error) {
        throw error;
      }

      setSelectedQuiz(quizResult);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      alert('Erreur lors du chargement des détails du quiz');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  useEffect(() => {
    loadAllQuizResults();
  }, []);

  // Calculer les statistiques
  const totalQuizzes = quizResults.length;
  const averageScore = totalQuizzes > 0 
    ? (quizResults.reduce((sum, result) => sum + (result.score / result.total_questions), 0) / totalQuizzes * 100).toFixed(1)
    : 0;

  // Obtenir les 5 premiers étudiants
  const topFiveStudents = quizResults.slice(0, 5);

  return (
    <div className="app min-h-screen bg-gray-50">
      <header className="app-header bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-2">Tableau de Bord des Notes</h1>
          <p className="text-center text-blue-100 text-lg">Consultez tous les résultats des quiz des étudiants</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Classement des 5 premiers */}
        {topFiveStudents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              🏆 Classement des 5 Meilleurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {topFiveStudents.map((result, index) => {
                const percentage = ((result.score / result.total_questions) * 100).toFixed(1);
                const rank = index + 1;
                
                return (
                  <div 
                    key={result.id}
                    className={`relative rounded-2xl p-6 text-center shadow-xl transform transition-all duration-300 hover:scale-105 ${
                      rank === 1 
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' 
                        : rank === 2
                        ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                        : rank === 3
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                        : 'bg-white border-2 border-blue-200'
                    }`}
                  >
                    {/* Médaille */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        rank === 1 ? 'bg-yellow-600' :
                        rank === 2 ? 'bg-gray-600' :
                        rank === 3 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {rank}
                      </div>
                    </div>

                    {/* Informations de l'étudiant */}
                    <div className="mt-4">
                      <h3 className="font-bold text-xl mb-2">
                        {result.students.first_name} {result.students.last_name}
                      </h3>
                      <p className="text-sm opacity-90 mb-2">{result.students.age} ans</p>
                      
                      <div className={`text-3xl font-bold mb-2 ${
                        rank <= 3 ? 'text-white' : 'text-blue-600'
                      }`}>
                        {percentage}%
                      </div>
                      
                      <p className="text-sm font-medium">
                        {result.score} / {result.total_questions}
                      </p>
                      
                      {rank === 1 && (
                        <div className="mt-3 text-yellow-200">
                          <span className="text-2xl">👑</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="stats grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat-card bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="stat-number text-4xl font-bold text-blue-600">{totalQuizzes}</div>
            <div className="stat-label text-gray-600 mt-2">Quiz complétés</div>
          </div>
          <div className="stat-card bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="stat-number text-4xl font-bold text-green-600">{averageScore}%</div>
            <div className="stat-label text-gray-600 mt-2">Score moyen</div>
          </div>
          <div className="stat-card bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="stat-number text-4xl font-bold text-purple-600">
              {quizResults.filter(result => result.score === result.total_questions).length}
            </div>
            <div className="stat-label text-gray-600 mt-2">Quiz parfaits</div>
          </div>
        </div>

        {/* Liste complète des résultats */}
        <QuizResultsList
          quizResults={quizResults}
          loading={loading}
          onViewDetails={loadQuizDetails}
          onRefresh={loadAllQuizResults}
        />

        {/* Modal des détails */}
        {isModalOpen && selectedQuiz && (
          <QuizDetailsModal
            quizResult={selectedQuiz}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}

export default App;