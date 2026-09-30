// src/pages/ResultPage.jsx

import "../styles/result.css";

function formatTime(seconds = 0) {
  const safeSeconds = Math.max(
    0,
    Number(seconds || 0)
  );

  const minutes = Math.floor(
    safeSeconds / 60
  )
    .toString()
    .padStart(2, "0");

  const remainingSeconds = Math.floor(
    safeSeconds % 60
  )
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function ResultPage({
  result,
  onLeaderboard,
}) {
  /*
   * No result available
   */
  if (!result) {
    return (
      <div className="result-empty">

        <h2>
          No result available
        </h2>

        <p>
          Complete the quiz to view your result.
        </p>

      </div>
    );
  }

  /*
   * Result data
   */
  const {
    participantName,
    score,
    totalQuestions,
    elapsedSeconds,
  } = result;

  /*
   * Safe values
   */
  const safeScore = Math.max(
    0,
    Number(score || 0)
  );

  const safeTotalQuestions = Math.max(
    0,
    Number(totalQuestions || 0)
  );

  /*
   * Percentage
   */
  const percentage =
    safeTotalQuestions > 0
      ? Math.round(
          (safeScore /
            safeTotalQuestions) *
            100
        )
      : 0;

  /*
   * Performance message
   */
  let message;

  if (
    safeScore ===
    safeTotalQuestions
  ) {
    message =
      "Perfect score! Excellent Bible knowledge. 🔥";
  } else if (
    percentage >= 80
  ) {
    message =
      "Excellent work! Keep growing in the Word. 📖";
  } else if (
    percentage >= 60
  ) {
    message =
      "Good job! Keep learning and improving.";
  } else {
    message =
      "Keep learning and practicing. You can improve!";
  }

  return (
    <section className="result-page">

      {/* =================================================
          SUCCESS HEADER
      ================================================= */}

      <div className="result-success-icon">
        ✓
      </div>

      <div className="eyebrow">
        SUBMISSION RECEIVED
      </div>

      <h1>
        Quiz Completed!
      </h1>

      <p className="result-name">
        {participantName ||
          "Participant"}
      </p>

      {/* =================================================
          SCORE CARD
      ================================================= */}

      <div className="result-score-card">

        <span>
          YOUR SCORE
        </span>

        <strong>
          {safeScore}

          <small>
            /{safeTotalQuestions}
          </small>
        </strong>

        <div className="percentage">
          {percentage}% Score
        </div>

      </div>

      {/* =================================================
          RESULT STATISTICS
      ================================================= */}

      <div className="result-stat-grid">

        <div className="result-stat">

          <span>
            Correct Answers
          </span>

          <strong>
            {safeScore}
          </strong>

        </div>

        <div className="result-stat">

          <span>
            Total Questions
          </span>

          <strong>
            {safeTotalQuestions}
          </strong>

        </div>

        <div className="result-stat">

          <span>
            Completion Time
          </span>

          <strong>
            {formatTime(
              elapsedSeconds
            )}
          </strong>

        </div>

        <div className="result-stat">

          <span>
            Accuracy
          </span>

          <strong>
            {percentage}%
          </strong>

        </div>

      </div>

      {/* =================================================
          PERFORMANCE MESSAGE
      ================================================= */}

      <div className="result-message">
        {message}
      </div>

      {/* =================================================
          SUBMISSION LOCK
      ================================================= */}

      <div className="result-lock">

        <span>
          🔒
        </span>

        <div>

          <strong>
            Submission Locked
          </strong>

          <p>
            You cannot submit this quiz again
            on this device.
          </p>

        </div>

      </div>

      {/* =================================================
          LEADERBOARD
      ================================================= */}

      <button
        type="button"
        className="result-leaderboard-btn"
        onClick={onLeaderboard}
      >
        View Leaderboard →
      </button>

      {/* =================================================
          FOOTER NOTE
      ================================================= */}

      <p className="result-note">
        Thank you for participating in the Bible Quiz.
      </p>

    </section>
  );
}

export default ResultPage;