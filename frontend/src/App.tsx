import { useState } from "react";
import reactLogo from "./assets/favicon-32x32.png";
import appLogo from "/favicon.ico";
import PWABadge from "./PWABadge.tsx";
import "./App.css";

async function testFunc() {
  const response = await fetch(import.meta.env.VITE_SERVER + "/cookies", {
    method: "GET",
    headers: {
      Authorization: "Basic abcd:xyzd",
    },
    credentials: "include",
  });

  const msg = await response.json();
  console.log(msg);
}

function App() {
  const [count, setCount] = useState(0);

  testFunc();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={appLogo} className="logo" alt="Ithildin logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Ithildin</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <PWABadge />
    </>
  );
}

export default App;
