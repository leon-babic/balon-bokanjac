import { motion } from 'motion/react'
import { useMemo } from 'react'

// Veće, "filmske" animacije za pojedine igrače.
// Svaka ima dva sloja:
//   pozadina – vrti se iza prozora s igračem
//   iznad    – ide ispred prozora (ne smeta klikovima)

const nasumicno = (min, max) => min + Math.random() * (max - min)

// Koliko sekundi traje uvod prije nego što se pojavi prozor s igračem
export const trajanjeUvoda = { kapetan: 3.2 }

// =====================================================================
//  LEON – KAPETAN I MEČMEJKER
// =====================================================================

// Točke na taktičkoj ploči i redoslijed dodavanja
const tocke = [
  [28, 60], [70, 28], [70, 92], [112, 46], [112, 80], [150, 22], [150, 98], [182, 60],
]
const dodavanja = [0, 1, 3, 5, 4, 2, 6, 7]

function TaktickaPloca({ kasnjenje = 0, ponavljaj = false }) {
  const trajanjeDodavanja = 0.28
  const lopta = dodavanja.map((i) => tocke[i])
  const ukupno = (dodavanja.length - 1) * trajanjeDodavanja
  const ponovi = ponavljaj ? { repeat: Infinity, repeatDelay: 1.5 } : {}

  return (
    <svg className="ploca" viewBox="0 0 210 120">
      <rect x="4" y="4" width="202" height="112" rx="4" className="ploca-teren" />
      <line x1="105" y1="4" x2="105" y2="116" className="ploca-linija" />
      <circle cx="105" cy="60" r="16" className="ploca-linija" />
      <rect x="4" y="36" width="22" height="48" className="ploca-linija" />
      <rect x="184" y="36" width="22" height="48" className="ploca-linija" />

      {dodavanja.slice(1).map((t, i) => {
        const [x1, y1] = tocke[dodavanja[i]]
        const [x2, y2] = tocke[t]
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="ploca-dodavanje"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: trajanjeDodavanja, delay: kasnjenje + i * trajanjeDodavanja, ease: 'linear', ...ponovi }}
          />
        )
      })}

      {tocke.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="5"
          className="ploca-igrac"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: kasnjenje * 0.6 + i * 0.05, type: 'spring', stiffness: 300 }}
        />
      ))}

      <motion.circle
        r="3.2"
        className="ploca-lopta"
        initial={{ cx: lopta[0][0], cy: lopta[0][1], opacity: 0 }}
        animate={{ cx: lopta.map((p) => p[0]), cy: lopta.map((p) => p[1]), opacity: 1 }}
        transition={{ duration: ukupno, delay: kasnjenje, ease: 'linear', ...ponovi }}
      />
    </svg>
  )
}

function KapetanIznad() {
  const iskre = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const kut = (i / 40) * Math.PI * 2
        const r = nasumicno(160, 420)
        return { i, x: Math.cos(kut) * r, y: Math.sin(kut) * r, v: nasumicno(4, 10) }
      }),
    []
  )
  const slova = 'KAPETAN'.split('')

  return (
    <motion.div
      className="kap-uvod"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 3.4, times: [0, 0.82, 1] }}
    >
      <div className="kap-mrak" />

      {/* Reflektor koji traži kapetana */}
      <motion.div
        className="kap-reflektor"
        initial={{ rotate: -40, opacity: 0 }}
        animate={{ rotate: [-40, 28, 0], opacity: [0, 1, 1] }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />

      {/* Taktička ploča – mečmejker slaže igru */}
      <motion.div
        className="kap-ploca"
        initial={{ opacity: 0, scale: 0.8, rotateX: 50 }}
        animate={{ opacity: 0.55, scale: 1, rotateX: 50 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <TaktickaPloca kasnjenje={0.5} />
      </motion.div>

      {/* Udarni valovi */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="kap-val"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 4.5], opacity: [0.9, 0] }}
          transition={{ duration: 1.1, delay: 1 + i * 0.14, ease: 'easeOut' }}
        />
      ))}

      {/* Zlatne iskre */}
      {iskre.map((s) => (
        <motion.span
          key={s.i}
          className="kap-iskra"
          style={{ width: s.v, height: s.v }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0] }}
          transition={{ duration: 1.3, delay: 1, ease: 'easeOut' }}
        />
      ))}

      {/* Kapetanska traka */}
      <motion.div
        className="kap-traka"
        initial={{ scale: 5, opacity: 0, rotate: -40 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 13 }}
      >
        <span>C</span>
      </motion.div>

      <div className="kap-naslov" aria-hidden="true">
        {slova.map((s, i) => (
          <motion.span
            key={i}
            initial={{ y: 60, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ delay: 1.35 + i * 0.06, type: 'spring', stiffness: 260, damping: 16 }}
          >
            {s}
          </motion.span>
        ))}
      </div>
      <motion.p
        className="kap-podnaslov"
        initial={{ opacity: 0, letterSpacing: '1.2em' }}
        animate={{ opacity: 1, letterSpacing: '0.45em' }}
        transition={{ delay: 1.9, duration: 0.8, ease: 'easeOut' }}
      >
        MEČMEJKER
      </motion.p>
    </motion.div>
  )
}

function KapetanPozadina() {
  const zlato = useMemo(
    () => Array.from({ length: 34 }, (_, i) => ({ i, x: nasumicno(0, 100), d: nasumicno(0, 5), r: nasumicno(0, 720), v: nasumicno(6, 12) })),
    []
  )
  return (
    <>
      <div className="kap-zrake" />
      <div className="kap-ploca-pozadina">
        <TaktickaPloca kasnjenje={3.2} ponavljaj />
      </div>
      <motion.span
        className="cestica kap-kruna"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ opacity: { delay: 3, duration: 0.5 }, y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
      >
        👑
      </motion.span>
      {zlato.map((z) => (
        <motion.span
          key={z.i}
          className="kap-listic"
          style={{ left: `${z.x}%`, width: z.v, height: z.v * 1.6 }}
          animate={{ y: [-30, 950], rotate: [0, z.r], x: [0, 30, -30, 0] }}
          transition={{ duration: 6, delay: z.d, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </>
  )
}

// =====================================================================
//  JURE – PAŠKI SOKOL
// =====================================================================

function SokolIznad() {
  return (
    <>
      {/* Veliki sokol preleti preko ekrana */}
      <motion.div
        className="sokol"
        animate={{
          x: ['110vw', '55vw', '15vw', '-60vw'],
          y: ['-25vh', '22vh', '30vh', '-10vh'],
          rotate: [-25, -8, 6, 22],
          scale: [0.7, 1.15, 1.15, 0.9],
        }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
      >
        <motion.span
          className="sokol-tijelo"
          animate={{ scaleY: [1, 0.72, 1] }}
          transition={{ duration: 0.32, repeat: Infinity }}
        >
          🦅
        </motion.span>
      </motion.div>

      {/* Obrušavanje prema ekranu – kljun ravno u lice */}
      <motion.div
        className="sokol-blizu"
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: [0.1, 0.1, 1, 4.5], opacity: [0, 0, 1, 0], rotate: [0, 0, -6, 4] }}
        transition={{ duration: 5, times: [0, 0.55, 0.8, 1], repeat: Infinity, ease: 'easeIn' }}
      >
        🦅
      </motion.div>
      <motion.p
        className="velik-natpis sokol-natpis"
        animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1.15, 1, 1.3], x: [0, 0, -6, 6, 0] }}
        transition={{ duration: 5, times: [0, 0.7, 0.76, 0.9, 1], repeat: Infinity }}
      >
        KRIIIII!
      </motion.p>
    </>
  )
}

function SokolPozadina() {
  const perje = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({ i, x: nasumicno(5, 95), d: nasumicno(0, 4) })),
    []
  )
  const oblaci = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ i, y: nasumicno(5, 80), d: nasumicno(0, 6), v: nasumicno(60, 120) })),
    []
  )
  return (
    <>
      {oblaci.map((o) => (
        <motion.span
          key={o.i}
          className="cestica"
          style={{ top: `${o.y}%`, left: 0, fontSize: o.v, opacity: 0.7 }}
          animate={{ x: ['-20vw', '110vw'] }}
          transition={{ duration: 12, delay: -o.d * 2, repeat: Infinity, ease: 'linear' }}
        >
          ☁️
        </motion.span>
      ))}
      {perje.map((p) => (
        <motion.span
          key={p.i}
          className="cestica"
          style={{ left: `${p.x}%`, top: -40, fontSize: 26 }}
          animate={{ y: [0, 950], x: [0, 30, -30, 20], rotate: [0, 90, -60, 120] }}
          transition={{ duration: 6, delay: p.d, repeat: Infinity, ease: 'linear' }}
        >
          🪶
        </motion.span>
      ))}
    </>
  )
}

// =====================================================================
//  MARTIN – UKLIZAVAČ
// =====================================================================

// Nacrtani igrač u klizećem startu (gleda udesno)
function IgracUklizava() {
  return (
    <svg className="igrac-svg" viewBox="0 0 200 120">
      {/* stražnja ruka oslonjena na travu */}
      <polyline points="62,72 46,90 38,108" className="ruka" />
      <circle cx="38" cy="108" r="4" className="koza" />
      {/* stražnja (savijena) noga */}
      <polyline points="95,98 114,84" className="bedro" />
      <polyline points="114,84 96,108" className="list-noge" />
      <ellipse cx="94" cy="110" rx="8" ry="4" className="kopacka" />
      {/* tijelo */}
      <line x1="95" y1="98" x2="62" y2="72" className="dres" />
      <text x="76" y="90" className="broj-dresa" transform="rotate(38 80 86)">14</text>
      {/* prednja noga ispružena prema lopti */}
      <polyline points="95,98 135,104" className="bedro" />
      <polyline points="135,104 170,106" className="list-noge" />
      <ellipse cx="176" cy="106" rx="9" ry="4.5" className="kopacka" />
      {/* prednja ruka u zraku */}
      <polyline points="62,72 72,52 88,42" className="ruka" />
      <circle cx="88" cy="42" r="4" className="koza" />
      {/* glava */}
      <circle cx="50" cy="58" r="11" className="koza" />
      <path d="M40 54 Q48 42 60 52" className="kosa" />
    </svg>
  )
}

function UklizavacIznad() {
  const ciklus = { duration: 2.6, repeat: Infinity, repeatDelay: 0.8 }
  const udar = 0.55
  const trava = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const t = (i / 36) * udar
        return { i, t, x: -20 + (t / udar) * 70, dx: nasumicno(-80, 20), dy: nasumicno(60, 200), r: nasumicno(-300, 300) }
      }),
    []
  )
  return (
    <>
      {/* Trag na travi */}
      <motion.div
        className="trag-klizanja"
        animate={{ scaleX: [0, 1, 1], opacity: [0.9, 0.9, 0] }}
        transition={{ ...ciklus, times: [0, udar, 1], ease: 'easeOut' }}
      />

      {/* Trava i granule koje lete iza igrača */}
      {trava.map((t) => (
        <motion.span
          key={t.i}
          className="vlat-trave"
          style={{ left: `${t.x + 8}vw`, bottom: '7%' }}
          animate={{ x: [0, 0, t.dx], y: [0, 0, -t.dy, 30], rotate: [0, 0, t.r], opacity: [0, 0, 1, 0] }}
          transition={{ ...ciklus, times: [0, t.t, t.t + 0.18, Math.min(t.t + 0.45, 1)] }}
        />
      ))}

      {/* Igrač ukliže */}
      <motion.div
        className="uklizavac"
        animate={{ x: ['-40vw', '50vw', '52vw', '52vw'], opacity: [1, 1, 1, 0] }}
        transition={{ ...ciklus, times: [0, udar, 0.8, 1], ease: 'easeOut' }}
      >
        <IgracUklizava />
      </motion.div>

      {/* Lopta odleti nakon starta */}
      <motion.span
        className="cestica lopta-start"
        animate={{ x: [0, 0, 380], y: [0, 0, -420], rotate: [0, 0, 720], opacity: [1, 1, 0] }}
        transition={{ ...ciklus, times: [0, udar + 0.02, 1], ease: 'easeOut' }}
      >
        ⚽
      </motion.span>

      <motion.p
        className="velik-natpis uklizavac-natpis"
        animate={{ scale: [0, 0, 1.3, 1, 1], opacity: [0, 0, 1, 1, 0], rotate: [-6, -6, -3, -4, -4] }}
        transition={{ ...ciklus, times: [0, udar, udar + 0.08, 0.85, 1] }}
      >
        UKLIZAVAČ!
      </motion.p>
    </>
  )
}

function UklizavacPozadina() {
  return <div className="travnata-traka" />
}

// =====================================================================
//  DOME – "DIŠI, MAČKICE!"
// =====================================================================

function MackicaIznad() {
  const recenica = 'Diši, maćkice!'
  const sape = Array.from({ length: 7 }, (_, i) => i)
  return (
    <>
      {/* Oblačić s rečenicom */}
      <motion.div
        className="oblacic"
        initial={{ scale: 0, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.2 }}
      >
        <span className="oblacic-lice">D</span>
        <p>
          {recenica.split('').map((s, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.06 }}
            >
              {s}
            </motion.span>
          ))}
        </p>
      </motion.div>

      {/* Šapice koje dolaze do mačke */}
      {sape.map((i) => (
        <motion.span
          key={i}
          className="cestica sapa"
          style={{ left: `${8 + i * 9}%`, bottom: `${6 + (i % 2) * 4}%`, fontSize: 30 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0.3], scale: [0, 1.2, 1, 1] }}
          transition={{ delay: 1.2 + i * 0.15, duration: 0.6 }}
        >
          🐾
        </motion.span>
      ))}

      {/* Mačka skoči i diše */}
      <motion.div
        className="macka"
        initial={{ y: 300, rotate: 20 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ delay: 2.2, type: 'spring', stiffness: 160, damping: 11 }}
      >
        <motion.span
          className="macka-tijelo"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 2.8 }}
        >
          🐈
        </motion.span>
        <motion.span
          className="mijau"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 1], y: [0, -10, -20, -30] }}
          transition={{ delay: 2.7, duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          MJAU!
        </motion.span>
        {/* Dah – mali oblačići */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="dah"
            animate={{ x: [0, -40 - i * 15], y: [0, -10 - i * 10], scale: [0.3, 1.2], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2.2, delay: 3 + i * 0.25, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </>
  )
}

function MackicaPozadina() {
  const klupka = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ i, x: nasumicno(5, 90), d: nasumicno(0, 3) })),
    []
  )
  return (
    <>
      {klupka.map((k) => (
        <motion.span
          key={k.i}
          className="cestica"
          style={{ left: `${k.x}%`, top: -60, fontSize: 40 }}
          animate={{ y: [0, 400, 300, 560, 520, 950], rotate: [0, 360, 540, 900] }}
          transition={{ duration: 5, delay: k.d, repeat: Infinity, ease: 'easeIn' }}
        >
          🧶
        </motion.span>
      ))}
    </>
  )
}

// =====================================================================
//  ŠTEVANJA – HIGH ENOUGH (dim i listići)
// =====================================================================

function Listic({ velicina }) {
  // List s 7 prstiju, nacrtan od elipsi
  const prsti = [
    [0, 44], [-28, 37], [28, 37], [-58, 28], [58, 28], [-95, 17], [95, 17],
  ]
  return (
    <svg width={velicina} height={velicina} viewBox="-50 -50 100 100" className="listic">
      <line x1="0" y1="0" x2="0" y2="42" className="listic-drska" />
      {prsti.map(([kut, duzina], i) => (
        <ellipse key={i} cx="0" cy={-duzina / 2} rx={duzina / 6.5} ry={duzina / 2} transform={`rotate(${kut})`} />
      ))}
    </svg>
  )
}

function DimOblaci({ broj, prozirnost }) {
  const oblaci = useMemo(
    () =>
      Array.from({ length: broj }, (_, i) => ({
        i,
        x: nasumicno(-10, 100),
        d: nasumicno(-6, 3),
        v: nasumicno(220, 480),
        t: nasumicno(7, 11),
      })),
    [broj]
  )
  return oblaci.map((o) => (
    <motion.span
      key={o.i}
      className="dim"
      style={{ left: `${o.x}%`, width: o.v, height: o.v, '--p': prozirnost }}
      initial={{ y: '20vh', scale: 0.4, opacity: 0 }}
      animate={{ y: ['20vh', '-110vh'], scale: [0.4, 1.6], opacity: [0, 1, 0], x: [0, 60, -40] }}
      transition={{ duration: o.t, delay: o.d, repeat: Infinity, ease: 'linear' }}
    />
  ))
}

function DimPozadina() {
  const listici = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ i, x: nasumicno(0, 95), d: nasumicno(0, 6), v: nasumicno(70, 140), r: nasumicno(-180, 180) })),
    []
  )
  const naslov = 'HIGH ENOUGH'
  return (
    <>
      <div className="dim-izmaglica" />
      <DimOblaci broj={16} prozirnost={0.85} />
      {listici.map((l) => (
        <motion.span
          key={l.i}
          className="cestica"
          style={{ left: `${l.x}%`, top: -100 }}
          animate={{ y: [0, 1000], rotate: [0, l.r], x: [0, 50, -50, 0] }}
          transition={{ duration: 9, delay: l.d - 4, repeat: Infinity, ease: 'linear' }}
        >
          <Listic velicina={l.v} />
        </motion.span>
      ))}
      <p className="velik-natpis dim-natpis">
        {naslov.split('').map((s, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -14, 0, 10, 0], rotate: [0, 4, 0, -4, 0] }}
            transition={{ duration: 3, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
          >
            {s === ' ' ? ' ' : s}
          </motion.span>
        ))}
      </p>
    </>
  )
}

function DimIznad() {
  // Malo dima i ispred prozora – kao da je cijeli balon zadimljen
  return <DimOblaci broj={7} prozirnost={0.35} />
}

export default {
  kapetan: { pozadina: KapetanPozadina, iznad: KapetanIznad },
  sokol: { pozadina: SokolPozadina, iznad: SokolIznad },
  klizanje: { pozadina: UklizavacPozadina, iznad: UklizavacIznad },
  mackica: { pozadina: MackicaPozadina, iznad: MackicaIznad },
  dim: { pozadina: DimPozadina, iznad: DimIznad },
}
