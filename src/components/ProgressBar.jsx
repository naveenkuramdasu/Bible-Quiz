// src/components/ProgressBar.jsx

function ProgressBar({
  current,
  total,
  answered,
}) {
  const percentage =
    total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="quiz-progress-section">

      <div className="progress-information">
        <span>
          {answered} / {total} answered
        </span>

        <span>
          Question {current} of {total}
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
}

export default ProgressBar;