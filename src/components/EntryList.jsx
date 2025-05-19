import { useEffect, useState } from "react";
import { getLatestEntries } from "../firebase/firestoreUtils";

const EntryList = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const latest = await getLatestEntries();
      setEntries(latest);
    };
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {entries.length === 0 && <p style={styles.empty}>No entries yet.</p>}
      {entries.map((entry) => (
        <div key={entry.id} style={styles.card}>
          <p><strong>You:</strong> {entry.dump_text}</p>
          <p><strong>Summary:</strong> {entry.summary}</p>
          <p><strong>Next Step:</strong> {entry.next_step}</p>
          <p style={styles.timestamp}>
            {formatRelativeTimestamp(entry.timestamp?.seconds)}
          </p>
        </div>
      ))}
    </div>
  );
};

function formatRelativeTimestamp(seconds) {
  if (!seconds) return "";
  const now = new Date();
  const then = new Date(seconds * 1000);
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;

  // yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    then.getDate() === yesterday.getDate() &&
    then.getMonth() === yesterday.getMonth() &&
    then.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${then.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }

  // fallback
  return then.toLocaleString("default", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

const styles = {
  container: {
    padding: "16px",
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    backgroundColor: "#f9f9f9",
  },
  timestamp: {
    fontSize: "0.8rem",
    color: "#666",
    marginTop: "8px",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
  },
};

export default EntryList;


