import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";  // ✅ FIXED: Correct path
import "./App.css";
import ErrorBoundary from "./components/common/ErrorBoundary";
// Removed test imports - unnecessary in production

// Service worker registration disabled to avoid MIME type errors
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div style={{padding: 24}}>Loading application...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
);
