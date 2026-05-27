import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Curated list of soccer simulation messages for a premium loading experience
const LOADING_PHRASES = [
  "Consulting tactical playbooks...",
  "Analyzing squad balance & chemistry...",
  "Drafting a hilarious tactical roast...",
  "Evaluating your coach potential...",
  "Simulating the group stages...",
  "Calibrating the VAR cameras...",
];

function CircularScore({ score, label, color }) {
  const normalizedScore = Math.max(0, Math.min(10, score));
  const percentage = normalizedScore * 10;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div style={{ position: "relative", width: "96px", height: "96px" }}>
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="7"
          />
          {/* Progress Circle with framer-motion */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Core Percentage Text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#ffffff",
              fontFamily: "Outfit, Inter, sans-serif",
              lineHeight: 1,
            }}
          >
            {normalizedScore}
          </span>
          <span
            style={{
              fontSize: "9px",
              color: "rgba(255, 255, 255, 0.4)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginTop: "2px",
            }}
          >
            / 10
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "rgba(255, 255, 255, 0.55)",
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * ReviewCard Component
 *
 * @param {Object} props
 * @param {Object|null} props.review      - The parsed review object from reviewTeam()
 * @param {boolean} props.isLoading       - Whether the API request is currently running
 * @param {Function} props.resetGame      - Triggered when "Play Again" button is clicked
 * @param {{ score1: string, score2: string }} props.scoreLabels
 *   Labels for the two circular gauges.
 *   WC default: { score1: 'Squad Balance', score2: 'Formation Fit' }
 *   IPL:        { score1: 'Batting Depth', score2: 'Bowling Attack' }
 * @param {'wc'|'ipl'} props.mode
 */
export default function ReviewCard({
  review,
  isLoading,
  resetGame,
  scoreLabels = { score1: 'Squad Balance', score2: 'Formation Fit' },
  mode = 'wc',
}) {
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  // Cycle phrases every 2.5s while loading
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: "100%",
          maxWidth: "480px",
          margin: "32px auto",
          padding: "40px 24px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)",
          textAlign: "center",
        }}
      >
        {/* Loading Spinner */}
        <div style={{ position: "relative", width: "72px", height: "72px" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "3.5px solid rgba(255,255,255,0.03)",
              borderTopColor: "#f59e0b",
              borderRightColor: "#3b82f6",
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            {mode === 'ipl' ? '🏏' : '⚽'}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#f5f5f5",
              fontFamily: "Outfit, Inter, sans-serif",
            }}
          >
            Tactical Analysis in Progress
          </h3>
          <motion.p
            key={loadingPhraseIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            style={{
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "Inter, sans-serif",
              minHeight: "20px",
            }}
          >
            {LOADING_PHRASES[loadingPhraseIndex]}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!review) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        width: "100%",
        maxWidth: "480px",
        margin: "32px auto",
        background: "rgba(255, 255, 255, 0.025)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)",
      }}
    >
      {/* Visual Header Grid Accent */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #f59e0b, #3b82f6)",
        }}
      />

      <div style={{ padding: "32px 24px" }}>
        {/* Main Title */}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            fontFamily: "Outfit, Inter, sans-serif",
            marginBottom: "28px",
          }}
        >
          {mode === 'ipl' ? 'Cricket XI Assessment' : 'Tactical Assessment'}
        </h2>

        {/* Meters Container */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <CircularScore
            score={review.balanceScore}
            label={scoreLabels.score1}
            color="#f59e0b"
          />
          <CircularScore
            score={review.formationScore}
            label={scoreLabels.score2}
            color="#3b82f6"
          />
        </div>

        {/* Content Box */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            background: "rgba(255, 255, 255, 0.015)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "32px",
          }}
        >
          {/* Tactical Comment */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#3b82f6",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Tactical Analysis
            </span>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#e2e2e2",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {review.tactical}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          {/* Roast Comment */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#ef4444",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "Inter, sans-serif",
              }}
            >
              The AI Roast
            </span>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#f87171",
                fontStyle: "italic",
                fontFamily: "Inter, sans-serif",
              }}
            >
              "{review.roast}"
            </p>
          </div>
        </div>

        {/* Play Again Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetGame}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            border: "none",
            borderRadius: "12px",
            color: "#0a0a0a",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.2)",
            transition: "box-shadow 0.2s",
          }}
        >
          🔄 Play Again
        </motion.button>
      </div>
    </motion.div>
  );
}
