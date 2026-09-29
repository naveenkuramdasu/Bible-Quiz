// src/pages/Home.jsx

import { useState } from "react";
import Header from "../components/Header";
import "../styles/global.css";

function Home({
  onStart,
  onLeaderboard,
}) {
  const [name, setName] = useState("");

  const handleStart = () => {
    const cleanName = name.trim();

    if (!cleanName) {
      alert("Please enter your name.");
      return;
    }

    onStart({
      name: cleanName,
    });
  };

  return (
    <div className="home-page">

      <Header />

      {/* =========================
          HERO
      ========================= */}

      <section className="home-hero">

        <div className="home-kicker">
          <span className="kicker-line"></span>
          BIBLE KNOWLEDGE CHALLENGE
          <span className="kicker-line"></span>
        </div>


    <h1>
  జీవముగల దేవుని సంఘము
</h1>
        

        <p className="home-subtitle">
          Test your knowledge of the Word,
          challenge yourself, and discover
          how much you remember.
        </p>

        <div className="hero-decoration">
          <span>✦</span>
          <span>✝</span>
          <span>✦</span>
        </div>

      </section>

      {/* =========================
          EVENT INFO
      ========================= */}

      <section className="event-info">

        <div className="event-info-card">
          <span className="info-icon">📖</span>
          <div>
            <strong>25 Questions</strong>
            <small>Test your Bible knowledge</small>
          </div>
        </div>

        <div className="event-info-card">
          <span className="info-icon">🏆</span>
          <div>
            <strong>25 Marks</strong>
            <small>1 mark for each answer</small>
          </div>
        </div>

        <div className="event-info-card">
          <span className="info-icon">⚡</span>
          <div>
            <strong>Speed Matters</strong>
            <small>Time breaks equal scores</small>
          </div>
        </div>

      </section>

      {/* =========================
          START CARD
      ========================= */}

      <section className="start-card">

        <div className="start-card-glow"></div>

        <div className="start-card-header">

          <div className="start-emblem">
            ✝
          </div>

          <div>
            <div className="start-label">
              READY?
            </div>

            <h2>
              Begin Your Journey
            </h2>

            <p>
              Enter your name below to enter
              the Bible Quiz.
            </p>
          </div>

        </div>

        <div className="input-area">

          <label htmlFor="participantName">
            PARTICIPANT NAME
          </label>

          <div className="name-input-wrap">

            <span>👤</span>

            <input
              id="participantName"
              type="text"
              value={name}
              maxLength={60}
              autoComplete="name"
              placeholder="Enter your full name"
              onChange={(event) =>
                setName(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleStart();
                }
              }}
            />

          </div>

        </div>

        <button
          type="button"
          className="start-quiz-button"
          onClick={handleStart}
        >
          <span>Start Bible Quiz</span>
          <strong>→</strong>
        </button>

        <div className="single-submit-note">
          <span>🔒</span>
          <p>
            One final submission only.
            Review your answers before submitting.
          </p>
        </div>

      </section>

      {/* =========================
          LEADERBOARD
      ========================= */}

      <button
        type="button"
        className="leaderboard-home-button"
        onClick={onLeaderboard}
      >
        <span>🏆</span>
        <span>View Leaderboard</span>
        <strong>→</strong>
      </button>

      {/* =========================
          QUOTE
      ========================= */}

      <section className="bible-quote">

        <span className="quote-mark">“</span>

        <p>
          Your word is a lamp to my feet
          and a light to my path.
        </p>

        <small>
          PSALM 119:105
        </small>

      </section>

    </div>
  );
}

export default Home;