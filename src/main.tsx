import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./src/i18n/config";

// Enable MSW for mocking
import { worker } from "./src/mocks/browser";

async function startApp() {
  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
    });
  } catch (error) {
    console.error('Failed to start MSW:', error);
  }
  
  createRoot(document.getElementById("root")!).render(<App />);
}

startApp().catch(console.error);