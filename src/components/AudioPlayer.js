import React, { useEffect, useState } from 'react';
import '../styles/AudioPlayer.css';

const AudioPlayer = ({ sentence, onSentenceFinish }) => {
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(5); // Countdown starts from 5 seconds
  const [isReading, setIsReading] = useState(false); // Flag to indicate reading state
  const [showSentence, setShowSentence] = useState(false); // Flag to show sentence after reading

  useEffect(() => {
    if (!sentence) return; // Don't start if there's no sentence

    // Reset progress and countdown for the next sentence
    setProgress(0);
    setCountdown(5);
    setIsReading(false);
    setShowSentence(false);

    // Countdown timer that runs every second
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1; // Decrease countdown
        } else {
          clearInterval(countdownTimer); // Stop the countdown
          startReadingSentence(); // Start reading the sentence once the countdown ends
          return 0; // Ensure countdown is at 0
        }
      });
    }, 1000);

    return () => clearInterval(countdownTimer); // Cleanup on component unmount
  }, [sentence]); // Re-run the effect when a new sentence is provided

  const startReadingSentence = () => {
    debugger;
    setIsReading(true); // Indicate that the sentence is being read

    const voice = new SpeechSynthesisUtterance(sentence);
    voice.lang = Math.random() > 0.5 ? 'en-US' : 'en-GB'; // Randomize male/female voice

    window.speechSynthesis.speak(voice); // Start reading the sentence

    // Update progress bar while reading
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1; // Increase progress until 100%
        clearInterval(progressTimer); // Stop the progress once it reaches 100%
        return prev;
      });
    }, 100);

    // When speech ends, notify the parent to move to the next sentence
    voice.onend = () => {
      setIsReading(false); // Stop the reading state
      setShowSentence(true); // Show the sentence after reading is complete
      onSentenceFinish(); // Notify that reading is done
    };
  };

  return (
    <div className="audio-player">
      <h3>Audio Player</h3>
      <div className="countdown">
        {countdown > 0 ? (
          <p>Starting in {countdown} seconds...</p> // Show countdown
        ) : isReading ? (
          <p>Reading...</p> // Do not show sentence while reading
        ) : (
          <p>Ready to read</p> // Initial state when ready to read
        )}
      </div>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} className="progress"></div>
      </div>
    </div>
  );
};

export default AudioPlayer;
