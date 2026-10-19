import { AnimatePresence, motion, useScroll } from 'motion/react'
import { useCallback, useState } from 'react'
import { liga, igraci, utakmice } from './data.js'
import { rezultat, formatDatum, poId } from './racunaj.js'
import Kartica from './komponente/Kartica.jsx'
import Profil from './komponente/Profil.jsx'
import Tablica from './komponente/Tablica.jsx'
import Ekipe from './komponente/Ekipe.jsx'
import Uvod from './komponente/Uvod.jsx'

const pojava = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6 },
}

function Naslov({ broj, children }) {
  return (
    <motion.h2 {...pojava}>
      <span>{broj}</span>
      {children}
    </motion.h2>
  )
}

const pozicije = [
  ['SVI', 'Svi'],
  ['GOL', 'Golmani'],
  ['OBR', 'Obrana'],
  ['VEZ', 'Vezni'],
  ['NAP', 'Napad'],
]

function Igraci({ otvori }) {
  const [filter, setFilter] = useState('SVI')
  const prikazani = igraci
    .filter((i) => filter === 'SVI' || i.pozicija === filter)
    .sort((a, b) => (b.kapetan ? 1 : 0) - (a.kapetan ? 1 : 0) || a.ime.localeCompare(b.ime, 'hr'))

  return (
    <section id="igraci" className="sekcija">
      <div className="omotac">
        <Naslov broj="01">Igrači</Naslov>
        <div className="tabovi">
          {pozicije.map(([k, naziv]) => (
            <button key={k} aria-selected={filter === k} onClick={() => setFilter(k)}>
              {filter === k && <motion.span layoutId="filter-oznaka" className="tab-oznaka" />}
              <span>{naziv}</span>
            </button>
          ))}
        </div>
        <motion.div className="kartice" layout>
          <AnimatePresence mode="popLayout">
            {prikazani.map((i, n) => (
              <motion.div
                key={i.id}
                layout
                initial={{ opacity: 0, scale: 0.6, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: n * 0.03 }}
              >
                <Kartica igrac={i} onClick={() => otvori(i)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <p className="savjet">Klikni na igrača za detalje i njegovu posebnu animaciju.</p>
      </div>
    </section>
  )
}

function Utakmice() {
  return (
    <section id="utakmice" className="sekcija">
      <div className="omotac">
        <Naslov broj="04">Utakmice</Naslov>
        <div className="utakmice">
          {utakmice.length === 0 && (
            <p className="prazno">⚽ Još nema odigranih utakmica. Prva je ove nedjelje u balonu!</p>
          )}
          {utakmice.map((u, n) => {
            const [b, c] = rezultat(u)
            const strijelci = Object.entries(u.golovi)
              .sort((x, y) => y[1] - x[1])
              .map(([id, g]) => `${poId[id]?.nadimak ?? id}${g > 1 ? ` ×${g}` : ''}`)
            return (
              <motion.article
                key={u.datum}
                className="utakmica"
                initial={{ opacity: 0, x: n % 2 ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              >
                <p className="utakmica-datum">{formatDatum(u.datum)}</p>
                <div className="utakmica-rezultat">
                  <span className={b > c ? 'pobjednik' : ''}>Markiri</span>
                  <strong>
                    {b} : {c}
                  </strong>
                  <span className={c > b ? 'pobjednik' : ''}>Bez</span>
                </div>
                <p className="utakmica-strijelci">⚽ {strijelci.join(', ')}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [odabran, setOdabran] = useState(null)
  const zatvori = useCallback(() => setOdabran(null), [])
  const { scrollYProgress } = useScroll()

  return (
    <>
      <motion.div className="napredak" style={{ scaleX: scrollYProgress }} />
      <header className="nav">
        <a href="#" className="nav-logo">
          ⚽ <span>{liga.mjesto}</span>
        </a>
        <nav>
          <a href="#igraci">Igrači</a>
          <a href="#tablica">Tablica</a>
          <a href="#ekipe">Ekipe</a>
          <a href="#utakmice">Utakmice</a>
        </nav>
      </header>

      <main>
        <Uvod />
        <Igraci otvori={setOdabran} />

        <section id="tablica" className="sekcija">
          <div className="omotac">
            <Naslov broj="02">Tablica sezone</Naslov>
            <Tablica otvori={setOdabran} />
          </div>
        </section>

        <section id="ekipe" className="sekcija">
          <div className="omotac">
            <Naslov broj="03">Složi ekipe</Naslov>
            <Ekipe />
          </div>
        </section>

        <Utakmice />
      </main>

      <footer className="podnozje">
        {liga.naziv} · {liga.mjesto} · {liga.sezona}
      </footer>

      <AnimatePresence>{odabran && <Profil igrac={odabran} zatvori={zatvori} />}</AnimatePresence>
    </>
  )
}
