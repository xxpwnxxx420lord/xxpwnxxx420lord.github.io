import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1>Welcome to My Single File Next.js Page</h1>
      <p>Button clicked {count} times</p>
      <button 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginTop: "10px" }} 
        onClick={() => setCount(count + 1)}
      >
        Click Me
      </button>
    </main>
  );
}
