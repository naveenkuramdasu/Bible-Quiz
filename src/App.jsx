// src/App.jsx

import { useState } from "react";

import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import Leaderboard from "./components/Leaderboard";

import "./styles/global.css";

function App() {
  const [page, setPage] = useState("home");

  const [participant, setParticipant] =
    useState(null);

  const [result, setResult] = useState(null);

  const handleStartQuiz = (participantData) => {
    setParticipant(participantData);
    setPage("quiz");
  };

  const handleQuizFinish = (quizResult) => {
    setResult(quizResult);
    setPage("result");
  };

  const handleLeaderboard = () => {
    setPage("leaderboard");
  };

  const handleBackHome = () => {
    setPage("home");
  };

  return (
    <div className="app-root">

      {page === "home" && (
        <Home
          onStart={handleStartQuiz}
          onLeaderboard={handleLeaderboard}
        />
      )}

      {page === "quiz" && (
        <QuizPage
          participant={participant}
          onFinish={handleQuizFinish}
          onBack={handleBackHome}
        />
      )}

      {page === "result" && (
        <ResultPage
          result={result}
          onLeaderboard={handleLeaderboard}
        />
      )}

      {page === "leaderboard" && (
        <Leaderboard
          onBack={handleBackHome}
        />
      )}

    </div>
  );
}

export default App;