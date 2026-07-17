import { useMemo } from 'react'
import { composeAvatar, type AvatarConfig } from '../lib/avatar'

/** Renders a composed pixel avatar as crisp SVG rects.
 *  mode 'head' crops to the face (calling card / header); 'full' shows the
 *  whole body (profile) with an optional ground shadow. */
export function PixelAvatar({
  config,
  mode = 'full',
  size = 96,
  shadow = true,
}: {
  config: AvatarConfig
  mode?: 'head' | 'full'
  size?: number
  shadow?: boolean
}) {
  const grid = useMemo(() => composeAvatar(config), [config])

  const vb = mode === 'head' ? { x: 6, y: 0, w: 12, h: 16 } : { x: 3, y: 0, w: 18, h: 32 }
  const width = size
  const height = Math.round((size * vb.h) / vb.w)

  const rects: React.ReactNode[] = []
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const c = grid[y][x]
      if (c) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} />)
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
      role="img"
      aria-label="avatar"
    >
      {mode === 'full' && shadow && (
        <ellipse cx={11.5} cy={31.4} rx={6} ry={1.2} fill="#000" opacity={0.16} />
      )}
      {rects}
    </svg>
  )
}
