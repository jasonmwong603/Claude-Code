import { useMemo } from 'react'
import { composeAvatar, type AvatarConfig } from '../lib/avatar'

/** Renders a composed pixel avatar as crisp SVG rects.
 *  mode 'head' crops to the face (calling card / header); 'full' shows the
 *  whole body (profile). */
export function PixelAvatar({
  config,
  mode = 'full',
  size = 96,
}: {
  config: AvatarConfig
  mode?: 'head' | 'full'
  size?: number
}) {
  const grid = useMemo(() => composeAvatar(config), [config])

  // viewBox crops: head = face region; full = whole silhouette (trim margins).
  const vb = mode === 'head' ? { x: 3, y: 0, w: 10, h: 11 } : { x: 2, y: 0, w: 12, h: 24 }
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
      {rects}
    </svg>
  )
}
