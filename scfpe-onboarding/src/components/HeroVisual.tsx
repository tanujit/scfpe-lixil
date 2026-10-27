import { m } from 'motion/react'
import mark from '../assets/scfpe-mark.svg'

/*
 * Decorative network illustration: dealer nodes on two orbits connected to a
 * single platform hub. Hidden from assistive technology.
 */

const CENTER = 240

function polar(radius: number, degrees: number) {
  const rad = (degrees * Math.PI) / 180
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) }
}

const outer = [-150, -100, -40, 15, 70, 120, 170, 215].map((deg) => polar(196, deg))
const inner = [-125, -15, 95, 200].map((deg) => polar(120, deg))

export function HeroVisual() {
  return (
    <svg
      className="hero-visual"
      viewBox="0 0 480 480"
      width="480"
      height="480"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="hv-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D592" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#2364DB" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2364DB" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hv-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B8DEF" />
          <stop offset="100%" stopColor="#00D592" />
        </linearGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r="230" fill="url(#hv-glow)" />

      {[196, 120, 64].map((r) => (
        <circle
          key={r}
          cx={CENTER}
          cy={CENTER}
          r={r}
          stroke="white"
          strokeOpacity={r === 196 ? 0.1 : 0.14}
          strokeDasharray={r === 196 ? '2 6' : undefined}
        />
      ))}

      {/* Connections into the hub */}
      {[...outer, ...inner].map((p, i) => (
        <m.line
          key={`l-${i}`}
          x1={p.x}
          y1={p.y}
          x2={CENTER}
          y2={CENTER}
          stroke="url(#hv-line)"
          strokeOpacity="0.35"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Flowing pulses along a few connections */}
      {[outer[1], outer[4], inner[2], outer[6]].map((p, i) => (
        <line
          key={`f-${i}`}
          className="hero-visual__flow"
          style={{ animationDelay: `${i * 0.9}s` }}
          x1={p.x}
          y1={p.y}
          x2={CENTER}
          y2={CENTER}
          stroke="#00D592"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="6 94"
        />
      ))}

      {outer.map((p, i) => (
        <g key={`o-${i}`}>
          <circle cx={p.x} cy={p.y} r="11" fill="#0B1640" stroke="white" strokeOpacity="0.22" />
          <circle cx={p.x} cy={p.y} r="3.5" fill={i % 3 === 0 ? '#00D592' : '#8FB0F5'} />
        </g>
      ))}

      {inner.map((p, i) => (
        <g key={`i-${i}`}>
          <circle cx={p.x} cy={p.y} r="15" fill="#13215A" stroke="#5B8DEF" strokeOpacity="0.5" />
          <circle cx={p.x} cy={p.y} r="5" fill="#2364DB" />
        </g>
      ))}

      {/* Hub */}
      <circle cx={CENTER} cy={CENTER} r="46" fill="#0B1640" stroke="#00D592" strokeOpacity="0.5" />
      <circle className="hero-visual__pulse" cx={CENTER} cy={CENTER} r="46" stroke="#00D592" />
      <image href={mark} x={CENTER - 15} y={CENTER - 25} width="30" height="50" />
    </svg>
  )
}
