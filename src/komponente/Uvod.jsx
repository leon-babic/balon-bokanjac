import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { liga, utakmice } from '../data.js'
import { rezultat, tablica } from '../racunaj.js'
import Brojac from './Brojac.jsx'
import Balon from './Balon.jsx'
import './uvod.css'

const glatko = [0.16, 1, 0.3, 1]

// ---------- Odbrojavanje do idućeg termina ----------
function iduciTermin(sada) {
  const [h, m] = liga.sat.split(':').map(Number)
  const pocetak = new Date(sada)
  pocetak.setHours(h, m, 0, 0)
  pocetak.setDate(pocetak.getDate() + ((liga.dan - pocetak.getDay() + 7) % 7))
  const kraj = new Date(pocetak.getTime() + liga.trajanjeMinuta * 60000)
  if (sada >= pocetak && sada < kraj) return { uTijeku: true }
  if (sada >= kraj) pocetak.setDate(pocetak.getDate() + 7)
  return { uTijeku: false, ostalo: pocetak - sada }
}

function useSada() {
  const [sada, setSada] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setSada(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return sada
}

// Jedna znamenka koja se "prevrne" kad se promijeni
function Znamenka({ z }) {
  return (
    <span className="znamenka">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={z}
          initial={{ y: '-100%', rotateX: 90, opacity: 0 }}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          exit={{ y: '100%', rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.45, ease: glatko }}
        >
          {z}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Jedinica({ broj, naziv }) {
  const tekst = String(broj).padStart(2, '0')
  return (
    <div className="jedinica">
      <div className="jedinica-broj">
        {tekst.split('').map((z, i) => (
          <Znamenka key={i} z={z} />
        ))}
      </div>
      <span>{naziv}</span>
    </div>
  )
}

function Odbrojavanje() {
  const sada = useSada()
  const t = iduciTermin(sada)

  if (t.uTijeku) {
    return (
      <div className="u-tijeku">
        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          ⚽
        </motion.span>
        Utakmica je u tijeku!
      </div>
    )
  }

  const s = Math.floor(t.ostalo / 1000)
  return (
    <div className="odbrojavanje">
      <Jedinica broj={Math.floor(s / 86400)} naziv="dana" />
      <Jedinica broj={Math.floor((s % 86400) / 3600)} naziv="sati" />
      <Jedinica broj={Math.floor((s % 3600) / 60)} naziv="min" />
      <Jedinica broj={s % 60} naziv="sek" />
    </div>
  )
}

// ---------- Naslov slovo po slovo ----------
function Rijec({ tekst, kasnjenje, obrub }) {
  return (
    <span className={`naslov-rijec ${obrub ? 'obrub' : ''}`} aria-hidden="true">
      {tekst.split('').map((slovo, i) => (
        <motion.span
          key={i}
          className="slovo"
          initial={{ y: '90%', rotateX: -100, opacity: 0, filter: 'blur(12px)' }}
          animate={{ y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: glatko, delay: kasnjenje + i * 0.045 }}
          whileHover={{ y: -14, color: '#c6ff3d', transition: { type: 'spring', stiffness: 500, damping: 10 } }}
        >
          {slovo}
        </motion.span>
      ))}
    </span>
  )
}

// ---------- Gumb koji se lijepi za miš ----------
function MagnetGumb({ href, children, glavni }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })

  function pomak(e) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.35)
    y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }

  return (
    <motion.a
      href={href}
      className={`magnet ${glavni ? 'glavni' : ''}`}
      style={{ x: sx, y: sy }}
      onMouseMove={pomak}
      onMouseLeave={() => (x.set(0), y.set(0))}
      whileTap={{ scale: 0.94 }}
    >
      <span>{children}</span>
    </motion.a>
  )
}

// ---------- Bento kartica koja se naginje ----------
function Plocica({ className = '', kasnjenje = 0, children }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 15 })
  const svjetloX = useTransform(mx, (v) => `${v * 100}%`)
  const svjetloY = useTransform(my, (v) => `${v * 100}%`)

  function pomak(e) {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <motion.div
      ref={ref}
      className={`plocica ${className}`}
      style={{ rotateX: rx, rotateY: ry, '--lx': svjetloX, '--ly': svjetloY }}
      onMouseMove={pomak}
      onMouseLeave={() => (mx.set(0.5), my.set(0.5))}
      initial={{ opacity: 0, y: 60, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease: glatko, delay: kasnjenje }}
    >
      {children}
    </motion.div>
  )
}

// ---------- Zlatna kopačka – vodeći strijelac ----------
const iskrice = [
  [8, 20], [22, 70], [46, 12], [62, 82], [80, 26], [92, 64], [36, 48],
]

function ZlatnaKopacka({ strijelci, kasnjenje }) {
  const [prvi, ...ostali] = strijelci
  if (!prvi) return null
  // Prije prvog gola sezone kruna još nema vlasnika
  const nitko = prvi.golovi === 0
  return (
    <Plocica className="p-strijelac zlatna-kopacka" kasnjenje={kasnjenje}>
      <span className="zk-prolaz" aria-hidden="true" />
      {iskrice.map(([x, y], i) => (
        <motion.span
          key={i}
          className="zk-iskrica"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ scale: [0, 1, 0], rotate: [0, 90] }}
          transition={{ duration: 1.6, delay: i * 0.35, repeat: Infinity, repeatDelay: 0.8 }}
          aria-hidden="true"
        >
          ✦
        </motion.span>
      ))}

      <div className="zk-zaglavlje">
        <p className="plocica-naslov">Zlatna kopačka</p>
        <motion.span
          className="zk-kopacka"
          animate={{ rotate: [-12, 8, -12], y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          👟
        </motion.span>
      </div>

      <div className="zk-vodeci">
        <div className="zk-lice">
          <motion.span
            className="zk-kruna"
            animate={{ y: [0, -4, 0], rotate: [-8, 8, -8] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            aria-hidden="true"
          >
            👑
          </motion.span>
          {nitko ? '?' : prvi.igrac.broj}
        </div>
        <div className="zk-ime">
          <strong>{nitko ? 'Još nitko' : prvi.igrac.ime}</strong>
          <span>{nitko ? 'Prvi gol sezone nosi krunu!' : prvi.igrac.nadimak}</span>
        </div>
        <div className="zk-golovi">
          <strong>
            <Brojac do={prvi.golovi} trajanje={1.8} />
          </strong>
          <span>golova</span>
        </div>
      </div>

      {!nitko && ostali.length > 0 && (
        <ol className="zk-potjera" start={2}>
          {ostali.map((s) => (
            <li key={s.igrac.id}>
              <b>{s.igrac.ime}</b>
              <span>{s.golovi} ⚽</span>
              <em>{s.golovi === prvi.golovi ? 'izjednačeno!' : `−${prvi.golovi - s.golovi}`}</em>
            </li>
          ))}
        </ol>
      )}
    </Plocica>
  )
}

export default function Uvod() {
  const ref = useRef(null)
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)
  const reflektorX = useSpring(mx, { stiffness: 80, damping: 20 })
  const reflektorY = useSpring(my, { stiffness: 80, damping: 20 })

  function pomak(e) {
    const r = ref.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  const zadnja = utakmice[0]
  const [b, c] = zadnja ? rezultat(zadnja) : [0, 0]
  // Utrka za Zlatnu kopačku: tri igrača s najviše golova
  const strijelci = [...tablica()].sort((x, y) => y.golovi - x.golovi || y.asistencije - x.asistencije).slice(0, 3)

  return (
    <section className="hero" ref={ref} onMouseMove={pomak}>
      <Balon />
      <motion.div className="mis-svjetlo" style={{ x: reflektorX, y: reflektorY }} aria-hidden="true" />

      <div className="omotac hero-mreza">
        <div className="hero-lijevo">
          <motion.p
            className="hero-cip"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: glatko }}
          >
            <span className="uzivo" /> Sezona {liga.sezona}
          </motion.p>

          <h1 aria-label={liga.naziv}>
            <Rijec tekst={liga.naziv.split(' ')[0]} kasnjenje={0.2} />
            <Rijec tekst={liga.naziv.split(' ').slice(1).join(' ')} kasnjenje={0.6} obrub />
          </h1>

          <motion.p
            className="hero-podnaslov"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: glatko }}
          >
            {liga.termin} u {liga.sat} · <strong>{liga.mjesto}</strong>
          </motion.p>

          <motion.div
            className="hero-gumbi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, ease: glatko }}
          >
            <MagnetGumb href="#igraci" glavni>
              Upoznaj igrače →
            </MagnetGumb>
            <MagnetGumb href="#tablica">Tablica</MagnetGumb>
          </motion.div>
        </div>

        <div className="bento">
          <Plocica className="p-odbrojavanje" kasnjenje={0.5}>
            <p className="plocica-naslov">Idući termin za</p>
            <Odbrojavanje />
          </Plocica>

          {/* Prije prve utakmice semafor stoji na 0 : 0 */}
          <Plocica className="p-rezultat" kasnjenje={0.65}>
            <p className="plocica-naslov">{zadnja ? 'Zadnja utakmica' : 'Prva utakmica – ove nedjelje'}</p>
            <div className="semafor">
              <span>MARKIRI</span>
              <strong className={b > c ? 'vodi' : ''}>
                <Brojac do={b} trajanje={1.6} />
              </strong>
              <i>:</i>
              <strong className={c > b ? 'vodi' : ''}>
                <Brojac do={c} trajanje={1.6} />
              </strong>
              <span>BEZ</span>
            </div>
          </Plocica>

          <ZlatnaKopacka strijelci={strijelci} kasnjenje={0.8} />
        </div>
      </div>

      <motion.a
        href="#igraci"
        className="hero-mis"
        aria-label="Skrolaj dolje"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span />
      </motion.a>
    </section>
  )
}
