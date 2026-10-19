import { motion } from 'motion/react'
import { useMemo } from 'react'
import { liga } from '../data.js'

// Pozadina uvoda: unutrašnjost napuhanog balona + umjetna trava.
// Sve je nacrtano kodom (CSS + SVG), nema slika.

const nasumicno = (min, max) => min + Math.random() * (max - min)

// Isto vrijeme za loptu, mrežu i natpis GOL – da budu usklađeni
const udarac = { duration: 2.4, repeat: Infinity, repeatDelay: 3.5, delay: 2.6 }

// Lampe vise po luku stropa
const lampe = Array.from({ length: 7 }, (_, i) => {
  const x = 12 + i * (76 / 6)
  const y = 15 + ((x - 50) / 38) ** 2 * 14
  return { x, y }
})

function Kupola() {
  return (
    <div className="kupola">
      {/* Balon lagano "diše" kao da ga puše ventilator */}
      <motion.div
        className="platno"
        animate={{ scaleY: [1, 1.015, 1], scaleX: [1, 1.006, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
          {/* Šavovi od vrha prema podu */}
          {Array.from({ length: 13 }, (_, i) => {
            const k = i - 6
            const d = `M ${500 + k * 22} -40 Q ${500 + k * 78} 300 ${500 + k * 118} 640`
            return (
              <g key={i}>
                <path d={d} className="sav-svjetlo" transform="translate(3 0)" />
                <path d={d} className="sav" />
              </g>
            )
          })}
          {/* Zračne cijevi koje drže balon */}
          {[120, 290, 460].map((y) => {
            const d = `M -60 ${y + 60} Q 500 ${y - 150} 1060 ${y + 60}`
            return (
              <g key={y}>
                <path d={d} className="cijev-sjena" transform="translate(0 10)" />
                <path d={d} className="cijev" />
              </g>
            )
          })}
        </svg>
      </motion.div>

      {/* Lampe na stropu koje se pale jedna po jedna */}
      {lampe.map((l, i) => (
        <div key={i} className="lampa-omotac" style={{ left: `${l.x}%`, top: `${l.y}%` }}>
          <motion.span
            className="lampa"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 1, 0.3, 1] }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.12, times: [0, 0.3, 0.5, 1] }}
          />
          <motion.span
            className="snop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 + i * 0.12 }}
          />
        </div>
      ))}

      {/* Mrak na početku – nestane kad se upale svjetla */}
      <motion.div
        className="mrak"
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

function Vlati() {
  // Vlati trave u prvom planu
  const grupe = useMemo(
    () =>
      [0, 1, 2].map(() =>
        Array.from({ length: 70 }, () => {
          const x = nasumicno(0, 1000)
          const h = nasumicno(18, 46)
          const nagib = nasumicno(-6, 6)
          return { d: `M ${x} 60 L ${x + 4} 60 L ${x + 2 + nagib} ${60 - h} Z`, boja: Math.floor(nasumicno(0, 3)) }
        })
      ),
    []
  )
  return (
    <svg className="vlati" viewBox="0 0 1000 60" preserveAspectRatio="none">
      {grupe.map((g, n) => (
        <g key={n} className={`vlati-grupa g${n}`}>
          {g.map((v, i) => (
            <path key={i} d={v.d} className={`vlat b${v.boja}`} />
          ))}
        </g>
      ))}
    </svg>
  )
}

function Travnjak() {
  return (
    <div className="travnjak">
      {/* Ravnina trave u perspektivi */}
      <div className="trava">
        <svg className="linije" viewBox="0 0 400 1000" preserveAspectRatio="none">
          <rect x="20" y="20" width="360" height="960" />
          <line x1="20" y1="640" x2="380" y2="640" />
          <ellipse cx="200" cy="640" rx="55" ry="55" />
          <rect x="110" y="20" width="180" height="110" />
          <circle cx="200" cy="640" r="3" className="tocka" />
        </svg>
      </div>

      {/* LED reklama uz ogradu */}
      <div className="led-ograda">
        <div className="led-tekst">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>
              {liga.naziv} ✦ {liga.mjesto} ✦ {liga.termin} ✦{' '}
            </span>
          ))}
        </div>
      </div>

      {/* Mali gol na drugom kraju */}
      <div className="gol">
        <motion.svg
          viewBox="0 0 160 70"
          className="mreza"
          animate={{ scaleY: [1, 1, 1.18, 1], scaleX: [1, 1, 1.06, 1] }}
          transition={{ ...udarac, times: [0, 0.76, 0.84, 1] }}
        >
          <defs>
            <pattern id="rupe" width="7" height="7" patternUnits="userSpaceOnUse">
              <path d="M0 0 L7 7 M7 0 L0 7" />
            </pattern>
          </defs>
          <path d="M8 6 L22 0 L138 0 L152 6 L152 70 L8 70 Z" fill="url(#rupe)" className="mreza-pozadina" />
        </motion.svg>
        <div className="stative" />
        <motion.span
          className="gol-natpis"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.4, 0.4, 1.3, 1.1, 1.6], y: [0, 0, -20, -26, -40] }}
          transition={{ ...udarac, times: [0, 0.78, 0.84, 0.94, 1] }}
        >
          GOOOL!
        </motion.span>
      </div>

      {/* Sjena lopte po travi */}
      <motion.span
        className="lopta-sjena"
        initial={{ opacity: 0 }}
        animate={{
          left: ['24%', '37%', '50%', '50%'],
          top: ['88%', '50%', '16%', '16%'],
          scale: [1.5, 0.9, 0.35, 0.35],
          opacity: [0, 0.5, 0.35, 0],
        }}
        transition={{ ...udarac, times: [0, 0.4, 0.78, 1], ease: 'easeOut' }}
      />

      {/* Lopta: udarac s prednje strane u gol */}
      <motion.span
        className="lopta"
        initial={{ opacity: 0 }}
        animate={{
          left: ['24%', '37%', '50%', '50%'],
          top: ['80%', '-35%', '10%', '12%'],
          scale: [1.5, 0.95, 0.38, 0.36],
          rotate: [0, 500, 900, 900],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ ...udarac, times: [0, 0.4, 0.78, 1], ease: 'easeOut' }}
      >
        ⚽
      </motion.span>

      {/* Gumene granule koje odskoče kod udarca */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          className="granula"
          style={{ left: '24%', top: '88%' }}
          initial={{ opacity: 0 }}
          animate={{
            x: [0, 0, (i - 5) * 9, (i - 5) * 12],
            y: [0, 0, -nasumicno(20, 50), 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ ...udarac, times: [0, 0.01, 0.12, 0.22] }}
        />
      ))}

      <Vlati />
    </div>
  )
}

export default function Balon() {
  return (
    <div className="balon" aria-hidden="true">
      <Kupola />
      <Travnjak />
    </div>
  )
}
