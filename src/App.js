import React, { useState } from 'react';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speech, setSpeech] = useState('');

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (typeof SpeechRecognition === 'undefined') {
      console.error('Speech Recognition API not supported');
      alert('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      console.log('Transcript received:', currentTranscript);
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      alert('Error occurred in speech recognition: ' + event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      console.log('Started listening');
    } else {
      recognition.stop();
      setIsListening(false);
      console.log('Stopped listening');
    }
  };

  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(speech);

    utterance.onstart = () => {
      console.log('Speech synthesis started');
    };

    utterance.onend = () => {
      console.log('Speech synthesis ended');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      alert('Error occurred in speech synthesis: ' + event.error);
    };

    synth.speak(utterance);
  };

  return (
    <div className="App">
      <h1>Speech-to-Text and Text-to-Speech Interface</h1>
      <div className="stt-container">
        <h2>Speech-to-Text</h2>
        <button className={`listen-button ${isListening ? 'active' : ''}`} onClick={handleListen}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <p className="transcript">{transcript}</p>
      </div>
      <div className="tts-container">
        <h2>Text-to-Speech</h2>
        <textarea
          rows="4"
          cols="50"
          value={speech}
          onChange={(e) => setSpeech(e.target.value)}
          placeholder="Enter text to speak..."
        />
        <br />
        <button className="speak-button" onClick={handleSpeak}>Speak</button>
      </div>
    </div>
  );
}

export default App;
