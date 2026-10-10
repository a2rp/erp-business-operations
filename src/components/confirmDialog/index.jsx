import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const ConfirmDialog = () => {
    const { dialog, closeDialog } = useApp();
    const cancelRef = useRef(null);
    const dialogRef = useRef(null);
    const isOpen = dialog?.type === "confirm";

    useEffect(() => {
        if (!isOpen) return undefined;
        cancelRef.current?.focus();
        const onKey = (event) => {
            if (event.key === "Escape") closeDialog();
            if (event.key === "Tab") {
                const controls = Array.from(
                    dialogRef.current?.querySelectorAll(
                        "button:not([disabled])",
                    ) || [],
                );
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, closeDialog]);

    if (!isOpen) return null;
    const {
        title = "Confirm removal",
        message = "This change cannot be undone.",
        confirmLabel = "Remove",
        onConfirm,
    } = dialog.data;
    const confirm = () => {
        onConfirm?.();
        closeDialog();
    };

    return (
        <div
            className={styles.backdrop}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeDialog();
            }}
        >
            <section
                ref={dialogRef}
                className={styles.confirm}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-description"
            >
                <div className={styles.icon}>
                    <FiAlertTriangle aria-hidden="true" />
                </div>
                <button
                    className={styles.close}
                    type="button"
                    onClick={closeDialog}
                    aria-label="Close dialog"
                >
                    <FiX aria-hidden="true" />
                </button>
                <h2 id="confirm-title">{title}</h2>
                <p id="confirm-description">{message}</p>
                <div className={styles.actions}>
                    <button ref={cancelRef} type="button" onClick={closeDialog}>
                        Cancel
                    </button>
                    <button
                        className={styles.destructive}
                        type="button"
                        onClick={confirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ConfirmDialog;
