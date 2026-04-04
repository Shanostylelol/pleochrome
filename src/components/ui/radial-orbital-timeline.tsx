"use client"
import { useState, useEffect, useRef } from "react"
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ShadcnButton } from "@/components/ui/button-shadcn"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-shadcn"

export interface TimelineItem {
  id: number
  title: string
  date: string
  content: string
  category: string
  icon: React.ElementType
  relatedIds: number[]
  status: "completed" | "in-progress" | "pending"
  energy: number
  href?: string
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[]
  onNodeClick?: (item: TimelineItem) => void
}

export default function RadialOrbitalTimeline({ timelineData, onNodeClick }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [rotationAngle, setRotationAngle] = useState<number>(0)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({})
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({})
      setActiveNodeId(null)
      setPulseEffect({})
      setAutoRotate(true)
    }
  }

  const toggleItem = (id: number) => {
    const item = timelineData.find(i => i.id === id)
    if (item && onNodeClick) { onNodeClick(item); return }

    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {}
      newState[id] = !prev[id]
      if (!prev[id]) {
        setActiveNodeId(id)
        setAutoRotate(false)
        const relatedItems = getRelatedItems(id)
        const np: Record<number, boolean> = {}
        relatedItems.forEach((relId) => { np[relId] = true })
        setPulseEffect(np)
        centerViewOnNode(id)
      } else {
        setActiveNodeId(null)
        setAutoRotate(true)
        setPulseEffect({})
      }
      return newState
    })
  }

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)))
      }, 50)
    }
    return () => { if (timer) clearInterval(timer) }
  }, [autoRotate])

  const centerViewOnNode = (nodeId: number) => {
    const idx = timelineData.findIndex((item) => item.id === nodeId)
    const targetAngle = (idx / timelineData.length) * 360
    setRotationAngle(270 - targetAngle)
  }

  const calcPos = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360
    const radius = 200
    const rad = (angle * Math.PI) / 180
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      zIndex: Math.round(100 + 50 * Math.cos(rad)),
      opacity: Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(rad)) / 2))),
    }
  }

  const getRelatedItems = (itemId: number): number[] => {
    return timelineData.find((item) => item.id === itemId)?.relatedIds ?? []
  }

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false
    return getRelatedItems(activeNodeId).includes(itemId)
  }

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "text-white bg-[#1B6B4A] border-[#1B6B4A]"
      case "in-progress": return "text-white bg-[#1A8B7A] border-[#1A8B7A]"
      case "pending": return "text-white/80 bg-white/10 border-white/30"
      default: return "text-white/80 bg-white/10 border-white/30"
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden" ref={containerRef} onClick={handleContainerClick}>
      {/* Desktop: orbital */}
      <div className="hidden sm:flex relative w-full max-w-4xl items-center justify-center" style={{ height: '520px' }}>
        <div className="absolute w-full h-full flex items-center justify-center" ref={orbitRef} style={{ perspective: "1000px" }}>
          {/* Center orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#1B6B4A] via-[#1A8B7A] to-[#1E3A6E] animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>
          {/* Orbit ring */}
          <div className="absolute w-96 h-96 rounded-full border border-white/10" />

          {timelineData.map((item, index) => {
            const pos = calcPos(index, timelineData.length)
            const isExpanded = expandedItems[item.id]
            const isRelated = isRelatedToActive(item.id)
            const isPulsing = pulseEffect[item.id]
            const Icon = item.icon
            return (
              <div key={item.id} ref={(el) => { nodeRefs.current[item.id] = el }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, zIndex: isExpanded ? 200 : pos.zIndex, opacity: isExpanded ? 1 : pos.opacity }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id) }}>
                {/* Glow */}
                <div className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse" : ""}`}
                  style={{ background: 'radial-gradient(circle, rgba(26,139,122,0.3) 0%, transparent 70%)', width: `${item.energy * 0.5 + 40}px`, height: `${item.energy * 0.5 + 40}px`, left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`, top: `-${(item.energy * 0.5 + 40 - 40) / 2}px` }} />
                {/* Node */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isExpanded ? "bg-white text-[#0A0F1A] border-white shadow-lg shadow-[#1A8B7A]/30 scale-150" : isRelated ? "bg-white/50 text-[#0A0F1A] border-white animate-pulse" : "bg-[#0A0F1A] text-white border-white/40"}`}>
                  <Icon size={16} />
                </div>
                {/* Label */}
                <div className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${isExpanded ? "text-white scale-110" : "text-white/70"}`}>
                  {item.title}
                </div>
                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-[#0A0F1A]/95 backdrop-blur-lg border-white/20 shadow-xl shadow-[#1A8B7A]/10 overflow-visible z-50">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/30" />
                    <CardHeader className="pb-2 p-4">
                      <div className="flex justify-between items-center">
                        <Badge className={getStatusStyles(item.status)}>
                          {item.status === "completed" ? "ESTABLISHED" : item.status === "in-progress" ? "ACTIVE" : "EMERGING"}
                        </Badge>
                        <span className="text-[10px] font-mono text-white/40">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/70 p-4 pt-0">
                      <p>{item.content}</p>
                      <div className="mt-3 pt-2 border-t border-white/10">
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="flex items-center text-white/50"><Zap size={10} className="mr-1" />Market Maturity</span>
                          <span className="font-mono text-white/60">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#1A8B7A] to-[#1B6B4A]" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <LinkIcon size={10} className="text-white/50 mr-1" />
                            <h4 className="text-[10px] uppercase tracking-wider font-medium text-white/50">Related Models</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const ri = timelineData.find((i) => i.id === relatedId)
                              return (
                                <ShadcnButton key={relatedId} variant="outline" size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-[10px] rounded-sm border-white/20 bg-transparent hover:bg-white/10 text-white/70"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId) }}>
                                  {ri?.title}<ArrowRight size={8} className="ml-1 text-white/40" />
                                </ShadcnButton>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      {item.href && (
                        <a href={item.href} className="mt-3 flex items-center gap-1 text-[11px] text-[#1A8B7A] hover:text-white transition-colors">
                          Read Full Analysis <ArrowRight size={12} />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile: vertical card list */}
      <div className="sm:hidden w-full space-y-3 px-4">
        {timelineData.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.id} onClick={() => toggleItem(item.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#1A8B7A]/40 transition-all text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1A8B7A]/20 border border-[#1A8B7A]/30 shrink-0">
                <Icon size={18} className="text-[#1A8B7A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{item.content}</p>
              </div>
              <ArrowRight size={16} className="text-white/30 shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
