import React, { useState, useEffect } from 'react';
import '../styles/AudioRecorder.css';

const AudioRecorder = () => {
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 7, 100)); // Increment by 7% every second to reach 100% in 14 seconds
      }, 1000);

      return () => clearInterval(timer); // Cleanup the timer when the component unmounts
    }
  }, [isRecording]);

  return (
    <div className="audio-recorder">
      <h3>Audio Recorder</h3>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} className="progress"></div>
      </div>
    </div>
  );
};

export default AudioRecorder;
