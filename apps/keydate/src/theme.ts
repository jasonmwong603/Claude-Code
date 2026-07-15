/* "Prairie dawn" design tokens. Kept as a plain object so inline styles across
   the app can reference C.spruce etc., exactly as the prototype did. */
export const C = {
  paper: '#F7F8F4',
  ink: '#17302A',
  spruce: '#1E4D3B',
  sprout: '#3FA672',
  sproutSoft: '#E3F2E9',
  gold: '#E8B84B',
  goldSoft: '#FBF3DD',
  line: '#DDE4DC',
  sub: '#5C6F66',
  err: '#B4452F',
} as const

export const DISPLAY_FONT = "'Bricolage Grotesque', sans-serif"
export const BODY_FONT = "'Inter', system-ui, sans-serif"
