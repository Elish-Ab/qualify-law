"use client"
export default function StatusBar({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((a,b)=>a+b.value,0) || 1
  return (
    <div className="w-full border rounded overflow-hidden h-6 flex">
      {data.map((d,i)=>(
        <div key={d.label} title={`${d.label}: ${d.value}`} style={{ width: `${(d.value/total)*100}%`, backgroundColor: `hsl(${(i*55)%360},70%,55%)` }} />
      ))}
    </div>
  )
}
