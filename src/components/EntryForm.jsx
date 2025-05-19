import { useState } from "react";
import { addEntry } from "../firebase/firestoreUtils";
import VoiceInput from "./VoiceInput";

const EntryForm = ({ onSubmitComplete }) => {
  const [dumpText, setDumpText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dumpText.trim()) return;
    setLoading(true);

    console.log("🔑 OpenAI key in use:", import.meta.env.VITE_OPENAI_KEY);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `
ONLY respond in strict JSON like this:

{
  "summary": "How the user is feeling...",
  "next_step": "One or two helpful next actions..."
}

DO NOT write anything else. No commentary. No markdown. No intro. No closing.
              `.trim()
            },
            {
              role: "user",
              content: "Example dump: I’m overwhelmed and behind on everything."
            },
            {
              role: "assistant",
              content: `{
  "summary": "You’re feeling overwhelmed by everything piling up, and it's weighing heavily on your focus.",
  "next_step": "Take 10 minutes to list out 3 priorities and knock out one small task to regain momentum."
}`
            },
            {
              role: "user",
              content: dumpText.trim()
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      console.log("🧠 Full OpenAI raw response:", data);

      if (data?.error) {
        console.error("❌ OpenAI API error:", data.error);
        alert(`OpenAI Error: ${data.error.message}`);
        throw new Error("OpenAI API returned an error");
      }

      const raw = data?.choices?.[0]?.message?.content;
      if (!raw) {
        console.error("❌ GPT returned no content. Raw response:", data);
        alert("GPT returned no content. Check your prompt or key.");
        throw new Error("No GPT response content");
      }

      let result;
      try {
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}") + 1;
        const sliced = raw.slice(start, end);
        result = JSON.parse(sliced);
      } catch (err) {
        console.error("❌ Failed to parse GPT response:", raw);
        alert("GPT response was not valid JSON. See console.");
        throw new Error("Invalid GPT response format");
      }

      if (!result.summary || !result.next_step) {
        console.error("❌ Missing keys in GPT result:", result);
        alert("GPT response missing expected fields.");
        throw new Error("Incomplete GPT result");
      }

      await addEntry(dumpText, result.summary, result.next_step);
      setDumpText("");
      if (onSubmitComplete) onSubmitComplete();

    } catch (err) {
      console.error("❌ Failed to process entry:", err);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <VoiceInput onTranscript={setDumpText} />
      <textarea
        value={dumpText}
        onChange={(e) => setDumpText(e.target.value)}
        placeholder="Type what's on your mind..."
        rows={6}
        style={styles.textarea}
      />
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Processing..." : "Submit"}
      </button>
    </form>
  );
};

const styles = {
  form: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  textarea: {
    width: "100%",
    fontSize: "1rem",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    fontSize: "1rem",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};

export default EntryForm;

