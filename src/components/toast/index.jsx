import { useCallback, useEffect } from "react";
import { FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, info: FiInfo, error: FiXCircle };
const Toasts = () => {
    const { toasts, setToasts } = useApp();
    const dismiss = useCallback(
        (id) =>
            setToasts((current) => current.filter((toast) => toast.id !== id)),
        [setToasts],
    );
    useEffect(() => {
        const timers = toasts.map((toast) =>
            window.setTimeout(() => dismiss(toast.id), 4800),
        );
        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, [toasts, dismiss]);
    return (
        <div
            className={styles.toastStack}
            aria-live="polite"
            aria-relevant="additions text"
        >
            {toasts.map((toast) => {
                const Icon = icons[toast.type] || FiInfo;
                return (
                    <div
                        key={toast.id}
                        className={`${styles.toast} ${styles[toast.type] || ""}`}
                        role="status"
                    >
                        <Icon aria-hidden="true" />
                        <span>{toast.message}</span>
                        <button
                            type="button"
                            onClick={() => dismiss(toast.id)}
                            aria-label="Dismiss notification"
                        >
                            <FiX aria-hidden="true" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Toasts;
