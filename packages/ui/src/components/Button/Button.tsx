import React, { forwardRef } from 'react'
import './Button.css'

export type ButtonVariant =
  | 'primary'    // burgundy filled — primary actions
  | 'azure'      // azure outlined — secondary / view actions
  | 'ghost'      // neutral outlined — cancel / tertiary
  | 'success'    // neon green outlined — approve / confirm clinical actions
  | 'danger'     // neon red outlined — discard / reject / irreversible actions
  | 'glass'      // glass surface — toolbar / icon buttons

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      'bc-btn',
      `bc-btn--${variant}`,
      `bc-btn--${size}`,
      fullWidth ? 'bc-btn--full' : '',
      loading ? 'bc-btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...rest}
      >
        {loading && <span className="bc-btn__spinner" aria-hidden="true" />}
        {!loading && iconLeft && (
          <span className="bc-btn__icon bc-btn__icon--left" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        {children && <span className="bc-btn__label">{children}</span>}
        {!loading && iconRight && (
          <span className="bc-btn__icon bc-btn__icon--right" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
