import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-screen w-screen flex flex-col">
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
);
