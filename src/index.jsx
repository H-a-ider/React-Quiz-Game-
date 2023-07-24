import ReactDOM from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");

// Use createRoot to render your App component
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
