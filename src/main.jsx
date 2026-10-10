import { createRoot } from "react-dom/client";
import { OverlayScrollbars } from "overlayscrollbars";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/appContext.jsx";
import App from "./App.jsx";
import "./index.css";

OverlayScrollbars(document.body, {
    scrollbars: {
        theme: "os-theme-ledgerly",
        autoHide: "move",
        autoHideSuspend: false,
    },
});

createRoot(document.getElementById("root")).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppProvider>
            <App />
        </AppProvider>
    </BrowserRouter>,
);
