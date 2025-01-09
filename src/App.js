import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // Import papaparse library
import '../src/styles/App.css';  // Import external CSS file for styles
function App() {
  const sentencesFilePath = "/sentences8.csv";   //File path to load and read
  const [sentences, setSentences] = useState([]); // State to store sentences
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [completedSentences, setCompletedSentences] = useState([]); // Only store completed sentences
  const [speechFinished, setSpeechFinished] = useState(false);
  const [countdown, setCountdown] = useState(10); // Countdown for the 10-second delay
  const [showCountdown, setShowCountdown] = useState(false); // To control when to show countdown
  const [currentSentence, setCurrentSentence] = useState(""); // Track the current sentence to show after countdown
  const [voices, setVoices] = useState([]); // State for available voices
  const [progress, setProgress] = useState(0); // State for progress

  useEffect(() => {
    // Fetch available voices
    const handleVoiceChange = () => {
      const speechSynthesisVoices = speechSynthesis.getVoices();
      setVoices(speechSynthesisVoices);
    };

    handleVoiceChange(); // Initialize voices immediately
    window.speechSynthesis.onvoiceschanged = handleVoiceChange; // Listen for changes
  }, []);

  useEffect(() => {
    // Fetch CSV file and parse it
    Papa.parse(sentencesFilePath, {
      download: true, // Download the CSV file from the given URL
      complete: (result) => {
        const data = result.data.map(row => row[0]); // Assuming the sentences are in the first column
        setSentences(data);
      }
    });
  }, []);

  useEffect(() => {
    if (isReading && currentSentenceIndex < sentences.length) {
      const sentence = sentences[currentSentenceIndex];

      // Create SpeechSynthesisUtterance object and set properties
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.lang = currentSentenceIndex % 2 === 0 ? 'en-US' : 'en-GB'; // Randomize male/female voice

      // Read the sentence aloud
      speechSynthesis.speak(utterance);

      utterance.onend = () => {
        // Play system beep sound
        // const context = new (window.AudioContext || window.webkitAudioContext)();
        // const oscillator = context.createOscillator();
        // oscillator.type = 'sine'; // Type of sound
        // oscillator.frequency.setValueAtTime(200, context.currentTime); // Frequency of the beep (1000 Hz)
        // oscillator.connect(context.destination);
        // oscillator.start();
        // oscillator.stop(context.currentTime + 0.4); // Duration of beep (0.2 seconds)

        setShowCountdown(true);
        let timer = 10;
        let progressTimer = 10; // Initial duration for progress bar
        const countdownInterval = setInterval(() => {
          if (timer > 0) {
            setCountdown(timer);
            setProgress((progressTimer - timer) / progressTimer * 100); // Correct way to fill progress bar left to right
            timer -= 1;
          } else {
            clearInterval(countdownInterval);
            setCurrentSentence(sentence);
            setShowCountdown(false);
            setCountdown(10);

            // Add the current sentence to the completed sentences list
            setCompletedSentences((prev) => [...prev, sentence]);

            const repeatUtterance = new SpeechSynthesisUtterance(sentence);
            repeatUtterance.lang = utterance.lang;
            repeatUtterance.rate = 1;
            repeatUtterance.pitch = 1;
            repeatUtterance.volume = 1;
            speechSynthesis.speak(repeatUtterance);

            repeatUtterance.onend = () => {
              setTimeout(() => {
                setCurrentSentence("");  // Clear the current sentence after repeat
                setCurrentSentenceIndex((prev) => prev + 1);
                setSpeechFinished(true);
                setCompletedSentences([]); // Clear the table immediately after repeat
              }, 5000);
            };
          }
        }, 1000);
      };

      utterance.onerror = () => {
        setSpeechFinished(true);
      };
    }
  }, [isReading, currentSentenceIndex, voices, sentences]);

  const handleStart = () => {
    setSpeechFinished(false);
    setIsReading(true);
    setCurrentSentenceIndex(0);
    setCompletedSentences([]); // Reset completed sentences
    setProgress(0); // Reset progress bar
  };

  return (
    <div className="container">
      <div className="app-content">
        <h1>
          PTE Repeat Sentence Practice: {Math.min(currentSentenceIndex + 1, sentences.length)} / {sentences.length} Sentences
        </h1>
        {!isReading && (
          <button onClick={handleStart} className="btn start-btn">
            Start Reading
          </button>
        )}
        <h2>
          Note: Please repeat the sentence exactly as you hear it. You will hear a sentence.
        </h2>
        <h2>
          You will have 10 seconds to repeat the sentence. You will hear the sentence only once.
        </h2>
        <b><h2><p className="blue-text">After you repeated the sentence, you will again hear how the speaker has spoken exactly.</p></h2>
        </b>
        <div className="sentences-read">
          <table className="sentences-table">
            <thead>
              <tr>
                <th><center>Sentence</center></th>
              </tr>
            </thead>
            <tbody>
              {completedSentences.slice(-1).map((sentence, index) => (  // Only show the last completed sentence
                <tr key={index} className={`row-${index % 2 === 0 ? 'even' : 'odd'}`}>
                  <td><center>{sentence}</center></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showCountdown && (
          <div className="countdown-container">
            <h1>Start repeating the sentence, timer will end in {String(countdown).padStart(2, '0')} seconds...</h1>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              <div className="progress-text">{Math.round(progress)}%</div>
            </div>
          </div>
        )}

        {speechFinished && !showCountdown && currentSentence && (
          <div className="sentence-container">
            <h1>{currentSentence}</h1>
          </div>
        )}
      </div>
      {currentSentenceIndex === sentences.length && (
        <div className="thank-you-message">
          <h1 className="thank-you-title">🎉 Congratulations! 🎉</h1>
          <p className="thank-you-text">
            You've successfully completed all the sentences! Your dedication and effort are truly commendable.
            Thank you for staying focused and practicing with us. Wishing you the best of luck on your PTE exam.
            May you achieve the score you’ve been working so hard for. Keep up the great work, and remember —
            this is just the beginning of your success! 💪🔥🌟💯
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
