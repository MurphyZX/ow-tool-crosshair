"use client"

interface CrosshairSettings {
  type: string
  color: string
  size: number
  gap: number
  outline: boolean
  dot: boolean
}

export function CrosshairPreview({ settings }: { settings: CrosshairSettings }) {
  const { type, color, size, gap, outline, dot } = settings
  const scale = size * 2
  const outlineWidth = outline ? 1 : 0

  return (
    <div className="flex h-full w-full items-center justify-center bg-[url('/blurred-game-environment-dark.jpg')] bg-cover bg-center">
      <svg width={100} height={100} viewBox="0 0 100 100" className="drop-shadow-lg">
        {type === "crosshair" && (
          <>
            {outline && (
              <>
                <rect
                  x={50 - 1 - outlineWidth}
                  y={50 - scale - gap - outlineWidth}
                  width={2 + outlineWidth * 2}
                  height={scale + outlineWidth * 2}
                  fill="#000"
                />
                <rect
                  x={50 - 1 - outlineWidth}
                  y={50 + gap - outlineWidth}
                  width={2 + outlineWidth * 2}
                  height={scale + outlineWidth * 2}
                  fill="#000"
                />
                <rect
                  x={50 - scale - gap - outlineWidth}
                  y={50 - 1 - outlineWidth}
                  width={scale + outlineWidth * 2}
                  height={2 + outlineWidth * 2}
                  fill="#000"
                />
                <rect
                  x={50 + gap - outlineWidth}
                  y={50 - 1 - outlineWidth}
                  width={scale + outlineWidth * 2}
                  height={2 + outlineWidth * 2}
                  fill="#000"
                />
              </>
            )}
            <rect x={50 - 1} y={50 - scale - gap} width={2} height={scale} fill={color} />
            <rect x={50 - 1} y={50 + gap} width={2} height={scale} fill={color} />
            <rect x={50 - scale - gap} y={50 - 1} width={scale} height={2} fill={color} />
            <rect x={50 + gap} y={50 - 1} width={scale} height={2} fill={color} />
          </>
        )}

        {type === "circle" && (
          <>
            {outline && <circle cx={50} cy={50} r={scale + 1} fill="none" stroke="#000" strokeWidth={3} />}
            <circle cx={50} cy={50} r={scale} fill="none" stroke={color} strokeWidth={2} />
          </>
        )}

        {type === "dot" && (
          <>
            {outline && <circle cx={50} cy={50} r={scale + 1} fill="#000" />}
            <circle cx={50} cy={50} r={scale} fill={color} />
          </>
        )}

        {dot && type !== "dot" && (
          <>
            {outline && <circle cx={50} cy={50} r={3} fill="#000" />}
            <circle cx={50} cy={50} r={2} fill={color} />
          </>
        )}
      </svg>
    </div>
  )
}
