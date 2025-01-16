import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { speakSentence } from '../utils/speech'; // Ensure this utility supports voice alternation

const SentenceReader = () => {
  const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "React is a powerful library for building user interfaces.",
    "Open-source technologies drive innovation.",
    "Learning to code is a valuable skill in the modern world."
  ];

  const [currentSentence, setCurrentSentence] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [countdownTimer, setCountdownTimer] = useState(5); // Initial 5-second countdown
  const [recordingTimer, setRecordingTimer] = useState(5); // 5-second recording
  const [stage, setStage] = useState('countdown'); // Stages: 'countdown', 'reading', 'recording', 'displaying'
  const [displayedSentence, setDisplayedSentence] = useState(''); // Sentence to display after recording
  const [completed, setCompleted] = useState(false); // Completion flag

  useEffect(() => {
    if (sentenceIndex < sentences.length) {
      setCurrentSentence(sentences[sentenceIndex]);
    } else {
      setCompleted(true); // Mark as completed when all sentences are processed
    }
  }, [sentenceIndex]);

  useEffect(() => {
    if (stage === 'countdown' && countdownTimer > 0) {
      const interval = setInterval(() => {
        setCountdownTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (stage === 'countdown' && countdownTimer === 0) {
      setStage('reading');
    }
  }, [stage, countdownTimer]);

  useEffect(() => {
    if (stage === 'reading') {
      const voice = sentenceIndex % 2 === 0 ? 'male' : 'female'; // Alternate voices
      speakSentence(currentSentence, voice); // Speak the current sentence with specified voice
      const timer = setTimeout(() => {
        setStage('recording');
      }, 5000); // 5 seconds for reading
      return () => clearTimeout(timer);
    }
  }, [stage, currentSentence, sentenceIndex]);

  useEffect(() => {
    if (stage === 'recording' && recordingTimer > 0) {
      const interval = setInterval(() => {
        setRecordingTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (stage === 'recording' && recordingTimer === 0) {
      setStage('displaying');
      setDisplayedSentence(currentSentence); // Display the sentence
    }
  }, [stage, recordingTimer]);

  const moveToNextSentence = () => {
    if (sentenceIndex < sentences.length - 1) {
      setSentenceIndex((prevIndex) => prevIndex + 1);
      setStage('countdown');
      setCountdownTimer(5); // Reset the countdown timer
      setRecordingTimer(15); // Reset the recording timer
      setDisplayedSentence(''); // Clear the displayed sentence
    }
  };

  return (
    <div className="sentence-reader">
      <h1>
        Sentence {sentenceIndex + 1} / {sentences.length}
      </h1>

      <p>
        Note: Please repeat the sentence exactly as you hear it. You will hear a sentence. You will hear the sentence only once.
      </p>

      {!completed && (
        <div className="tiles">
          {/* Left Tile - Countdown or Reading */}
          <div className="tile left-tile">
            {stage === 'countdown' && <h2>Get Ready</h2>}
            {stage === 'reading' && <h2>Reading Sentence</h2>}
            <ProgressBar timer={countdownTimer} maxTime={5} />
            {stage === 'countdown' && <p>Time left: {countdownTimer} seconds</p>}
            {stage === 'reading' && <p>Listening...</p>}
          </div>

          {/* Right Tile - Recording */}
          <div className="tile right-tile">
            <h2>{stage === 'recording' ? 'Recording Started' : 'Recording'}</h2>
            <ProgressBar timer={recordingTimer} maxTime={5} />
            {stage === 'recording' && <p>Recording time left: {recordingTimer} seconds</p>}
          </div>
        </div>
      )}

      {/* Sentence Display Section */}
      {stage === 'displaying' && !completed && (
        <div className="sentence-display">
          <h2>Sentence</h2>
          <p>{displayedSentence}</p>
          <button onClick={moveToNextSentence}>Next Sentence</button>
        </div>
      )}

      {/* Completion Message */}
      {completed && (
        <div className="completion-message">
          <h2>All sentences have been processed!</h2>
          <p>Thank you for completing the session.</p>
        </div>
      )}
    </div>
  );
};

export default SentenceReader;
