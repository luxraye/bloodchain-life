import React, { createContext, useContext, useId, useState } from 'react'
import './Accordion.css'

/* ── Context ────────────────────────────────────────────────────────── */
interface AccordionCtx {
  openItems: Set<string>
  toggle: (id: string) => void
  allowMultiple: boolean
}

const Ctx = createContext<AccordionCtx | null>(null)

function useAccordionCtx() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('<AccordionItem> must be inside <Accordion>')
  return ctx
}

/* ── Root ───────────────────────────────────────────────────────────── */
export interface AccordionProps {
  /** Allow multiple items open simultaneously */
  allowMultiple?: boolean
  /** Item IDs to open by default */
  defaultOpen?: string[]
  children: React.ReactNode
  className?: string
}

export function Accordion({
  allowMultiple = false,
  defaultOpen = [],
  children,
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpen),
  )

  function toggle(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <Ctx.Provider value={{ openItems, toggle, allowMultiple }}>
      <div className={['bc-accordion', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

/* ── Item ───────────────────────────────────────────────────────────── */
export interface AccordionItemProps {
  /** Must be unique within the Accordion */
  itemId?: string
  title: React.ReactNode
  /** Optional right-side element in the header (e.g. a badge) */
  aside?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AccordionItem({
  itemId: itemIdProp,
  title,
  aside,
  children,
  className = '',
}: AccordionItemProps) {
  const generatedId = useId()
  const itemId = itemIdProp ?? generatedId
  const { openItems, toggle } = useAccordionCtx()
  const isOpen = openItems.has(itemId)

  const headId  = `${itemId}-head`
  const bodyId  = `${itemId}-body`

  return (
    <div
      className={[
        'bc-accordion__item',
        isOpen ? 'bc-accordion__item--open' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        id={headId}
        className="bc-accordion__trigger"
        aria-expanded={isOpen}
        aria-controls={bodyId}
        onClick={() => toggle(itemId)}
      >
        <span className="bc-accordion__title">{title}</span>
        <span className="bc-accordion__aside">
          {aside}
          <span className="bc-accordion__chevron" aria-hidden="true">
            ▾
          </span>
        </span>
      </button>

      <div
        id={bodyId}
        role="region"
        aria-labelledby={headId}
        className={[
          'bc-accordion__body',
          isOpen ? 'bc-accordion__body--open' : '',
        ].join(' ')}
      >
        <div className="bc-accordion__content">{children}</div>
      </div>
    </div>
  )
}
