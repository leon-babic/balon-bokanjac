// ============================================================
//  SVE PODATKE MIJENJAŠ OVDJE.
// ============================================================

export const liga = {
  naziv: 'Nedjeljna liga',
  mjesto: 'Balon Bokanjac',
  termin: 'Svake nedjelje',
  sezona: '2026./27.',
  // Kad počinje termin – za odbrojavanje na vrhu stranice.
  // dan: 0 = nedjelja, 1 = ponedjeljak ... 6 = subota
  dan: 0,
  sat: '20:00', // TODO: upiši pravo vrijeme termina
  trajanjeMinuta: 90,
}

// Javne jačine: zasad SVI IMAJU ISTO. Mijenjat će se tijekom sezone.
const pocetne = { brzina: 75, sut: 75, dodavanje: 75, dribling: 75, obrana: 75, snaga: 75 }

// tema: izgled kartice (boje i ukras) – vidi src/komponente/teme.css
// pozicija: 'GOL' (golman), 'OBR' (obrana), 'VEZ' (vezni), 'NAP' (napad)
// broj: broj na dresu
// efekt: posebna animacija kad otvoriš igrača:
//   'vatra', 'munja', 'zid', 'zvijezde', 'magija', 'raketa',
//   'kraken', 'klizanje', 'sokol', 'disko', 'barca', 'vojnik', 'srce', 'kajsad', 'sikra', 'krvnik',
//   'kapetan', 'mackica', 'dim'
//   ili null (bez efekta)
export const igraci = [
  { id: 'leon', ime: 'Leon', nadimak: 'Mečmejker', broj: 7, pozicija: 'VEZ', tema: 'real', efekt: 'kapetan', kapetan: true,
    opis: 'Kapetan i mečmejker. Složi termin, složi ekipe, a onda razigra cijeli balon.',
    jacine: pocetne },
  { id: 'ikic', ime: 'Ikić', nadimak: 'Kraken', broj: 1, pozicija: 'GOL', tema: 'direktor', efekt: 'kraken',
    opis: 'Ima više ruku nego hobotnica. Sve što dođe na gol – ostane u pipcima.',
    jacine: pocetne },
  { id: 'martin', ime: 'Martin', nadimak: 'Uklizavač', broj: 14, pozicija: 'OBR', tema: 'leclerc', efekt: 'klizanje',
    opis: 'Ne pita di je lopta. Ulazi u klizeći i na umjetnoj travi.',
    jacine: pocetne },
  { id: 'cenjo', ime: 'Čenjo', nadimak: 'Sikra', broj: 4, pozicija: 'OBR', tema: 'komunjara', efekt: 'sikra',
    opis: 'Obrana ko sikira – kad krene po nogama, napadač zna da je gotovo.',
    jacine: pocetne },
  { id: 'borna', ime: 'Borna', nadimak: 'Krvnik', broj: 96, pozicija: 'OBR', tema: 'alkohol', efekt: 'krvnik',
    opis: 'Svaku utakmicu nekog polomi. Hitna već zna di je balon na Bokanjcu.',
    jacine: pocetne },
  { id: 'diego', ime: 'Diego', nadimak: 'Maradona', broj: 10, pozicija: 'GOL', tema: 'maradona', efekt: 'magija',
    opis: 'Ime obvezuje. Lopta mu je zalipljena za nogu.',
    jacine: pocetne },
  { id: 'dome', ime: 'Dome', nadimak: 'Bibinj', broj: 8, pozicija: 'VEZ', tema: 'bibinje', efekt: 'mackica',
    opis: 'Kad krene napad, cijeli balon čuje: Diši, maćkice!',
    jacine: pocetne },
  { id: 'jure', ime: 'Jure', nadimak: 'Paški Sokol', broj: 11, pozicija: 'NAP', tema: 'sokol', efekt: 'sokol',
    opis: 'Leti po krilu ko sokol iznad Paga.',
    jacine: pocetne },
  { id: 'mario', ime: 'Mario', nadimak: 'DJ', broj: 6, pozicija: 'VEZ', tema: 'roza', efekt: 'disko',
    opis: 'Diktira ritam utakmice ko da pušta muziku.',
    jacine: pocetne },
  { id: 'kalac', ime: 'Kalac', nadimak: 'Barcelona 4Lyf', broj: 19, pozicija: 'NAP', tema: 'barca', efekt: 'barca',
    opis: 'Tiki-taka do kraja. Da može, igra bi u dresu Barce.',
    jacine: pocetne },
  { id: 'stevanja', ime: 'Števanja', nadimak: 'Papa Štrumf', broj: 23, pozicija: 'NAP', tema: 'marihuana', efekt: 'dim',
    opis: 'Na svaki termin dođe malo zadimljen. Zato je uvijek opušten – i high enough.',
    jacine: pocetne },
  { id: 'ivan', ime: 'Ivan', nadimak: 'Vojnik', broj: 69, pozicija: 'OBR', tema: 'vojska', efekt: 'vojnik',
    opis: 'Disciplina, red i nijedan pušteni igrač.',
    jacine: pocetne },
  { id: 'david', ime: 'David', nadimak: 'Cardio Mašina', broj: 21, pozicija: 'VEZ', tema: 'policija', efekt: 'srce',
    opis: 'Trči od prve do zadnje minute i ne ispuše se.',
    jacine: pocetne },
  { id: 'matija', ime: 'Matija', nadimak: 'A Kaj Sad', broj: 2, pozicija: 'OBR', tema: 'dinamo', efekt: 'kajsad',
    opis: 'Primi gol, slegne ramenima: a kaj sad? Idemo dalje.',
    jacine: pocetne },
]

// Svake nedjelje dodaš jednu utakmicu NA VRH popisa. Sezona počinje 25. 10. 2026.
// markiri = ekipa s markirima, bez = ekipa bez markira
// golovi/asistencije: id igrača -> broj. Rezultat se sam izračuna iz golova.
//
// Primjer kako izgleda jedna utakmica:
//   {
//     datum: '2026-10-25',
//     markiri: ['leon', 'ikic', 'kalac', 'mario', 'cenjo', 'borna', 'martin'],
//     bez: ['stevanja', 'diego', 'dome', 'matija', 'jure', 'david', 'ivan'],
//     golovi: { kalac: 3, leon: 1, stevanja: 2 },
//     asistencije: { mario: 2, matija: 1 },
//   },
export const utakmice = []
