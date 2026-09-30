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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const data = [];

        snapshot.forEach((document) => {
          const item = document.data();

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
         * RANKING
         *
         * 1. Highest score
         * 2. Fastest time
         * 3. Earlier submission
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

  const getResultStats = (result) => {
    const score = Number(
      result.score || 0
    );

    const total = Number(
      result.totalQuestions || 0
    );

    const accuracy =
      total > 0
        ? Math.round(
            (score / total) * 100
          )
        : 0;

    const elapsedMs = Number(
      result.elapsedMs ??
        Number(
          result.elapsedSeconds || 0
        ) * 1000
    );

    return {
      score,
      total,
      accuracy,
      elapsedMs,
    };
  };

  return (
    <section className="leaderboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="leaderboard-heading">

        <div className="leaderboard-title-area">

          <div className="leaderboard-eyebrow">
            జీవముగల దేవుని సంఘము
          </div>

          <h1>
            <span className="trophy-icon">
              🏆
            </span>

            Leaderboard
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

      {/* =========================
          LIVE STATUS
      ========================= */}

      <div className="live-leaderboard-status">

        <div className="live-status-left">

          <span className="leaderboard-live-dot"></span>

          <span className="live-label">
            LIVE RESULTS
          </span>

        </div>

        <strong>
          {results.length}{" "}
          {results.length === 1
            ? "Participant"
            : "Participants"}
        </strong>

      </div>

      {/* =========================
          TOP 3
      ========================= */}

      {!loading &&
        !error &&
        results.length > 0 && (

          <div className="podium-section">

            {results[1] && (
              <div className="podium-card second">

                <div className="podium-medal">
                  🥈
                </div>

                <div className="podium-rank">
                  2ND
                </div>

                <strong>
                  {results[1]
                    .participantName ||
                    "Participant"}
                </strong>

                <span>
                  {getResultStats(
                    results[1]
                  ).score}
                  /
                  {getResultStats(
                    results[1]
                  ).total}
                </span>

                <small>
                  {formatTime(
                    getResultStats(
                      results[1]
                    ).elapsedMs
                  )}
                </small>

              </div>
            )}

            {results[0] && (
              <div className="podium-card first">

                <div className="champion-crown">
                  👑
                </div>

                <div className="podium-medal">
                  🥇
                </div>

                <div className="podium-rank">
                  CHAMPION
                </div>

                <strong>
                  {results[0]
                    .participantName ||
                    "Participant"}
                </strong>

                <span>
                  {getResultStats(
                    results[0]
                  ).score}
                  /
                  {getResultStats(
                    results[0]
                  ).total}
                </span>

                <small>
                  {formatTime(
                    getResultStats(
                      results[0]
                    ).elapsedMs
                  )}
                </small>

              </div>
            )}

            {results[2] && (
              <div className="podium-card third">

                <div className="podium-medal">
                  🥉
                </div>

                <div className="podium-rank">
                  3RD
                </div>

                <strong>
                  {results[2]
                    .participantName ||
                    "Participant"}
                </strong>

                <span>
                  {getResultStats(
                    results[2]
                  ).score}
                  /
                  {getResultStats(
                    results[2]
                  ).total}
                </span>

                <small>
                  {formatTime(
                    getResultStats(
                      results[2]
                    ).elapsedMs
                  )}
                </small>

              </div>
            )}

          </div>
        )}

      {/* =========================
          LEADERBOARD CARD
      ========================= */}

      <div className="leaderboard-card">

        <div className="leaderboard-card-top">

          <div>
            <span>
              FINAL RANKINGS
            </span>

            <h2>
              Bible Knowledge Challenge
            </h2>
          </div>

          <div className="live-chip">
            <span></span>
            LIVE
          </div>

        </div>

        {/* TABLE HEADER */}

        <div className="leaderboard-header-row">

          <span>RANK</span>

          <span>PARTICIPANT</span>

          <span>SCORE</span>

          <span>TIME</span>

        </div>

        {/* LOADING */}

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

        {/* ERROR */}

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

        {/* EMPTY */}

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
                Submit the quiz and your
                result will appear here.
              </p>

            </div>
          )}

        {/* RESULTS */}

        {!loading &&
          !error &&
          results.length > 0 && (

            <div className="leaderboard-results">

              {results.map(
                (result, index) => {

                  const {
                    score,
                    total,
                    accuracy,
                    elapsedMs,
                  } =
                    getResultStats(
                      result
                    );

                  return (
                    <div
                      className={`leaderboard-row ${
                        index < 3
                          ? `top-${index + 1}`
                          : ""
                      }`}
                      key={result.id}
                    >

                      {/* RANK */}

                      <div className="rank-cell">

                        <span
                          className={
                            index < 3
                              ? "rank-medal"
                              : "rank-number"
                          }
                        >
                          {getRank(index)}
                        </span>

                      </div>

                      {/* PARTICIPANT */}

                      <div className="participant-cell">

                        <strong>
                          {result.participantName ||
                            "Participant"}
                        </strong>

                        <span>
                          {accuracy}%
                          accuracy
                        </span>

                      </div>

                      {/* SCORE */}

                      <div className="score-cell">

                        <strong>
                          {score}
                        </strong>

                        <span>
                          / {total}
                        </span>

                      </div>

                      {/* TIME */}

                      <div className="time-cell">

                        <span className="time-icon">
                          ⏱
                        </span>

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

      {/* =========================
          FOOTER
      ========================= */}

      <div className="leaderboard-footer">

        <button
          type="button"
          className="leaderboard-back"
          onClick={onBack}
        >
          ← Back to Home
        </button>

        <span>
          <span className="footer-live-dot"></span>
          Updates automatically
        </span>

      </div>

    </section>
  );
}

export default Leaderboard;