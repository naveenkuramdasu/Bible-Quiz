// src/components/Quiz.jsx

import { useEffect, useRef, useState } from "react";

import QuestionCard from "./QuestionCard";
import Timer from "./Timer";
import ProgressBar from "./ProgressBar";

import "../styles/quiz.css";

function Quiz({
  questions = [],
  participant,
  onSubmit,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startedAtRef = useRef(Date.now());

  const submitLockRef = useRef(false);

  /*
   * Timer
   */
  useEffect(() => {
    startedAtRef.current = Date.now();

    const interval = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - startedAtRef.current) / 1000
      );

      setElapsedSeconds(seconds);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * No questions
   */
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-empty">
        <h2>No questions available</h2>

        <p>
          Please add questions to questions.js.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  /*
   * Select answer
   */
  const handleAnswer = (
    questionId,
    answerIndex
  ) => {
    if (submitted || isSubmitting) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: answerIndex,
    }));
  };

  /*
   * Previous
   */
  const goPrevious = () => {
    if (submitted || isSubmitting) {
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex(
        (previous) => previous - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /*
   * Next
   */
  const goNext = () => {
    if (submitted || isSubmitting) {
      return;
    }

    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /*
   * FINAL SUBMIT
   */
  const handleSubmit = async () => {
    if (
      submitted ||
      isSubmitting ||
      submitLockRef.current
    ) {
      return;
    }

    const answeredCount =
      Object.keys(answers).length;

    /*
     * Warn about unanswered questions.
     */
    if (
      answeredCount <
      questions.length
    ) {
      const continueSubmit =
        window.confirm(
          `You answered ${answeredCount} of ${questions.length} questions.\n\nDo you still want to submit?`
        );

      if (!continueSubmit) {
        return;
      }
    }

    /*
     * Final confirmation.
     */
    const finalConfirmation =
      window.confirm(
        "Submit your quiz now?\n\nThis submission is final."
      );

    if (!finalConfirmation) {
      return;
    }

    /*
     * Prevent double click.
     */
    submitLockRef.current = true;

    setIsSubmitting(true);

    /*
     * Calculate exact time.
     *
     * milliseconds are also saved for
     * accurate tie-breaking.
     */
    const elapsedMs = Math.max(
      1,
      Math.round(
        Date.now() -
          startedAtRef.current
      )
    );

    const finalTime = Math.max(
      1,
      Math.floor(
        elapsedMs / 1000
      )
    );

    /*
     * Calculate score.
     */
    let score = 0;

    questions.forEach((question) => {
      const selectedAnswer =
        answers[question.id];

      if (
        selectedAnswer ===
        question.answer
      ) {
        score += 1;
      }
    });

    /*
     * Complete result object.
     */
    const quizResult = {
      score,

      totalQuestions:
        questions.length,

      elapsedSeconds:
        finalTime,

      elapsedMs,

      answers,

      submittedAt:
        new Date().toISOString(),
    };

    try {
      /*
       * IMPORTANT:
       * Wait for Firebase submission.
       */
      if (
        typeof onSubmit ===
        "function"
      ) {
        await onSubmit(
          quizResult
        );
      }

      /*
       * Lock only AFTER
       * successful submission.
       */
      setSubmitted(true);

    } catch (error) {
      console.error(
        "Quiz submission failed:",
        error
      );

      /*
       * Allow retry if Firebase
       * submission failed.
       */
      submitLockRef.current = false;

    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount =
    Object.keys(answers).length;

  return (
    <div className="quiz-container">

      {/* =====================================
          QUIZ HEADER
      ===================================== */}

      <div className="quiz-topbar">

        <div className="quiz-brand">

          <div className="quiz-logo">
            <img
              src="/logo.jpeg"
              alt="Jeevamu Gala Thandri Sannidhi"
            />
          </div>

          <div className="quiz-user">

            <span>
              PARTICIPANT
            </span>

            <strong>
              {participant?.name ||
                "Participant"}
            </strong>

          </div>

        </div>

        <div className="quiz-live">

          <span className="live-dot"></span>

          LIVE QUIZ

        </div>

        <Timer
          seconds={
            elapsedSeconds
          }
        />

      </div>

      {/* =====================================
          PROGRESS
      ===================================== */}

      <ProgressBar
        current={
          currentIndex + 1
        }
        total={
          questions.length
        }
        answered={
          answeredCount
        }
      />

      {/* =====================================
          QUESTION
      ===================================== */}

      <QuestionCard
        question={
          currentQuestion
        }

        questionNumber={
          currentIndex + 1
        }

        selectedAnswer={
          answers[
            currentQuestion.id
          ]
        }

        onAnswer={
          handleAnswer
        }
      />

      {/* =====================================
          NAVIGATION
      ===================================== */}

      <div className="quiz-navigation">

        <button
          type="button"
          className="nav-button secondary"
          onClick={
            goPrevious
          }
          disabled={
            currentIndex === 0 ||
            submitted ||
            isSubmitting
          }
        >
          ← Previous
        </button>

        <div className="question-counter">
          {currentIndex + 1} /{" "}
          {questions.length}
        </div>

        {currentIndex <
        questions.length - 1 ? (

          <button
            type="button"
            className="nav-button primary"
            onClick={
              goNext
            }
            disabled={
              submitted ||
              isSubmitting
            }
          >
            Next →
          </button>

        ) : (

          <button
            type="button"
            className="nav-button submit-button"
            onClick={
              handleSubmit
            }
            disabled={
              submitted ||
              isSubmitting
            }
          >
            {isSubmitting
              ? "Submitting..."
              : submitted
              ? "Submitted ✓"
              : "Submit Quiz ✓"}
          </button>

        )}

      </div>

      {/* =====================================
          QUESTION NAVIGATOR
      ===================================== */}

      <div className="question-dots">

        {questions.map(
          (
            question,
            index
          ) => {

            const isAnswered =
              answers[
                question.id
              ] !== undefined;

            const isActive =
              index ===
              currentIndex;

            return (
              <button
                key={
                  question.id
                }
                type="button"
                className={[
                  "question-dot",

                  isActive
                    ? "active"
                    : "",

                  isAnswered
                    ? "answered"
                    : "",
                ].join(" ")}
                onClick={() => {

                  if (
                    submitted ||
                    isSubmitting
                  ) {
                    return;
                  }

                  setCurrentIndex(
                    index
                  );

                  window.scrollTo({
                    top: 0,
                    behavior:
                      "smooth",
                  });

                }}
                disabled={
                  submitted ||
                  isSubmitting
                }
              >
                {index + 1}
              </button>
            );
          }
        )}

      </div>

      <div className="quiz-final-note">
        🔒 Final submission is allowed only once.
      </div>

    </div>
  );
}

export default Quiz;