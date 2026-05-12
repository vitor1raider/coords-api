import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  showButtons?: boolean;
  confirmVariant?: "delete" | "primary";
  loading?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}

export function Modal({
  isOpen,
  title,
  children,
  confirmLabel,
  cancelLabel = "Cancelar",
  showCancel = true,
  showButtons = true,
  confirmVariant = "primary",
  loading = false,
  onConfirm,
  onClose,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass =
    confirmVariant === "delete"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-700";

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button type="button" className="cursor-pointer">
            <X
              size={16}
              className="text-neutral-700 hover:text-neutral-900"
              onClick={onClose}
            />
          </button>
        </div>

        <div className="mt-2 text-sm text-neutral-700">{children}</div>

        {showButtons && (
          <div className="mt-5 flex items-center justify-end gap-2">
            {showCancel && (
              <button
                type="button"
                className="cursor-pointer w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                onClick={onClose}
                disabled={loading}
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              className={`cursor-pointer w-full rounded-md px-3 py-2 text-sm text-white transition-colors focus:outline-none focus:ring-2 ${confirmButtonClass}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Processando..." : confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
