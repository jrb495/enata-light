import { useState, useEffect } from "react";

const VoiceInput = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const [support, setSupport] = useState(true);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setSupport(false);
    }
  }, []);

  const toggleListening = () => {
    if (!support) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎙️ Voice captured:", transcript);
      onTranscript(transcript);
    };

    recognition.start();
  };

  if (!support) return null;

  return (
    <button
      onClick={toggleListening}
      style={{
        backgroundColor: listening ? "#d9534f" : "#007bff",
        color: "#fff",
        padding: "10px 16px",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "none",
        marginBottom: "12px",
        cursor: "pointer"
      }}
    >
      {listening ? "Listening..." : "🎙️ Speak your thought"}
    </button>
  );
};

export default VoiceInput;
