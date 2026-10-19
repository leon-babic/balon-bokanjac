import { motion } from 'motion/react'
import { useMemo } from 'react'
import posebni from './PosebniEfekti.jsx'
import './posebni.css'

// Posebne animacije za pojedine igrače.
// Svaki efekt je hrpa malih čestica (emoji ili oblici) koje lete po ekranu.

const nasumicno = (min, max) => min + Math.random() * (max - min)

function Vatra() {
  const cestice = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({ i, x: nasumicno(0, 100), d: nasumicno(0, 1.5), v: nasumicno(18, 42) })),
    []
  )
  return cestice.map((c) => (
    <motion.span
      key={c.i}
      className="cestica"
      style={{ left: `${c.x}%`, bottom: -40, fontSize: c.v }}
      initial={{ y: 0, opacity: 0, scale: 0.5 }}
      animate={{ y: -700, opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 0.6] }}
      transition={{ duration: 2.2, delay: c.d, repeat: Infinity, ease: 'easeOut' }}
    >
      🔥
    </motion.span>
  ))
}

function Munja() {
  return (
    <>
      <motion.div
        className="bljesak"
        animate={{ opacity: [0, 0.9, 0, 0.6, 0, 0, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.04, 0.1, 0.14, 0.2, 0.6, 1] }}
      />
      {[12, 50, 85].map((x, i) => (
        <motion.span
          key={x}
          className="cestica munja"
          style={{ left: `${x}%`, top: '5%' }}
          animate={{ opacity: [0, 1, 0, 1, 0], scaleY: [0.4, 1.2, 1, 1.1, 0.8] }}
          transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity, times: [0, 0.05, 0.1, 0.15, 0.3] }}
        >
          ⚡
        </motion.span>
      ))}
    </>
  )
}

function Zid() {
  const cigle = Array.from({ length: 24 }, (_, i) => i)
  return (
    <div className="zid">
      {cigle.map((i) => (
        <motion.span
          key={i}
          className="cigla"
          initial={{ y: -500, opacity: 0, rotate: nasumicno(-30, 30) }}
          animate={{ y: 0, opacity: 0.85, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.2 + (23 - i) * 0.05 }}
        />
      ))}
    </div>
  )
}

function Zvijezde() {
  const cestice = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({ i, kut: (i / 36) * Math.PI * 2, r: nasumicno(180, 420) })),
    []
  )
  return cestice.map((c) => (
    <motion.span
      key={c.i}
      className="cestica"
      style={{ left: '50%', top: '45%', fontSize: 24 }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ x: Math.cos(c.kut) * c.r, y: Math.sin(c.kut) * c.r, opacity: [0, 1, 0], scale: [0, 1.4, 0.4], rotate: 360 }}
      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6, ease: 'easeOut' }}
    >
      {c.i % 3 === 0 ? '🏆' : '⭐'}
    </motion.span>
  ))
}

function Magija() {
  const cestice = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ i, x: nasumicno(0, 100), y: nasumicno(0, 100), d: nasumicno(0, 2) })),
    []
  )
  return cestice.map((c) => (
    <motion.span
      key={c.i}
      className="cestica"
      style={{ left: `${c.x}%`, top: `${c.y}%`, fontSize: 22 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0], rotate: [0, 180] }}
      transition={{ duration: 1.6, delay: c.d, repeat: Infinity }}
    >
      {c.i % 2 ? '✨' : '🪄'}
    </motion.span>
  ))
}

function Raketa() {
  return (
    <>
      {[0, 0.7, 1.4].map((d, i) => (
        <motion.span
          key={i}
          className="cestica"
          style={{ left: -80, top: `${20 + i * 28}%`, fontSize: 48 }}
          animate={{ x: ['0vw', '120vw'], y: [0, -60, 0] }}
          transition={{ duration: 1.4, delay: d, repeat: Infinity, repeatDelay: 0.8, ease: 'easeIn' }}
        >
          🚀
        </motion.span>
      ))}
      <motion.div
        className="brzinske-linije"
        animate={{ backgroundPositionX: ['0px', '-400px'] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
      />
    </>
  )
}

// Pipci koji izlaze s dna ekrana i vijugaju
function Kraken() {
  const pipci = [8, 24, 76, 92]
  const mjehurici = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({ i, x: nasumicno(0, 100), d: nasumicno(0, 3), v: nasumicno(14, 30) })),
    []
  )
  return (
    <>
      <svg className="pipci" viewBox="0 0 100 100" preserveAspectRatio="none">
        {pipci.map((x, i) => {
          const s = x < 50 ? 1 : -1
          const a = `M ${x} 105 C ${x + 8 * s} 80, ${x - 6 * s} 60, ${x + 10 * s} 35`
          return (
            <motion.path
              key={x}
              d={a}
              initial={{ pathLength: 0 }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
              animate={{ pathLength: 1, rotate: [-8 * s, 8 * s, -8 * s] }}
              transition={{
                pathLength: { duration: 1.2, delay: i * 0.15, ease: 'easeOut' },
                rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
              }}
            />
          )
        })}
      </svg>
      <motion.span
        className="cestica"
        style={{ left: '50%', bottom: -40, fontSize: 120, marginLeft: -60 }}
        initial={{ y: 200 }}
        animate={{ y: [200, -40, -20], rotate: [0, -8, 8] }}
        transition={{ duration: 1.4, ease: 'easeOut', rotate: { duration: 2, repeat: Infinity, repeatType: 'mirror' } }}
      >
        🐙
      </motion.span>
      {mjehurici.map((m) => (
        <motion.span
          key={m.i}
          className="mjehuric"
          style={{ left: `${m.x}%`, bottom: -30, width: m.v, height: m.v }}
          animate={{ y: [0, -900], x: [0, 15, -15, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 4, delay: m.d, repeat: Infinity, ease: 'easeIn' }}
        />
      ))}
    </>
  )
}



// DJ: disko kugla, svjetla koja se vrte, ekvilajzer i note
function Disko() {
  const stupci = Array.from({ length: 24 }, (_, i) => i)
  const note = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ i, x: nasumicno(5, 95), d: nasumicno(0, 3) })),
    []
  )
  return (
    <>
      <div className="disko-svjetla" />
      <motion.span
        className="cestica"
        style={{ left: '50%', top: 10, fontSize: 80, marginLeft: -40 }}
        initial={{ y: -150 }}
        animate={{ y: 0, rotate: 360 }}
        transition={{ y: { type: 'spring', stiffness: 120, damping: 10 }, rotate: { duration: 4, repeat: Infinity, ease: 'linear' } }}
      >
        🪩
      </motion.span>
      <div className="ekvilajzer">
        {stupci.map((i) => (
          <motion.span
            key={i}
            animate={{ scaleY: [0.2, nasumicno(0.5, 1), 0.3, nasumicno(0.4, 1), 0.2] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.04 }}
            style={{ '--h': (i * 15) % 360 }}
          />
        ))}
      </div>
      {note.map((n) => (
        <motion.span
          key={n.i}
          className="cestica"
          style={{ left: `${n.x}%`, bottom: 0, fontSize: 30 }}
          animate={{ y: [0, -700], x: [0, 30, -30, 0], opacity: [0, 1, 0], rotate: [-20, 20] }}
          transition={{ duration: 3.5, delay: n.d, repeat: Infinity }}
        >
          {n.i % 2 ? '🎵' : '🎶'}
        </motion.span>
      ))}
    </>
  )
}

// Barcelona: plavo-crvene pruge i konfete
function Barca() {
  const konfete = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        i,
        x: nasumicno(0, 100),
        d: nasumicno(0, 3),
        boja: ['#004d98', '#a50044', '#edbb00'][i % 3],
        r: nasumicno(0, 720),
      })),
    []
  )
  return (
    <>
      <div className="barca-pruge">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.span
            key={i}
            style={{ background: i % 2 ? '#a50044' : '#004d98' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
          />
        ))}
      </div>
      <motion.p
        className="velik-natpis barca-natpis"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: [0, 1.2, 1], rotate: [-10, 4, -3] }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        FORÇA BARÇA
      </motion.p>
      {konfete.map((k) => (
        <motion.span
          key={k.i}
          className="konfet"
          style={{ left: `${k.x}%`, top: -20, background: k.boja }}
          animate={{ y: [0, 950], rotate: [0, k.r], x: [0, 40, -40, 0] }}
          transition={{ duration: 4, delay: k.d, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </>
  )
}


// Vojnik: maskirni uzorak, odlikovanja i pozdrav
function Vojnik() {
  const medalje = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({ i, x: nasumicno(5, 95), d: nasumicno(0, 3) })),
    []
  )
  return (
    <>
      <motion.div className="maskirno" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
      <motion.span
        className="cestica"
        style={{ left: '50%', bottom: 20, fontSize: 110, marginLeft: -55 }}
        initial={{ y: 200 }}
        animate={{ y: [200, 0, 0], rotate: [0, 0, -6, 0] }}
        transition={{ duration: 1.6, times: [0, 0.4, 0.7, 1] }}
      >
        🫡
      </motion.span>
      {medalje.map((m) => (
        <motion.span
          key={m.i}
          className="cestica"
          style={{ left: `${m.x}%`, top: -50, fontSize: 34 }}
          animate={{ y: [0, 950], rotate: [0, 30, -30, 0] }}
          transition={{ duration: 3.5, delay: m.d, repeat: Infinity, ease: 'easeIn' }}
        >
          {m.i % 3 ? '🎖️' : '⭐'}
        </motion.span>
      ))}
    </>
  )
}

// Cardio Mašina: EKG linija i srce koje kuca
function Srce() {
  const ekg = 'M0 50 L18 50 L21 44 L24 50 L28 50 L30 58 L33 10 L36 72 L39 50 L46 50 L49 42 L53 50 L68 50 L71 44 L74 50 L78 50 L80 58 L83 10 L86 72 L89 50 L96 50 L99 42 L100 50'
  return (
    <>
      <svg className="ekg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d={ekg}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', opacity: { times: [0, 0.85, 1], duration: 2, repeat: Infinity } }}
        />
      </svg>
      <motion.span
        className="cestica"
        style={{ right: '8%', top: '12%', fontSize: 90 }}
        animate={{ scale: [1, 1.3, 1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.15, 0.3, 0.45, 1] }}
      >
        ❤️
      </motion.span>
      <p className="bpm">
        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
          ♥
        </motion.span>{' '}
        180 BPM
      </p>
    </>
  )
}

// A Kaj Sad: slijeganje ramenima i upitnici posvuda
function KajSad() {
  const upitnici = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({ i, x: nasumicno(3, 95), y: nasumicno(5, 90), d: nasumicno(0, 2.5), v: nasumicno(30, 70) })),
    []
  )
  return (
    <>
      {upitnici.map((u) => (
        <motion.span
          key={u.i}
          className="upitnik"
          style={{ left: `${u.x}%`, top: `${u.y}%`, fontSize: u.v }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.8], rotate: [-20, 15, -10] }}
          transition={{ duration: 1.8, delay: u.d, repeat: Infinity }}
        >
          ?
        </motion.span>
      ))}
      <motion.p
        className="velik-natpis kajsad-natpis"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [-4, 4, -4] }}
        transition={{ scale: { type: 'spring', stiffness: 200, damping: 10, delay: 0.3 }, rotate: { duration: 1.6, repeat: Infinity } }}
      >
        A KAJ SAD?
      </motion.p>
      <motion.span
        className="cestica"
        style={{ left: '50%', bottom: 10, fontSize: 110, marginLeft: -55 }}
        initial={{ y: 200 }}
        animate={{ y: [200, 0, -14, 0, -14, 0] }}
        transition={{ duration: 2, times: [0, 0.3, 0.45, 0.6, 0.75, 1], repeat: Infinity, repeatDelay: 0.5 }}
      >
        🤷
      </motion.span>
    </>
  )
}

// Sikra: sjekira sasiječe po sredini ekrana, iverje leti, ekran se trese
function Sikra() {
  const ciklus = { duration: 1.5, repeat: Infinity, repeatDelay: 0.3 }
  const udar = 0.38 // trenutak kad sikira udari
  const iverje = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({ i, kut: nasumicno(-160, -20) * (Math.PI / 180), r: nasumicno(80, 240), rot: nasumicno(-400, 400) })),
    []
  )
  const leteće = useMemo(
    () => Array.from({ length: 3 }, (_, i) => ({ i, y: 15 + i * 28, d: i * 0.9 })),
    []
  )
  return (
    <motion.div
      className="sikra-scena"
      animate={{ x: [0, 0, -14, 12, -7, 4, 0], y: [0, 0, 8, -6, 3, 0, 0] }}
      transition={{ ...ciklus, times: [0, udar, udar + 0.04, udar + 0.08, udar + 0.12, udar + 0.16, 1] }}
    >
      {/* Rezovi preko ekrana */}
      {[-24, 18, -8].map((kut, i) => (
        <motion.span
          key={kut}
          className="rez"
          style={{ top: `${30 + i * 20}%`, rotate: `${kut}deg` }}
          animate={{ scaleX: [0, 0, 1, 1], opacity: [0, 0, 1, 0] }}
          transition={{ ...ciklus, times: [0, udar - 0.02 + i * 0.03, udar + 0.04 + i * 0.03, 0.85] }}
        />
      ))}

      {/* Velika sikira koja zamahne */}
      <motion.span
        className="sikira"
        animate={{ rotate: [-80, -80, 30, 30, -80], scale: [1, 1.05, 1.15, 1, 1] }}
        transition={{ ...ciklus, times: [0, 0.22, udar, 0.75, 1], ease: 'easeIn' }}
      >
        🪓
      </motion.span>

      {/* Iverje koje odleti kod udarca */}
      {iverje.map((v) => (
        <motion.span
          key={v.i}
          className="iver"
          animate={{
            x: [0, 0, Math.cos(v.kut) * v.r],
            y: [0, 0, Math.sin(v.kut) * v.r, Math.sin(v.kut) * v.r + 160],
            rotate: [0, 0, v.rot],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ ...ciklus, times: [0, udar, udar + 0.25, 0.95] }}
        />
      ))}

      <motion.p
        className="velik-natpis sikra-natpis"
        animate={{ scale: [0, 0, 1.4, 1, 1], opacity: [0, 0, 1, 1, 0], rotate: [-8, -8, -4, -6, -6] }}
        transition={{ ...ciklus, times: [0, udar, udar + 0.08, 0.7, 1] }}
      >
        SIKRA!
      </motion.p>

      {/* Sikire koje lete preko ekrana */}
      {leteće.map((l) => (
        <motion.span
          key={l.i}
          className="cestica"
          style={{ top: `${l.y}%`, left: 0, fontSize: 46 }}
          animate={{ x: ['-10vw', '110vw'], rotate: [0, 1080] }}
          transition={{ duration: 1.6, delay: l.d, repeat: Infinity, repeatDelay: 1.2, ease: 'linear' }}
        >
          🪓
        </motion.span>
      ))}
    </motion.div>
  )
}

// Krvnik: ekran pukne, kosti lete, "KRAK!" i hitna projuri
function Krvnik() {
  const ciklus = { duration: 2.2, repeat: Infinity, repeatDelay: 0.4 }
  const pukotine = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const kut = (i / 11) * Math.PI * 2 + nasumicno(-0.2, 0.2)
        // Pukotina ide u cik-cak od točke udarca prema van
        let x = 20
        let y = 40
        let d = `M ${x} ${y}`
        for (let k = 1; k <= 4; k++) {
          const r = k * nasumicno(6, 11)
          x = 20 + Math.cos(kut + nasumicno(-0.25, 0.25)) * r
          y = 40 + Math.sin(kut + nasumicno(-0.25, 0.25)) * r * 1.6
          d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
        }
        return d
      }),
    []
  )
  const kosti = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ i, dx: nasumicno(-260, 260), dy: nasumicno(-320, -120), r: nasumicno(-540, 540) })),
    []
  )
  return (
    <>
      <motion.div
        className="crveni-bljesak"
        animate={{ opacity: [0, 0, 0.55, 0] }}
        transition={{ ...ciklus, times: [0, 0.18, 0.22, 0.4] }}
      />

      {/* Napuknuto staklo */}
      <svg className="pukotine" viewBox="0 0 100 100" preserveAspectRatio="none">
        {pukotine.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 0, 1, 1], opacity: [0, 1, 1, 0] }}
            transition={{ ...ciklus, times: [0, 0.2, 0.28, 0.9] }}
          />
        ))}
      </svg>

      <motion.p
        className="krak"
        animate={{ scale: [0, 0, 1.5, 1.1, 1.1], opacity: [0, 0, 1, 1, 0], rotate: [-15, -15, -8, -10, -10] }}
        transition={{ ...ciklus, times: [0, 0.2, 0.26, 0.75, 0.9] }}
      >
        KRAK!
      </motion.p>

      {/* Kosti koje odlete s mjesta udarca */}
      {kosti.map((k) => (
        <motion.span
          key={k.i}
          className="cestica"
          style={{ left: '20%', top: '40%', fontSize: 38 }}
          animate={{
            x: [0, 0, k.dx * 0.6, k.dx],
            y: [0, 0, k.dy, k.dy + 380],
            rotate: [0, 0, k.r / 2, k.r],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ ...ciklus, times: [0, 0.22, 0.45, 1], ease: 'easeOut' }}
        >
          {k.i % 4 === 0 ? '🩹' : '🦴'}
        </motion.span>
      ))}

      {/* Hitna pomoć projuri dnom ekrana */}
      <motion.div
        className="hitna"
        animate={{ x: ['110vw', '-30vw'] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: 'linear', delay: 0.6 }}
      >
        <motion.span
          className="rotacija"
          animate={{ background: ['#ff2a3d', '#2a6bff', '#ff2a3d'], boxShadow: ['0 0 40px 20px rgba(255,42,61,.7)', '0 0 40px 20px rgba(42,107,255,.7)', '0 0 40px 20px rgba(255,42,61,.7)'] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
        <span className="hitna-auto">🚑</span>
        <span className="hitna-natpis">IIIUU-IIIUU</span>
      </motion.div>
    </>
  )
}

// Obični efekti idu iza prozora s igračem
const efekti = {
  krvnik: Krvnik,
  sikra: Sikra,
  kajsad: KajSad,
  disko: Disko,
  barca: Barca,
  vojnik: Vojnik,
  srce: Srce,
  vatra: Vatra,
  munja: Munja,
  zid: Zid,
  zvijezde: Zvijezde,
  magija: Magija,
  raketa: Raketa,
  kraken: Kraken,
}

// sloj: 'pozadina' (iza prozora) ili 'iznad' (ispred prozora, ne smeta klikovima)
export default function Efekt({ vrsta, sloj = 'pozadina' }) {
  const Komponenta = posebni[vrsta]?.[sloj] ?? (sloj === 'pozadina' ? efekti[vrsta] : null)
  if (!Komponenta) return null
  return (
    <div className={sloj === 'iznad' ? 'efekt efekt-iznad' : `efekt efekt-${vrsta}`} aria-hidden="true">
      <Komponenta />
    </div>
  )
}
