import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const decodeHtml = (html: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const Trivia: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        setQuestions(response.data.results);
      } catch (error) {
        console.error("Error fetching trivia questions", error);
      }
    };

    fetchQuestions();
  }, []);

  if (questions.length === 0) {
    return <div className="text-center text-white">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] min-w-[100dvw] bg-gray-900 text-white">
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h1 className="text-2xl mb-4">{decodeHtml(currentQuestion.category)}</h1>
        <p className="text-lg mb-4">{decodeHtml(currentQuestion.question)}</p>
        <div className="mb-4">
          {allAnswers.map((answer, index) => (
            <button
              key={index}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
              onClick={() => setShowAnswer(true)}
            >
              {decodeHtml(answer)}
            </button>
          ))}
        </div>
        {showAnswer && (
          <p className="text-lg">
            Correct Answer: <span className="font-bold">{decodeHtml(currentQuestion.correct_answer)}</span>
          </p>
        )}
        {currentQuestionIndex < questions.length - 1 && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default Trivia;
