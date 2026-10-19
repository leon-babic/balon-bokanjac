import { motion } from 'motion/react'
import { useEffect } from 'react'
import Kartica from './Kartica.jsx'
import Efekt from './Efekt.jsx'
import { trajanjeUvoda } from './PosebniEfekti.jsx'
import Brojac from './Brojac.jsx'
import { nazivJacina, statistikaIgraca } from '../racunaj.js'

const nazivEfekta = {
  vatra: '🔥 Vatreni šut',
  munja: '⚡ Refleksi munje',
  zid: '🧱 Neprobojni zid',
  zvijezde: '⭐ Kapetanska zvijezda',
  magija: '🪄 Mađioničar s loptom',
  raketa: '🚀 Raketna brzina',
  kraken: '🐙 Kraken iz gola',
  klizanje: '🦵 Klizeći start',
  sokol: '🦅 Sokolov let',
  disko: '🪩 DJ za pultom',
  barca: '💙❤️ Barça zauvijek',
  vojnik: '🎖️ Vojnička disciplina',
  srce: '❤️ Pluća bez dna',
  kajsad: '🤷 A kaj sad?',
  sikra: '🪓 Sikira po nogama',
  krvnik: '🚑 Svaku utakmicu nekog polomi',
  kapetan: '👑 Kapetan i mečmejker',
  mackica: '🐈 Diši, maćkice!',
  dim: '🌿 Uvijek high enough',
}

// Prozor koji se otvori kad klikneš na igrača
export default function Profil({ igrac, zatvori }) {
  const stat = statistikaIgraca(igrac.id)
  const uvod = trajanjeUvoda[igrac.efekt] || 0

  useEffect(() => {
    const tipka = (e) => e.key === 'Escape' && zatvori()
    window.addEventListener('keydown', tipka)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', tipka)
      document.body.style.overflow = ''
    }
  }, [zatvori])

  return (
    <motion.div
      className="profil-pozadina"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={zatvori}
    >
      <Efekt vrsta={igrac.efekt} />
      <motion.div
        className="profil"
        role="dialog"
        aria-label={igrac.nadimak}
        initial={{ scale: 0.6, rotateY: -90, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20, delay: uvod }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="profil-zatvori" onClick={zatvori} aria-label="Zatvori">
          ✕
        </button>

        <Kartica igrac={igrac} velika />

        <div className="profil-desno">
          {igrac.efekt && (
            <motion.p
              className="profil-efekt"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: uvod + 0.4 }}
            >
              {nazivEfekta[igrac.efekt]}
            </motion.p>
          )}
          <h3>
            {igrac.ime} <span>„{igrac.nadimak}”</span>
          </h3>
          <p className="profil-opis">{igrac.opis}</p>

          <div className="trake">
            {Object.entries(igrac.jacine).map(([k, v], i) => (
              <div className="traka" key={k}>
                <span>{nazivJacina[k]}</span>
                <div className="traka-pozadina">
                  <motion.div
                    className="traka-ispuna"
                    style={{ '--h': Math.round((v / 99) * 120) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${v}%` }}
                    transition={{ delay: uvod + 0.3 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <strong>{v}</strong>
              </div>
            ))}
          </div>

          <div className="profil-sezona">
            {[
              ['Golovi', stat.golovi],
              ['Asist.', stat.asistencije],
              ['Nastupi', stat.nastupi],
              ['Pobjede', stat.pobjede],
            ].map(([naziv, broj]) => (
              <div key={naziv}>
                <strong>
                  <Brojac do={broj} />
                </strong>
                <span>{naziv}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <Efekt vrsta={igrac.efekt} sloj="iznad" />
    </motion.div>
  )
}
