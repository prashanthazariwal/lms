import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";
import App from "./App.jsx";

/**
 * Redux Provider Setup
 *
 * What is Provider?
 * - Provider is a React component that makes Redux store available to all child components
 * - It wraps your entire app
 * - Any component can now access the store using hooks (useSelector, useDispatch)
 *
 * Why wrap the entire app?
 * - So that any component, at any level, can access the global state
 * - No need to pass props down through many components (props drilling)
 */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
