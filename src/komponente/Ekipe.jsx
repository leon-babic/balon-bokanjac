import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { igraci } from '../data.js'
import { slozEkipe } from '../racunaj.js'

// Redoslijed prikaza u ekipi: golman, obrana, vezni, napad – pa po imenu
const redPozicija = { GOL: 0, OBR: 1, VEZ: 2, NAP: 3 }
const poPoziciji = (a, b) => redPozicija[a.pozicija] - redPozicija[b.pozicija] || a.ime.localeCompare(b.ime, 'hr')

// Označi tko je došao i stranica složi dvije ekipe
export default function Ekipe() {
  const [dosli, setDosli] = useState(igraci.map((i) => i.id))
  const [ekipe, setEkipe] = useState(null)
  const [krug, setKrug] = useState(0)

  function prebaci(id) {
    setDosli((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))
  }

  function slozi() {
    setEkipe(slozEkipe(dosli).map((e) => [...e.igraci].sort(poPoziciji)))
    setKrug((k) => k + 1)
  }

  return (
    <div className="ekipe">
      <p className="ekipe-uputa">
        Tko je došao? <strong>{dosli.length}</strong> igrača
      </p>
      <div className="dosli">
        {[...igraci].sort((a, b) => a.ime.localeCompare(b.ime, 'hr')).map((i) => (
          <button
            key={i.id}
            className={dosli.includes(i.id) ? 'dosao da' : 'dosao'}
            onClick={() => prebaci(i.id)}
          >
            {i.ime}
          </button>
        ))}
      </div>

      <motion.button
        className="gumb glavni veliki"
        onClick={slozi}
        disabled={dosli.length < 2}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, rotate: -2 }}
      >
        {ekipe ? '🔀 Promiješaj ponovo' : '⚽ Složi ekipe'}
      </motion.button>

      <AnimatePresence mode="wait">
        {ekipe && (
          <motion.div
            key={krug}
            className="dvije-ekipe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {ekipe.map((clanovi, t) => (
              <div key={t} className={`ekipa ${t === 0 ? 'bijeli' : 'crni'}`}>
                <h3>
                  {t === 0 ? 'Markiri' : 'Bez'}
                  <span>{clanovi.length} igrača</span>
                </h3>
                <ul>
                  {clanovi.map((i, n) => (
                    <motion.li
                      key={i.id}
                      initial={{ opacity: 0, x: t === 0 ? -60 : 60, rotate: t === 0 ? -8 : 8 }}
                      animate={{ opacity: 1, x: 0, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: n * 0.12 + t * 0.06 }}
                    >
                      <span className="poz">{i.pozicija}</span>
                      {i.ime}
                      <small>{i.nadimak}</small>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
