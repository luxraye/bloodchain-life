import React, { forwardRef, useId } from 'react'
import type { InputState, InputFeedback } from '../Input/Input'
import '../Input/Input.css'
import './Select.css'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  annotation?: string
  options: SelectOption[]
  placeholder?: string
  state?: InputState
  feedback?: InputFeedback
  inputSize?: 'sm' | 'md' | 'lg'
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      annotation,
      options,
      placeholder = 'Select…',
      state = 'idle',
      feedback,
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

        <div className={['bc-input-wrap', `bc-input-wrap--${state}`, 'bc-select-wrap'].filter(Boolean).join(' ')}>
          <select
            ref={ref}
            id={id}
            className={['bc-input', 'bc-select', className].filter(Boolean).join(' ')}
            aria-invalid={state === 'error'}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="bc-select__chevron" aria-hidden="true">▾</span>
        </div>

        {feedbackText && (
          <div
            className={[
              'bc-input-feedback',
              `bc-input-feedback--${state === 'idle' ? 'hint' : state}`,
            ].join(' ')}
          >
            {feedbackText}
          </div>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
