import React from "react";

const ProgressBar = ({ timer, maxTime }) => {
  const progress = ((maxTime - timer) / maxTime) * 100; // Calculate progress from left to right
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
