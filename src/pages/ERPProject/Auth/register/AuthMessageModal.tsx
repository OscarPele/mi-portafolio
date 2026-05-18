import { useEffect, useId, useRef } from "react";

type AuthMessageModalProps = {
  open: boolean;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
};

export default function AuthMessageModal({
  open,
  title,
  message,
  actionLabel,
  onAction,
}: AuthMessageModalProps) {
  const titleId = useId();
  const messageId = useId();
  const actionRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const timeoutId = window.setTimeout(() => {
      actionRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onAction();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onAction]);

  if (!open) return null;

  const onBackdropPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onAction();
  };

  return (
    <div
      className="auth-modal__backdrop"
      onPointerDown={onBackdropPointerDown}
      role="presentation"
    >
      <div
        className="auth-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <div className="auth-modal__header">
          <h2 id={titleId} className="auth-modal__title">
            {title}
          </h2>
        </div>

        <div className="auth-modal__body">
          <p id={messageId} className="auth-modal__message">
            {message}
          </p>
        </div>

        <div className="auth-modal__actions">
          <button
            ref={actionRef}
            type="button"
            className="auth-modal__action auth-button auth-button--md auth-button--text-md auth-button--primary"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
