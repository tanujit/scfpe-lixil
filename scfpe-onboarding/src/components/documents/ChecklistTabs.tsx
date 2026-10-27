import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Check } from 'lucide-react'
import { checklists } from '../../content/documents'
import './documents.css'

/** Business-type tabs (WAI-ARIA tabs pattern) for the mandatory documents list. */
export function ChecklistTabs() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = checklists.length - 1
    const next =
      event.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : event.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const current = checklists[active]

  return (
    <div className="checklist">
      <div role="tablist" aria-label="Business type" className="checklist__tabs">
        {checklists.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${c.id}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            className="checklist__tab"
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
          >
            {i === active && (
              <m.span layoutId={`${baseId}-pill`} className="checklist__pill" transition={{ duration: 0.25 }} />
            )}
            <span className="checklist__tab-label">{c.label}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        tabIndex={0}
        className="checklist__panel"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            className="checklist__groups"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {current.groups.map((group) => (
              <section key={group.heading} className="checklist__group">
                <h3 className="checklist__heading">
                  {group.heading}
                  <span className="checklist__count">{group.items.length}</span>
                </h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.name} className="checklist__item">
                      <span className="checklist__check" aria-hidden="true">
                        <Check size={14} strokeWidth={2.5} />
                      </span>
                      <span>
                        <span className="checklist__name">{item.name}</span>
                        {item.note && <span className="checklist__note">{item.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
