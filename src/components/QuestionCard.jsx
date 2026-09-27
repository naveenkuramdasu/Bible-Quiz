// src/components/QuestionCard.jsx

function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswer,
}) {
  return (
    <article className="question-card">

      <div className="question-header">
        <div className="question-number">
          QUESTION {questionNumber}
        </div>

        {question.difficulty && (
          <div
            className={`difficulty-badge ${question.difficulty.toLowerCase()}`}
          >
            {question.difficulty}
          </div>
        )}
      </div>

      <h2 className="question-title">
        {question.question}
      </h2>

      <div className="options-list">

        {question.options.map((option, index) => {

          const selected = selectedAnswer === index;

          return (
            <button
              key={index}
              type="button"
              className={`answer-option ${
                selected ? "selected" : ""
              }`}
              onClick={() =>
                onAnswer(question.id, index)
              }
            >

              <span className="option-number">
                {index + 1}
              </span>

              <span className="option-text">
                {option}
              </span>

              <span className="option-check">
                {selected ? "✓" : ""}
              </span>

            </button>
          );
        })}

      </div>

      <div className="question-hint">
        <span>💡</span>
        <p>
          Select one answer. You can change it before final submission.
        </p>
      </div>

    </article>
  );
}

export default QuestionCard;