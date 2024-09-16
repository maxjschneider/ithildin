import "./App.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

import { AuthenticationForm } from "./components/AuthenticationForm.tsx";

function App() {
  return (
    <MantineProvider>
      <AuthenticationForm />
    </MantineProvider>
  );
}

export default App;
