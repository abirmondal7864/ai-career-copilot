import { useEffect, useState } from "react";
import { healthCheck } from "./api/api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    healthCheck()
      .then((data) => {
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus("Backend connection failed");
      });
  }, []);

  return (
    <div>
      <h1>AI Career Copilot</h1>
      <p>{backendStatus}</p>
    </div>
  );
}

export default App;