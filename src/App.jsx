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
        .order('completed_at', { ascending: false });

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

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Tableau de Bord des Notes</h1>
          <p className="subtitle">Consultez tous les résultats des quiz des étudiants</p>
        </div>
      </header>

      <div className="container">
        {/* Statistiques */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{totalQuizzes}</div>
            <div className="stat-label">Quiz complétés</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{averageScore}%</div>
            <div className="stat-label">Score moyen</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {quizResults.filter(result => result.score === result.total_questions).length}
            </div>
            <div className="stat-label">Quiz parfaits</div>
          </div>
        </div>

        {/* Liste des résultats */}
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