// src/pages/ResultPage.jsx

import "../styles/result.css";

function formatTime(seconds = 0) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remainingSeconds = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function ResultPage({
  result,
  onLeaderboard,
}) {
  if (!result) {
    return (
      <div className="result-empty">
        <h2>No result available</h2>
        <p>
          Complete the quiz to view your result.
        </p>
      </div>
    );
  }

  const {
    participantName,
    participantId,
    score,
    totalQuestions,
    elapsedSeconds,
  } = result;

  const percentage =
    totalQuestions > 0
      ? Math.round(
          (score / totalQuestions) * 100
        )
      : 0;

  let message;

  if (score === totalQuestions) {
    message =
      "Perfect score! Excellent Bible knowledge. 🔥";
  } else if (percentage >= 80) {
    message =
      "Excellent work! Keep growing in the Word. 📖";
  } else if (percentage >= 60) {
    message =
      "Good job! Keep learning and improving.";
  } else {
    message =
      "Keep learning and practicing. You can improve!";
  }

  return (
    <section className="result-page">

      {/* Success Header */}

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
        {participantName}
      </p>

      <div className="result-id">
        Participant ID:{" "}
        <strong>{participantId}</strong>
      </div>

      {/* Score */}

      <div className="result-score-card">

        <span>
          YOUR SCORE
        </span>

        <strong>
          {score}
          <small>
            /{totalQuestions}
          </small>
        </strong>

        <div className="percentage">
          {percentage}% Score
        </div>

      </div>

      {/* Stats */}

      <div className="result-stat-grid">

        <div className="result-stat">
          <span>Correct Answers</span>
          <strong>
            {score}
          </strong>
        </div>

        <div className="result-stat">
          <span>Total Questions</span>
          <strong>
            {totalQuestions}
          </strong>
        </div>

        <div className="result-stat">
          <span>Completion Time</span>
          <strong>
            {formatTime(elapsedSeconds)}
          </strong>
        </div>

        <div className="result-stat">
          <span>Accuracy</span>
          <strong>
            {percentage}%
          </strong>
        </div>

      </div>

      {/* Message */}

      <div className="result-message">
        {message}
      </div>

      {/* Locked */}

      <div className="result-lock">

        <span>🔒</span>

        <div>
          <strong>
            Submission Locked
          </strong>

          <p>
            You cannot submit this quiz again
            with this Participant ID on this device.
          </p>
        </div>

      </div>

      {/* Leaderboard */}

      <button
        type="button"
        className="result-leaderboard-btn"
        onClick={onLeaderboard}
      >
        View Leaderboard →
      </button>

      <p className="result-note">
        Thank you for participating in the Bible Quiz.
      </p>

    </section>
  );
}

export default ResultPage;