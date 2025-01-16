import React from 'react';
import '../styles/SentenceDisplay.css';

const SentenceDisplay = ({ sentence }) => {
  return (
    <div className="sentence-display">
      <h3>Sentence</h3>
      <p>{sentence}</p>
    </div>
  );
};

export default SentenceDisplay;
