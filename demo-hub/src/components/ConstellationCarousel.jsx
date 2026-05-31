import { useCallback, useEffect, useRef, useState } from 'react'
import CarouselAppCard from './CarouselAppCard'
import ConstellationDetailPanel from './ConstellationDetailPanel'

const AUTO_INTERVAL_MS = 5000
const RESUME_DELAY_MS = 2000
const MAX_VISIBLE_OFFSET = 2

function getCircularOffset(index, activeIndex, count) {
  let offset = index - activeIndex
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

function getSlotTransform(offset, reducedMotion) {
  if (reducedMotion) {
    return {
      transform: offset === 0 ? 'none' : 'scale(0.92)',
      opacity: offset === 0 ? 1 : 0,
      zIndex: offset === 0 ? 10 : 0,
      pointerEvents: offset === 0 ? 'auto' : 'none',
    }
  }

  const abs = Math.abs(offset)
  if (abs > MAX_VISIBLE_OFFSET) {
    return {
      transform: 'translateX(0) translateZ(-200px) rotateY(0deg) scale(0.6)',
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }
  }

  const translateX = offset * 130
  const translateZ = -abs * 90
  const rotateY = offset * -28
  const scale = 1 - abs * 0.12
  const opacity = 1 - abs * 0.35

  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex: 10 - abs,
    pointerEvents: abs <= 1 ? 'auto' : 'none',
  }
}

export default function ConstellationCarousel({ apps }) {
  const count = apps.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedId, setExpandedId] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const resumeTimerRef = useRef(null)
  const mobileScrollRef = useRef(null)
  const dragRef = useRef({ active: false, startX: 0, moved: false })
  const justDraggedRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const pauseAuto = useCallback(() => {
    clearResumeTimer()
    setIsPaused(true)
  }, [clearResumeTimer])

  const scheduleResume = useCallback(() => {
    clearResumeTimer()
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY_MS)
  }, [clearResumeTimer])

  const closeDetail = useCallback(() => {
    setExpandedId(null)
    scheduleResume()
  }, [scheduleResume])

  const goTo = useCallback((index) => {
    setActiveIndex(((index % count) + count) % count)
    setExpandedId(null)
  }, [count])

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  useEffect(() => {
    if (reducedMotion || isPaused || expandedId) return undefined
    const id = setInterval(goNext, AUTO_INTERVAL_MS)
    return () => clearInterval(id)
  }, [reducedMotion, isPaused, expandedId, goNext])

  useEffect(() => {
    const node = mobileScrollRef.current
    if (!node) return undefined
    const child = node.children[activeIndex]
    if (child) {
      child.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeIndex, reducedMotion])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && expandedId) {
        closeDetail()
        return
      }
      if (expandedId) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        pauseAuto()
        goPrev()
        scheduleResume()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        pauseAuto()
        goNext()
        scheduleResume()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expandedId, goNext, goPrev, pauseAuto, scheduleResume, closeDetail])

  const handleCardClick = (app, offset) => {
    pauseAuto()

    if (offset !== 0) {
      goTo(apps.findIndex((a) => a.id === app.id))
      scheduleResume()
      return
    }

    if (app.description) {
      setExpandedId((prev) => {
        if (prev === app.id) {
          scheduleResume()
          return null
        }
        return app.id
      })
    } else {
      scheduleResume()
    }
  }

  const handlePointerDown = (e) => {
    if (expandedId) return
    dragRef.current = { active: true, startX: e.clientX, moved: false }
    pauseAuto()
  }

  const handlePointerMove = (e) => {
    if (!dragRef.current.active || expandedId) return
    const delta = e.clientX - dragRef.current.startX
    if (Math.abs(delta) > 24) {
      dragRef.current.moved = true
      justDraggedRef.current = true
      if (delta < 0) goNext()
      else goPrev()
      dragRef.current.active = false
      dragRef.current.startX = e.clientX
    }
  }

  const handlePointerUp = () => {
    if (dragRef.current.active && !dragRef.current.moved) {
      scheduleResume()
    } else if (dragRef.current.moved) {
      scheduleResume()
    }
    dragRef.current.active = false
  }

  const activeApp = apps[activeIndex]
  const expandedApp = expandedId ? apps.find((a) => a.id === expandedId) : null
  const isDetailOpen = Boolean(expandedApp)

  return (
    <div
      className="mb-6"
      onMouseEnter={pauseAuto}
      onMouseLeave={() => !expandedId && scheduleResume()}
      onFocusCapture={pauseAuto}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) scheduleResume()
      }}
    >
      {/* Desktop / tablet wheel */}
      <div className="relative mx-auto hidden max-w-4xl md:block">
        {isDetailOpen ? (
          <div className="px-4 py-2 min-h-[320px] flex items-start justify-center">
            <ConstellationDetailPanel app={expandedApp} onClose={closeDetail} />
          </div>
        ) : (
          <div
            className="constellation-stage relative min-h-[340px]"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            role="region"
            aria-roledescription="carousel"
            aria-label="Bloodchain constellation applications"
          >
            <div className="constellation-track relative flex h-[320px] w-full items-center justify-center">
              {apps.map((app, index) => {
                const offset = getCircularOffset(index, activeIndex, count)
                const slotStyle = getSlotTransform(offset, reducedMotion)
                const isCenter = offset === 0

                return (
                  <div
                    key={app.id}
                    className="constellation-card-slot absolute left-1/2 top-1/2 -ml-[120px] -mt-[140px]"
                    style={slotStyle}
                  >
                    <CarouselAppCard
                      app={app}
                      isCenter={isCenter}
                      variant="wheel"
                      onCardClick={() => {
                        if (justDraggedRef.current) {
                          justDraggedRef.current = false
                          return
                        }
                        handleCardClick(app, offset)
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile snap strip */}
      <div className="md:hidden">
        {!isDetailOpen && (
          <div
            ref={mobileScrollRef}
            className="constellation-mobile-strip flex gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory"
            onScroll={() => pauseAuto()}
            onTouchEnd={scheduleResume}
          >
            {apps.map((app, index) => {
              const isCenter = index === activeIndex
              return (
                <div key={app.id} className="snap-center shrink-0">
                  <CarouselAppCard
                    app={app}
                    isCenter={isCenter}
                    variant="mobile"
                    onCardClick={() => {
                      if (index !== activeIndex) {
                        goTo(index)
                        pauseAuto()
                        scheduleResume()
                        return
                      }
                      handleCardClick(app, 0)
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}

        {expandedApp && (
          <div className="px-4 py-2">
            <ConstellationDetailPanel app={expandedApp} onClose={closeDetail} />
          </div>
        )}
      </div>

      {/* Controls — hidden while detail panel is open to avoid overlap */}
      {!isDetailOpen && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { pauseAuto(); goPrev(); scheduleResume() }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-[#0B0E15] text-[#8899A8] transition-colors hover:border-white/[0.18] hover:text-white"
              aria-label="Previous application"
            >
              ‹
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1.5" role="tablist" aria-label="Applications">
              {apps.map((app, index) => (
                <button
                  key={app.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={app.name}
                  onClick={() => { pauseAuto(); goTo(index); scheduleResume() }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-6 bg-burg-400'
                      : 'w-2 bg-white/[0.15] hover:bg-white/[0.30]'
                  }`}
                  style={index === activeIndex ? { background: app.accentColor } : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => { pauseAuto(); goNext(); scheduleResume() }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-[#0B0E15] text-[#8899A8] transition-colors hover:border-white/[0.18] hover:text-white"
              aria-label="Next application"
            >
              ›
            </button>
          </div>

          <p className="font-mono text-[11px] tracking-[0.12em] text-[#8899A8]" aria-live="polite">
            {activeIndex + 1} / {count} · {activeApp.name}
          </p>
        </div>
      )}

      {isDetailOpen && (
        <p className="mt-4 text-center font-mono text-[11px] tracking-[0.12em] text-[#4A5568]">
          {activeIndex + 1} / {count} · {activeApp.name}
        </p>
      )}
    </div>
  )
}
