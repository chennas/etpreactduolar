import React from 'react';
import '../styles/TitleSection.css';

const TitleSection = ({ sentenceCount, totalCount }) => {
  return (
    <div className="title-section">
      <h1>PTE Repeat Sentence </h1>
      <h2>{sentenceCount} / {totalCount}</h2>
      <p>Note: Please repeat the sentence exactly as you hear it. You will hear a sentence. You will hear the sentence only once.</p>
    </div>
  );
};

export default TitleSection;
