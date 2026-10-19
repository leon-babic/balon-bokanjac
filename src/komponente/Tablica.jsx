import { motion } from 'motion/react'
import { useState } from 'react'
import { tablica } from '../racunaj.js'
import Brojac from './Brojac.jsx'

const stupci = [
  ['bodovi', 'Bodovi'],
  ['golovi', 'Golovi'],
  ['asistencije', 'Asistencije'],
  ['pobjede', 'Pobjede'],
]

export default function Tablica({ otvori }) {
  const [poCemu, setPoCemu] = useState('golovi')
  const redovi = tablica().sort(
    (a, b) => b[poCemu] - a[poCemu] || b.golovi - a.golovi || a.igrac.ime.localeCompare(b.igrac.ime)
  )
  const top3 = [...tablica()].sort((a, b) => b.golovi - a.golovi).slice(0, 3)
  const najvise = Math.max(...redovi.map((r) => r[poCemu]), 1)

  return (
    <>
      {/* Postolje za najbolje strijelce (prazno dok nitko ne zabije) */}
      {top3[0].golovi === 0 ? (
        <p className="prazno">🏆 Postolje čeka prve golove – sezona počinje ove nedjelje.</p>
      ) : (
      <div className="postolje">
        {[top3[1], top3[0], top3[2]].map((r, i) => {
          const mjesto = [2, 1, 3][i]
          return (
            <motion.button
              key={r.igrac.id}
              className={`postolje-stup mjesto-${mjesto}`}
              onClick={() => otvori(r.igrac)}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: [0.3, 0.6, 0][i] }}
            >
              {mjesto === 1 && (
                <motion.span
                  className="kruna"
                  animate={{ y: [0, -8, 0], rotate: [-6, 6, -6] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  👑
                </motion.span>
              )}
              <span className="postolje-lice">{r.igrac.ime[0]}</span>
              <strong>{r.igrac.ime}</strong>
              <span className="postolje-golovi">
                <Brojac do={r.golovi} /> ⚽
              </span>
              <div className="postolje-blok">{mjesto}</div>
            </motion.button>
          )
        })}
      </div>
      )}

      <div className="tabovi" role="tablist">
        {stupci.map(([k, naziv]) => (
          <button key={k} role="tab" aria-selected={poCemu === k} onClick={() => setPoCemu(k)}>
            {poCemu === k && <motion.span layoutId="tab-oznaka" className="tab-oznaka" />}
            <span>{naziv}</span>
          </button>
        ))}
      </div>

      <div className="tablica-omotac">
        <table className="tablica">
          <thead>
            <tr>
              <th>#</th>
              <th className="lijevo">Igrač</th>
              <th>NAS</th>
              <th>P</th>
              <th>N</th>
              <th>I</th>
              <th>GOL</th>
              <th>AST</th>
              <th>BOD</th>
            </tr>
          </thead>
          <tbody>
            {redovi.map((r, i) => (
              <motion.tr
                key={r.igrac.id}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => otvori(r.igrac)}
              >
                <td className="mjesto">{i + 1}</td>
                <td className="lijevo">
                  <div className="tablica-igrac">
                    <span className="mini-lice">{r.igrac.ime[0]}</span>
                    <div>
                      <strong>{r.igrac.ime}</strong>
                      <small>{r.igrac.nadimak}</small>
                    </div>
                    <motion.div
                      className="tablica-traka"
                      initial={false}
                      animate={{ width: `${(r[poCemu] / najvise) * 100}%` }}
                    />
                  </div>
                </td>
                <td>{r.nastupi}</td>
                <td>{r.pobjede}</td>
                <td>{r.nerijeseno}</td>
                <td>{r.porazi}</td>
                <td className={poCemu === 'golovi' ? 'istaknuto' : ''}>{r.golovi}</td>
                <td className={poCemu === 'asistencije' ? 'istaknuto' : ''}>{r.asistencije}</td>
                <td className={poCemu === 'bodovi' ? 'istaknuto' : ''}>{r.bodovi}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
