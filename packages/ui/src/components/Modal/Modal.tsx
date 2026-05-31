import React, { useEffect, useRef } from 'react'
import './Modal.css'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  size?: ModalSize
  /** Prevent closing by clicking the backdrop */
  persistent?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  persistent = false,
  children,
  footer,
  className = '',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sync open state with <dialog>
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  // Close on native Escape
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handler = (e: Event) => {
      e.preventDefault()
      if (!persistent) onClose()
    }
    el.addEventListener('cancel', handler)
    return () => el.removeEventListener('cancel', handler)
  }, [onClose, persistent])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (persistent) return
    const rect = dialogRef.current?.getBoundingClientRect()
    if (!rect) return
    const { clientX: x, clientY: y } = e
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={[
        'bc-modal',
        `bc-modal--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleBackdropClick}
    >
      {/* Header */}
      {(title || !persistent) && (
        <div className="bc-modal__header">
          {title && (
            <div>
              <h2 className="bc-modal__title">{title}</h2>
              {description && (
                <p className="bc-modal__description">{description}</p>
              )}
            </div>
          )}
          {!persistent && (
            <button
              className="bc-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Body */}
      <div className="bc-modal__body">{children}</div>

      {/* Footer */}
      {footer && <div className="bc-modal__footer">{footer}</div>}
    </dialog>
  )
}
