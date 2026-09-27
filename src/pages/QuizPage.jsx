// src/pages/QuizPage.jsx

import { useEffect, useState } from "react";

import { questions } from "../data/questions";

import Quiz from "../components/Quiz";

import {
  DEMO_MODE,
  submitQuizResult,
} from "../services/quizService";

import "../styles/quiz.css";

/*
  ==================================================
  TESTING MODE
  ==================================================

  true  → multiple test submissions allowed

  false → final event mode
           one submission per Firebase user
*/
const ENABLE_SUBMISSION_LOCK =
  true;

const SUBMISSION_KEY =
  "bibleQuizSubmitted";

function QuizPage({
  participant,
  onFinish,
  onBack,
}) {
  const [locked, setLocked] =
    useState(false);

  /*
   * Check local lock only in
   * FINAL mode.
   */
  useEffect(() => {
    if (DEMO_MODE) {
      return;
    }

    if (!ENABLE_SUBMISSION_LOCK) {
      return;
    }

    const alreadySubmitted =
      localStorage.getItem(
        SUBMISSION_KEY
      ) === "true";

    if (alreadySubmitted) {
      setLocked(true);
    }
  }, []);

  /*
   * Missing participant
   */
  if (!participant) {
    return (
      <div className="quiz-empty">

        <h2>
          Participant details missing
        </h2>

        <p>
          Please return to the home page
          and enter your name.
        </p>

        <button
          type="button"
          className="nav-button primary"
          onClick={onBack}
        >
          ← Back to Home
        </button>

      </div>
    );
  }

  /*
   * Locked in final mode
   */
  if (locked) {
    return (
      <div className="quiz-locked-screen">

        <div className="locked-icon">
          🔒
        </div>

        <div className="eyebrow">
          SUBMISSION LOCKED
        </div>

        <h2>
          This quiz has already been submitted
        </h2>

        <p>
          This quiz has already been
          completed on this device.
          A second submission is not allowed.
        </p>

        <button
          type="button"
          className="nav-button secondary"
          onClick={onBack}
        >
          ← Back to Home
        </button>

      </div>
    );
  }

  /*
   * ==================================================
   * FIREBASE SUBMISSION
   * ==================================================
   */
  const handleQuizSubmit =
    async (quizResult) => {

      try {
        console.log(
          "Starting Firebase submission..."
        );

        /*
         * Save result to Firestore.
         */
        const savedResult =
          await submitQuizResult({
            participantName:
              participant.name,

            score:
              quizResult.score,

            totalQuestions:
              quizResult.totalQuestions,

            elapsedSeconds:
              quizResult.elapsedSeconds,

            elapsedMs:
              quizResult.elapsedMs,
          });

        console.log(
          "✅ Result saved successfully:",
          savedResult
        );

        /*
         * Only final mode gets
         * local device lock.
         */
        if (
          ENABLE_SUBMISSION_LOCK &&
          !DEMO_MODE
        ) {
          localStorage.setItem(
            SUBMISSION_KEY,
            "true"
          );

          setLocked(true);
        }

        /*
         * Send result to App.jsx
         */
        if (
          typeof onFinish ===
          "function"
        ) {
          onFinish({
            ...quizResult,

            participantName:
              participant.name,

            totalQuestions:
              questions.length,

            firebaseId:
              savedResult.id,
          });
        }

      } catch (error) {

        console.error(
          "❌ Firebase submission failed:",
          error
        );

        /*
         * VERY IMPORTANT:
         * Throw error back to Quiz.jsx.
         *
         * This prevents the quiz from being
         * marked as submitted when Firebase
         * save fails.
         */
        throw error;
      }
    };

  return (
    <div className="page-container">

      <Quiz
        questions={questions}
        participant={participant}
        onSubmit={
          handleQuizSubmit
        }
      />

    </div>
  );
}

export default QuizPage;