import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "../src/styles/App.css";

function App() {
  const countDown = 5;
  const sentencesFilePath = "sentences/ra01.csv"; // File path to load and read
  const [sentences, setSentences] = useState([]); // State to store sentences
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [timer, setTimer] = useState(countDown); // Timer for the initial title and recording phases
  const [isInitialPhase, setIsInitialPhase] = useState(true); // Controls initial title card phase
  const [isRecordingPhase, setIsRecordingPhase] = useState(false); // Controls recording phase
  const [currentSentence, setCurrentSentence] = useState(""); // Track the current sentence
  const [progress, setProgress] = useState(0); // State for progress
  const [showAnswer, setshowAnswer] = useState(false);
  const [isComplete, setIsComplete] = useState(false); // Track completion status

  useEffect(() => {
    // Fetch CSV file and parse it
    Papa.parse(sentencesFilePath, {
      download: true,
      skipEmptyLines: true, // Skip any empty lines in the CSV
      complete: (result) => {
        const data = result.data
          .map(row => row.join(',').trim())  // Join row elements (if any) and trim spaces
          .join('\n')  // Join all rows with a newline character
          .split('\n'); // Split the string into an array by new lines

        setSentences(data);
      },
    });
  }, []);

  useEffect(() => {
    if (currentSentenceIndex < sentences.length) {
      setCurrentSentence(sentences[currentSentenceIndex]);
    }
  }, [currentSentenceIndex, sentences]);

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        setProgress(((countDown - timer + 1) / countDown) * 100); // Update progress
      }, 1000);
    } else {
      clearInterval(interval);

      if (isInitialPhase) {
        // Transition from initial phase to recording phase
        setshowAnswer(false);
        setIsInitialPhase(false);
        setIsRecordingPhase(true);
        setTimer(countDown);
        setProgress(0);
      } else if (isRecordingPhase) {
        // Transition from recording phase to playback phase
        setIsRecordingPhase(false);
        setshowAnswer(true);
        playSentence();
      }
    }

    return () => clearInterval(interval);
  }, [timer, isInitialPhase, isRecordingPhase, showAnswer]);

  const playSentence = () => {
    speechSynthesis.cancel(); // Clear any existing utterances
    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = currentSentenceIndex % 2 === 0 ? 'en-US' : 'en-GB'; // Randomize male/female voice
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      if (currentSentenceIndex + 1 >= sentences.length) {
        // Mark as complete when all sentences are read
        setIsComplete(true);
      } else {
        setshowAnswer(false);
        setCurrentSentenceIndex((prev) => prev + 1);
        setTimer(countDown);
        setProgress(0);
        setIsInitialPhase(true); // Restart the cycle for the next sentence
      }
    };
  };

  const handleStart = () => {
    setCurrentSentenceIndex(0);
    setTimer(countDown);
    setProgress(0);
    setIsInitialPhase(true);
  };

  return (
    <div className="container">
      <h1>PTE Read Aloud Practice : {Math.min(currentSentenceIndex + 1, sentences.length)} / {sentences.length} Sentences</h1>
      <div className="instructions" style={{ textAlign: "left", width: "100%", marginBottom: "20px" }}>
        <b>
          <h4>
            Instructions: Look at the paragraph below. In 40 seconds, read this text aloud as
            naturally and clearly as possible. You have 40 seconds to prepare. You get only 1 chance
            to record in the real exam.
          </h4>
        </b>
      </div>

      <div className="app-content">
        {isInitialPhase && !isComplete && (
          <div className="phase-card">
            <div className="timer-card">
              <h2>Recording will start in {String(timer).padStart(2, "0")} seconds.</h2>
              <div className="timer-bar">
                <div
                  className="timer-bar-fill"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "#4caf50",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {isRecordingPhase  && !isComplete && (
          <div className="phase-card">
            <div className="timer-card">
              <h2>Recording Started. {String(timer).padStart(2, "0")} seconds remaining...</h2>
              <div className="timer-bar">
                <div
                  className="timer-bar-fill"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "#f44336",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {showAnswer  && !isComplete && (
          <div className="phase-card">
            <div className="timer-card">
              <h2 className="blue-text">Now, pay close attention to how you read aloud and compare it with how the speaker reads.</h2>
              <div></div>
            </div>
          </div>
        )}
        <br />
        <br />
        {!isComplete && (
        <div className="sentence-card">
          <h3>{currentSentence}</h3>
        </div>
         )}
        {isComplete && (
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
    </div>
  );
}

export default App;
