"use client"
import { useEffect, useRef } from "react"

export default function ScorePie({ data }: { data: { label: string; value: number }[] }) {
  // trivial donut chart using <canvas> to avoid extra deps
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(()=> {
    const c = ref.current; if (!c) return
    const ctx = c.getContext("2d")!
    const total = data.reduce((a,b)=>a+b.value,0) || 1
    let start = -Math.PI/2
    data.forEach(({ value }, i) => {
      const slice = (value/total) * Math.PI*2
      ctx.beginPath()
      ctx.moveTo(100,100)
      ctx.arc(100,100,100,start,start+slice)
      ctx.closePath()
      ctx.fillStyle = `hsl(${(i*65)%360},70%,50%)`
      ctx.fill()
      start += slice
    })
  },[data])
  return <canvas ref={ref} width={200} height={200} />
}
