export const speakSentence = (sentence, voiceType = 'female') => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis is not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(sentence);

  // Get available voices
  const voices = window.speechSynthesis.getVoices();

  // Filter voices based on the specified type
  const selectedVoice = voices.find((voice) =>
    voiceType === 'male'
      ? voice.name.toLowerCase().includes('male') || voice.gender === 'male'
      : voice.name.toLowerCase().includes('female') || voice.gender === 'female'
  );

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else {
    console.warn(`No ${voiceType} voice found. Using default voice.`);
  }

  // Speak the sentence
  window.speechSynthesis.speak(utterance);
};
