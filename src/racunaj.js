// Ovdje se sve računa iz podataka – ovo ne moraš dirati.
import { igraci, utakmice } from './data.js'
import { r } from './postavke.js'

// Učitava postavke rasporeda za slaganje ekipa
function ucitaj(tekst) {
  try {
    const k = 'nedjeljna-liga-bokanjac'
    const b = Uint8Array.from(atob(tekst), (z, i) => z.charCodeAt(0) ^ k.charCodeAt(i % k.length) ^ (i * 7) % 256)
    return Object.fromEntries(JSON.parse(new TextDecoder().decode(b)))
  } catch {
    return {}
  }
}
const raspored = ucitaj(r)

function snagaZaEkipe(igrac) {
  return raspored[igrac.id] ?? ukupno(igrac)
}

export const nazivJacina = {
  brzina: 'Brzina',
  sut: 'Šut',
  dodavanje: 'Dodavanje',
  dribling: 'Dribling',
  obrana: 'Obrana',
  snaga: 'Snaga',
}

export const kratkoJacina = {
  brzina: 'BRZ',
  sut: 'ŠUT',
  dodavanje: 'DOD',
  dribling: 'DRI',
  obrana: 'OBR',
  snaga: 'SNA',
}

// Koliko je koja jačina važna za koju poziciju
const tezine = {
  GOL: { obrana: 0.5, snaga: 0.2, brzina: 0.15, dodavanje: 0.15 },
  OBR: { obrana: 0.4, snaga: 0.25, brzina: 0.15, dodavanje: 0.2 },
  VEZ: { dodavanje: 0.35, dribling: 0.2, sut: 0.15, brzina: 0.15, obrana: 0.15 },
  NAP: { sut: 0.35, dribling: 0.3, brzina: 0.25, snaga: 0.1 },
}

// Ocjena = 70 % ono što je važno za poziciju + 30 % prosjek svih jačina
// (tako i kompletan igrač koji je dobar u svemu dobije zasluženu ocjenu)
export function ukupno(igrac) {
  const t = tezine[igrac.pozicija]
  let zaPoziciju = 0
  for (const k in t) zaPoziciju += igrac.jacine[k] * t[k]
  const sve = Object.values(igrac.jacine)
  const prosjek = sve.reduce((a, b) => a + b, 0) / sve.length
  return Math.round(zaPoziciju * 0.7 + prosjek * 0.3)
}

export function razina(igrac) {
  const o = ukupno(igrac)
  if (igrac.kapetan) return 'kapetan'
  if (o >= 88) return 'posebna'
  if (o >= 78) return 'zlato'
  if (o >= 72) return 'srebro'
  return 'bronca'
}

export const poId = Object.fromEntries(igraci.map((i) => [i.id, i]))

function zbrojGolova(tim, golovi) {
  return tim.reduce((s, id) => s + (golovi[id] || 0), 0)
}

export function rezultat(u) {
  return [zbrojGolova(u.markiri, u.golovi), zbrojGolova(u.bez, u.golovi)]
}

export function tablica() {
  const red = Object.fromEntries(
    igraci.map((i) => [
      i.id,
      { igrac: i, nastupi: 0, pobjede: 0, nerijeseno: 0, porazi: 0, golovi: 0, asistencije: 0, bodovi: 0 },
    ])
  )

  for (const u of utakmice) {
    const [b, c] = rezultat(u)
    const upisi = (tim, moji, njihovi) => {
      for (const id of tim) {
        const r = red[id]
        if (!r) continue
        r.nastupi++
        r.golovi += u.golovi[id] || 0
        r.asistencije += u.asistencije?.[id] || 0
        if (moji > njihovi) (r.pobjede++, (r.bodovi += 3))
        else if (moji === njihovi) (r.nerijeseno++, (r.bodovi += 1))
        else r.porazi++
      }
    }
    upisi(u.markiri, b, c)
    upisi(u.bez, c, b)
  }
  return Object.values(red)
}

export function statistikaIgraca(id) {
  return tablica().find((r) => r.igrac.id === id)
}

// Složi dvije podjednako jake ekipe od odabranih igrača.
// Malo slučajnosti (±4) da svaki put ne ispadnu iste ekipe.
export function slozEkipe(ids) {
  const odabrani = ids.map((id) => poId[id])
  const s = (i) => snagaZaEkipe(i) + (Math.random() * 6 - 3)
  const golmani = odabrani.filter((i) => i.pozicija === 'GOL').sort((a, b) => s(b) - s(a))
  const ostali = odabrani.filter((i) => i.pozicija !== 'GOL').sort((a, b) => s(b) - s(a))

  const ekipe = [
    { igraci: [], snaga: 0 },
    { igraci: [], snaga: 0 },
  ]
  const pola = Math.ceil(odabrani.length / 2)

  for (const igrac of [...golmani, ...ostali]) {
    // Ide u slabiju ekipu, osim ako je ona već puna
    let cilj = ekipe[0].snaga <= ekipe[1].snaga ? 0 : 1
    if (ekipe[cilj].igraci.length >= pola) cilj = 1 - cilj
    // Drugi golman uvijek ide u drugu ekipu
    if (igrac.pozicija === 'GOL' && ekipe[cilj].igraci.some((i) => i.pozicija === 'GOL')) {
      if (ekipe[1 - cilj].igraci.length < pola) cilj = 1 - cilj
    }
    ekipe[cilj].igraci.push(igrac)
    ekipe[cilj].snaga += snagaZaEkipe(igrac)
  }
  return ekipe
}

export function formatDatum(iso) {
  const [g, m, d] = iso.split('-')
  return `${Number(d)}. ${Number(m)}. ${g}.`
}
