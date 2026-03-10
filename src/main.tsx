import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";
import { store } from "./app/store";
import "./index.css";
import ResponseAlert from "./components/common/ResponseAlert";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ResponseAlert />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);