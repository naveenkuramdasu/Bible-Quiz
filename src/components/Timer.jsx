// src/components/Timer.jsx

function Timer({ seconds = 0 }) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remainingSeconds = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className="timer-component">
      <span>TIME</span>

      <strong>
        {minutes}:{remainingSeconds}
      </strong>
    </div>
  );
}

export default Timer;