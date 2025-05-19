import { useState } from "react";
import EntryForm from "./components/EntryForm";
import EntryList from "./components/EntryList";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Enata Light</h1>
      <p style={styles.subtitle}>Speak your mind. Get clarity.</p>

      <EntryForm onSubmitComplete={triggerRefresh} />
      <EntryList key={refreshKey} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "0.5rem",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "1.5rem",
  },
};

export default App;

