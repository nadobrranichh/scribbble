import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "../pages/LandingPage";
import AppLayout from "../components/AppLayout";
import CanvasPage from "../pages/CanvasPage";
import JoinPage from "../pages/JoinPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "room",
        element: <CanvasPage />,
      },
      {
        path: "join",
        element: <JoinPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
