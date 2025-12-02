"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  maxOpacity?: number
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.2,
  color = "rgb(255, 255, 255)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}: FlickeringGridProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = React.useState(false)
  const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 })

  const memoizedColor = React.useMemo(() => {
    const toRGBA = (value: string) => {
      if (typeof window === "undefined") {
        return "rgba(0, 0, 0,"
      }
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const context = canvas.getContext("2d")
      if (!context) return "rgba(0, 0, 0,"
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(context.getImageData(0, 0, 1, 1).data)
      return `rgba(${r}, ${g}, ${b},`
    }
    return toRGBA(color)
  }, [color])

  const setupCanvas = React.useCallback(
    (canvas: HTMLCanvasElement, targetWidth: number, targetHeight: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = targetWidth * dpr
      canvas.height = targetHeight * dpr
      canvas.style.width = `${targetWidth}px`
      canvas.style.height = `${targetHeight}px`
      const cols = Math.floor(targetWidth / (squareSize + gridGap))
      const rows = Math.floor(targetHeight / (squareSize + gridGap))

      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = React.useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity]
  )

  const drawGrid = React.useCallback(
    (
      ctx: CanvasRenderingContext2D,
      targetWidth: number,
      targetHeight: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j]
          ctx.fillStyle = `${memoizedColor}${opacity})`
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr
          )
        }
      }
    },
    [memoizedColor, squareSize, gridGap]
  )

  React.useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsInView(entry.isIntersecting)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(container)

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setCanvasSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          })
        }
      }
    })

    resizeObserver.observe(container)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return

    const context = canvas.getContext("2d")
    if (!context) return

    const { cols, rows, squares, dpr } = setupCanvas(
      canvas,
      width ?? canvasSize.width,
      height ?? canvasSize.height
    )

    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000
      lastTime = time

      if (isInView) {
        updateSquares(squares, deltaTime)
        drawGrid(
          context,
          width ?? canvasSize.width,
          height ?? canvasSize.height,
          cols,
          rows,
          squares,
          dpr
        )
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    canvasSize.height,
    canvasSize.width,
    drawGrid,
    height,
    isInView,
    setupCanvas,
    updateSquares,
    width,
  ])

  return (
    <div ref={containerRef} className={cn("relative", className)} {...props}>
      <canvas ref={canvasRef} />
    </div>
  )
}
