import React, { useState, useEffect } from 'react';
import './styles/App.css';
import AudioPlayer from './components/AudioPlayer';
import AudioRecorder from './components/AudioRecorder';
import SentenceDisplay from './components/SentenceDisplay';
import TitleSection from './components/TitleSection';
import { readCSV } from './utils/csvUtils';

const App = () => {
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadSentences = async () => {
      //const data = await readCSV('/assets/sentences.csv');
      const data = [
        "The quick brown fox jumps over the lazy dog.",
        "React is a powerful library for building user interfaces.",
        "Open-source technologies drive innovation.",
        "Learning to code is a valuable skill in the modern world."
      ];
      setSentences(data);
    };
    loadSentences();
  }, []);

  const handleNextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="app">
      <TitleSection sentenceCount={currentIndex + 1} totalCount={sentences.length} />
      <div className="content">
        <div className="left-tile">
          <AudioPlayer sentence={sentences[currentIndex]} onSentenceFinish={handleNextSentence} />
        </div>
        <div className="right-tile">
          <AudioRecorder />
        </div>
      </div>
      {/* <SentenceDisplay sentence={sentences[currentIndex]} /> */}
    </div>
  );
};

export default App;
