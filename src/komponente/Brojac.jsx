import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

// Broj koji se "odbrojava" od 0 do vrijednosti kad se pojavi na ekranu
export default function Brojac({ do: vrijednost, trajanje = 1.2 }) {
  const ref = useRef(null)
  const vidljiv = useInView(ref, { once: true })
  const [broj, setBroj] = useState(0)

  useEffect(() => {
    if (!vidljiv) return
    const a = animate(0, vrijednost, {
      duration: trajanje,
      ease: 'easeOut',
      onUpdate: (v) => setBroj(Math.round(v)),
    })
    return () => a.stop()
  }, [vidljiv, vrijednost, trajanje])

  return <span ref={ref}>{broj}</span>
}
