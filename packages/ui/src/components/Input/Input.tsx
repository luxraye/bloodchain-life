import React, { forwardRef, useId } from 'react'
import './Input.css'

export type InputState = 'idle' | 'focused' | 'valid' | 'error' | 'warning'

export interface InputFeedback {
  /**
   * Always-visible hint shown below the field (format, example, constraint).
   * Shown in muted text when idle. Replaced by message when state changes.
   */
  hint?: string
  /** Message shown when state = 'valid' */
  valid?: string
  /** Message shown when state = 'error' */
  error?: string
  /** Message shown when state = 'warning' */
  warning?: string
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  /** Short annotation top-right of label (e.g. "Format: BC-YYYY-NNNNNN") */
  annotation?: string
  state?: InputState
  feedback?: InputFeedback
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  /** Size variant */
  inputSize?: 'sm' | 'md' | 'lg'
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      annotation,
      state = 'idle',
      feedback,
      iconLeft,
      iconRight,
      inputSize = 'md',
      containerClassName = '',
      className = '',
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    const feedbackText =
      state === 'valid'   ? feedback?.valid   :
      state === 'error'   ? feedback?.error   :
      state === 'warning' ? feedback?.warning :
      feedback?.hint

    const feedbackIcon =
      state === 'valid'   ? '✓' :
      state === 'error'   ? '✕' :
      state === 'warning' ? '⚠' :
      null

    return (
      <div
        className={[
          'bc-input-group',
          `bc-input-group--${inputSize}`,
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {(label || annotation) && (
          <div className="bc-input-group__header">
            {label && (
              <label className="bc-input-group__label" htmlFor={id}>
                {label}
              </label>
            )}
            {annotation && (
              <span className="bc-input-group__annotation">{annotation}</span>
            )}
          </div>
        )}

        <div className={[
          'bc-input-wrap',
          `bc-input-wrap--${state}`,
          iconLeft  ? 'bc-input-wrap--icon-left'  : '',
          iconRight ? 'bc-input-wrap--icon-right' : '',
        ].filter(Boolean).join(' ')}>
          {iconLeft && (
            <span className="bc-input-icon bc-input-icon--left" aria-hidden="true">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={['bc-input', className].filter(Boolean).join(' ')}
            aria-invalid={state === 'error'}
            aria-describedby={feedbackText ? `${id}-feedback` : undefined}
            {...rest}
          />
          {iconRight && (
            <span className="bc-input-icon bc-input-icon--right" aria-hidden="true">
              {iconRight}
            </span>
          )}
        </div>

        {feedbackText && (
          <div
            id={`${id}-feedback`}
            className={[
              'bc-input-feedback',
              `bc-input-feedback--${state === 'idle' ? 'hint' : state}`,
            ].join(' ')}
            role={state === 'error' ? 'alert' : undefined}
          >
            {feedbackIcon && (
              <span className="bc-input-feedback__icon" aria-hidden="true">
                {feedbackIcon}
              </span>
            )}
            {feedbackText}
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
