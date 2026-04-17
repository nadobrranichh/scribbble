import { RouterProvider } from "react-router";
import "./App.css";
import { router } from "./router";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
