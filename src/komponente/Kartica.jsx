import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ukupno, razina, kratkoJacina } from '../racunaj.js'
import './teme.css'

// Bijeli dres Real Madrida gledan s leđa – ime i broj kao na pravom dresu
function DresReal({ ime, broj }) {
  return (
    <svg className="dres-real" viewBox="0 0 200 172">
      <defs>
        <linearGradient id="dres-bijelo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f1f1f5" />
          <stop offset="1" stopColor="#d9d9e2" />
        </linearGradient>
        <linearGradient id="dres-zlato" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7e08a" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="1" stopColor="#9c7a1c" />
        </linearGradient>
      </defs>
      {/* majica */}
      <path
        d="M78 10 Q100 22 122 10 L162 22 L198 54 L178 80 L152 62 L152 168 L48 168 L48 62 L22 80 L2 54 L38 22 Z"
        fill="url(#dres-bijelo)"
        stroke="#c8c8d4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* nabori */}
      <path d="M70 70 Q74 120 66 160" stroke="rgba(0,0,0,0.05)" strokeWidth="6" fill="none" />
      <path d="M132 70 Q128 120 136 160" stroke="rgba(0,0,0,0.05)" strokeWidth="6" fill="none" />
      {/* zlatni ovratnik i rubovi rukava */}
      <path d="M78 10 Q100 22 122 10" stroke="url(#dres-zlato)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M194 59 L176 76" stroke="url(#dres-zlato)" strokeWidth="4" strokeLinecap="round" />
      <path d="M6 59 L24 76" stroke="url(#dres-zlato)" strokeWidth="4" strokeLinecap="round" />
      {/* ljubičaste trake sa strane */}
      <path d="M152 64 L152 166" stroke="#3d195b" strokeWidth="4" />
      <path d="M48 64 L48 166" stroke="#3d195b" strokeWidth="4" />
      {/* ime i broj na leđima */}
      <text x="100" y="52" textAnchor="middle" className="dres-real-ime">
        {ime.toUpperCase()}
      </text>
      <text x="100" y="142" textAnchor="middle" className="dres-real-broj">
        {broj}
      </text>
    </svg>
  )
}

// Kartica igrača u stilu FIFA kartice – naginje se prema mišu i ima sjaj
export default function Kartica({ igrac, onClick, velika = false }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const okretX = useSpring(useTransform(y, [0, 1], [14, -14]), { stiffness: 200, damping: 18 })
  const okretY = useSpring(useTransform(x, [0, 1], [-14, 14]), { stiffness: 200, damping: 18 })
  const sjajX = useTransform(x, [0, 1], ['0%', '100%'])
  const sjajY = useTransform(y, [0, 1], ['0%', '100%'])

  function pomak(e) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width)
    y.set((e.clientY - r.top) / r.height)
  }

  function van() {
    x.set(0.5)
    y.set(0.5)
  }

  const ocjena = ukupno(igrac)
  const vrsta = razina(igrac)

  return (
    <motion.button
      type="button"
      className={`kartica ${vrsta} ${igrac.tema ? `tema tema-${igrac.tema}` : ''} ${igrac.efekt ? 'ima-efekt' : ''} ${velika ? 'velika' : ''}`}
      style={{ rotateX: okretX, rotateY: okretY, '--sx': sjajX, '--sy': sjajY }}
      onMouseMove={pomak}
      onMouseLeave={van}
      onClick={onClick}
      whileHover={{ scale: velika ? 1 : 1.05, y: velika ? 0 : -6 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="kartica-sjaj" aria-hidden="true" />
      {/* Ukras teme (znak u kutu kartice) */}
      {igrac.tema && <span className="kartica-ukras" aria-hidden="true" />}
      <div className="kartica-vrh">
        <div className="kartica-ocjena">
          <strong>{ocjena}</strong>
          <span>{igrac.pozicija}</span>
        </div>
        <div className="kartica-lice" aria-hidden="true">
          {igrac.tema === 'real' ? (
            <DresReal ime={igrac.ime} broj={igrac.broj} />
          ) : (
            /* Broj dresa kao veliki prozirni broj u pozadini */
            <span className="kartica-broj">{igrac.broj}</span>
          )}
        </div>
      </div>
      <div className="kartica-ime">{igrac.ime}</div>
      <div className="kartica-pravo-ime">{igrac.nadimak}</div>
      <div className="kartica-jacine">
        {Object.entries(igrac.jacine).map(([k, v]) => (
          <div key={k}>
            <strong>{v}</strong> {kratkoJacina[k]}
          </div>
        ))}
      </div>
      {igrac.kapetan && <span className="kartica-traka" title="Kapetan">C</span>}
    </motion.button>
  )
}
