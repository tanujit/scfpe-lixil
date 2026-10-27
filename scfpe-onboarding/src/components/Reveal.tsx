import { m, type HTMLMotionProps } from 'motion/react'

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
} as const

const ease = [0.22, 1, 0.36, 1] as const

type RevealProps = (HTMLMotionProps<'div'> & { as?: 'div' }) | (HTMLMotionProps<'li'> & { as: 'li' })

/** Fades and lifts its content once, when it first scrolls into view. */
export function Reveal({ delay = 0, as, children, ...rest }: RevealProps & { delay?: number }) {
  const transition = { duration: 0.5, ease, delay }
  if (as === 'li') {
    return (
      <m.li {...reveal} transition={transition} {...(rest as HTMLMotionProps<'li'>)}>
        {children}
      </m.li>
    )
  }
  return (
    <m.div {...reveal} transition={transition} {...(rest as HTMLMotionProps<'div'>)}>
      {children}
    </m.div>
  )
}
