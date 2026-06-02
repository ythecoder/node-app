import { useState } from "react";
import Header from "./Header";
import "./Experiments.css";

export default function Experiments() {
  const [text, setText] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <>
      <Header />
      <div className={`experiments-container ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
        {/* Theme Toggle */}
        <div className="theme-toggle-section">
          <label htmlFor="theme-toggle" className="theme-label">
            <input
              id="theme-toggle"
              type="checkbox"
              checked={isDarkTheme}
              onChange={(e) => setIsDarkTheme(e.target.checked)}
              className="theme-checkbox"
            />
            <span className="toggle-text">
              {isDarkTheme ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </span>
          </label>
        </div>

        {/* Experiment 1: Textbox and label learning */}
        <div className="experiment-section">
          <h3 className="experiment-title">Textbox and label learning</h3>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            className="experiment-input"
          />
          <p className="experiment-display">
            <strong>Display:</strong> {text}
          </p>
        </div>

        {/* Experiment 2: Theme Changer Demo */}
        <div className="experiment-section">
          <h3 className="experiment-title">Theme Changer Demo</h3>
          <p className="demo-text">
            This page demonstrates a simple light/dark theme toggle. 
            Use the checkbox at the top to switch between themes!
          </p>
          <div className="theme-demo-box">
            <p>This is a demo box that changes with the theme</p>
          </div>
        </div>
      </div>
    </>
  );
}