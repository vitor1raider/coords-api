import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

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
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const confirmButtonClass =
    confirmVariant === "delete"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-700";
  const hasCompactButtons = confirmVariant === "delete";

  return (
    <div
      className="fixed inset-0 z-9999 flex animate-[fade-in_.16s_ease-out] items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-[modal-in_.2s_ease-out] rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-[Manrope] text-lg font-bold tracking-tight text-neutral-900">
            {title}
          </h2>
          <button
            type="button"
            className="grid cursor-pointer place-items-center rounded-lg border-0 bg-transparent p-2 text-[#718078] hover:bg-[#008a59]/8 hover:text-[#17202a]"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 text-sm leading-relaxed text-neutral-600">
          {children}
        </div>

        {showButtons && (
          <div className="mt-5 flex items-center justify-end gap-2">
            {showCancel && (
              <button
                type="button"
                className={`w-full cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 ${hasCompactButtons ? "py-1.5" : "py-2.5"}`}
                onClick={onClose}
                disabled={loading}
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              className={`w-full cursor-pointer rounded-lg px-3 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 ${hasCompactButtons ? "py-1.5" : "py-2.5"} ${confirmButtonClass}`}
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
