"use client";
import "./gif.css";

export default function Gif() {
  return (
    <div className="ai-container">
      {/* INPUTS */}
      <div className="column">
        <p className="title">Input</p>
        <div className="node small"></div>
        <div className="node small"></div>
        <div className="node small"></div>
      </div>

      {/* PREPROCESS */}
      <div className="column">
        <p className="title">Preprocess</p>
        <div className="node medium gears"></div>
      </div>

      {/* MODEL */}
      <div className="column">
        <p className="title">AI Model</p>
        <div className="node large brain"></div>
      </div>

      {/* OUTPUT */}
      <div className="column">
        <p className="title">Output</p>
        <div className="node medium"></div>
      </div>

      {/* ANIMATED PATHS */}
      <svg className="lines">
        <path className="flow" d="M80 80 C160 80, 240 80, 320 80" />
        <path className="flow" d="M80 130 C160 130, 240 130, 320 130" />
        <path className="flow" d="M80 180 C160 180, 240 180, 320 180" />

        {/* preprocess → model */}
        <path className="flow2" d="M440 130 C520 130, 600 130, 680 130" />

        {/* model → output */}
        <path className="flow3" d="M800 130 C880 130, 960 130, 1040 130" />
      </svg>
    </div>
  );
}
