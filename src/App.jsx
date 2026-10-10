import AppRoutes from "./AppRoutes.jsx";
import ConfirmDialog from "./components/confirmDialog/index.jsx";
import DialogLayer from "./components/modal/index.jsx";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import Toasts from "./components/toast/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.app}>
        <a className={styles.skipLink} href="#main-content">
            Skip to content
        </a>
        <Header />
        <main className={styles.main} id="main-content">
            <AppRoutes />
        </main>
        <Footer />
        <DialogLayer />
        <ConfirmDialog />
        <Toasts />
    </div>
);

export default App;
