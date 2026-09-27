// src/components/Leaderboard.jsx

import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import "../styles/leaderboard.css";

const QUIZ_ID =
  "jeevamu-gala-thandri-sannidhi-2026";

const RESULTS_COLLECTION =
  "quizResults";

function formatTime(ms = 0) {
  const totalSeconds = Math.floor(
    Number(ms || 0) / 1000
  );

  const minutes = Math.floor(
    totalSeconds / 60
  )
    .toString()
    .padStart(2, "0");

  const seconds = (
    totalSeconds % 60
  )
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function Leaderboard({ onBack }) {
  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    console.log(
      "Connecting to Firestore leaderboard..."
    );

    const resultsRef = collection(
      db,
      RESULTS_COLLECTION
    );

    const unsubscribe = onSnapshot(
      resultsRef,

      (snapshot) => {
        console.log(
          "Firestore documents:",
          snapshot.size
        );

        const data = [];

        snapshot.forEach((document) => {
          const item = document.data();

          console.log(
            "Leaderboard document:",
            document.id,
            item
          );

          /*
            Only show our Bible Quiz.
          */
          if (
            item.quizId === QUIZ_ID
          ) {
            data.push({
              id: document.id,
              ...item,
            });
          }
        });

        /*
          Sort:
          1. Higher score
          2. Faster time
          3. Earlier submission
        */
        data.sort((a, b) => {
          const scoreA =
            Number(a.score || 0);

          const scoreB =
            Number(b.score || 0);

          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }

          const timeA =
            Number(
              a.elapsedMs ??
              Number(
                a.elapsedSeconds || 0
              ) * 1000
            );

          const timeB =
            Number(
              b.elapsedMs ??
              Number(
                b.elapsedSeconds || 0
              ) * 1000
            );

          if (timeA !== timeB) {
            return timeA - timeB;
          }

          return (
            Number(
              a.submittedAtMs || 0
            ) -
            Number(
              b.submittedAtMs || 0
            )
          );
        });

        setResults(data);
        setLoading(false);
        setError("");
      },

      (firebaseError) => {
        console.error(
          "Firestore leaderboard error:",
          firebaseError
        );

        setError(
          firebaseError.message ||
            "Unable to load leaderboard."
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const getRank = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return index + 1;
  };

  return (
    <section className="leaderboard-page">

      <div className="leaderboard-heading">

        <div>
          <div className="eyebrow">
            జీవము గల తండ్రి సన్నిధి
          </div>

          <h1>
            🏆 Leaderboard
          </h1>

          <p>
            Live results • Highest score first •
            Fastest time breaks ties
          </p>
        </div>

        <div className="leaderboard-symbol">
          ✝
        </div>

      </div>

      <div className="live-leaderboard-status">

        <span className="leaderboard-live-dot"></span>

        <span>
          LIVE RESULTS
        </span>

        <strong>
          {results.length} Participants
        </strong>

      </div>

      <div className="leaderboard-card">

        <div className="leaderboard-header-row">
          <span>RANK</span>
          <span>PARTICIPANT</span>
          <span>SCORE</span>
          <span>TIME</span>
        </div>

        {loading && (
          <div className="leaderboard-empty">
            <div className="loading-spinner"></div>

            <h3>
              Loading Results...
            </h3>

            <p>
              Connecting to Firebase.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="leaderboard-empty">

            <div className="empty-icon">
              ⚠️
            </div>

            <h3>
              Firebase Error
            </h3>

            <p>
              {error}
            </p>

          </div>
        )}

        {!loading &&
          !error &&
          results.length === 0 && (
            <div className="leaderboard-empty">

              <div className="empty-icon">
                📖
              </div>

              <h3>
                No Results Yet
              </h3>

              <p>
                Submit the quiz and the
                result will appear here.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          results.length > 0 && (
            <div className="leaderboard-results">

              {results.map(
                (result, index) => {
                  const score =
                    Number(
                      result.score || 0
                    );

                  const total =
                    Number(
                      result.totalQuestions ||
                        0
                    );

                  const elapsedMs =
                    Number(
                      result.elapsedMs ??
                      Number(
                        result.elapsedSeconds ||
                          0
                      ) * 1000
                    );

                  const accuracy =
                    total > 0
                      ? Math.round(
                          (score / total) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className={`leaderboard-row ${
                        index < 3
                          ? `top-${index + 1}`
                          : ""
                      }`}
                      key={result.id}
                    >

                      <div className="rank-cell">
                        <span>
                          {getRank(index)}
                        </span>
                      </div>

                      <div className="participant-cell">

                        <strong>
                          {
                            result.participantName ||
                            "Participant"
                          }
                        </strong>

                        <span>
                          {accuracy}% accuracy
                        </span>

                      </div>

                      <div className="score-cell">

                        <strong>
                          {score}
                        </strong>

                        <span>
                          / {total}
                        </span>

                      </div>

                      <div className="time-cell">
                        {formatTime(
                          elapsedMs
                        )}
                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </div>

      <div className="leaderboard-footer">

        <button
          type="button"
          className="leaderboard-back"
          onClick={onBack}
        >
          ← Back to Home
        </button>

        <span>
          Updates automatically
        </span>

      </div>

    </section>
  );
}

export default Leaderboard;