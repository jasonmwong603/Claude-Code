/* A monthly "log your savings" reminder, as a calendar file.
 *
 * The product only works if people come back once a month, and nothing was
 * bringing them back. Push notifications need a server, VAPID keys, and — on
 * iOS — the app to be installed first; email needs a provider and a scheduler.
 * A calendar event needs none of that: it works on every phone and desktop, it
 * survives the user clearing site data or switching devices, it costs nothing,
 * and it asks for no permission beyond opening a file.
 *
 * It also lands in the right place. A monthly money habit belongs next to
 * payday in someone's calendar, not in a notification tray they've muted. */

const PRODID = '-//KeyDate//Savings reminder//EN'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** iCalendar UTC stamp: 20260806T140000Z */
function stamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  )
}

/** RFC 5545 wants CRLF line breaks and escaped separators. */
function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/** Lines over 75 octets must be folded, or strict parsers (notably some
 *  Outlook versions) reject the file. */
function fold(line: string): string {
  if (line.length <= 74) return line
  const out: string[] = [line.slice(0, 74)]
  let rest = line.slice(74)
  while (rest.length > 73) {
    out.push(' ' + rest.slice(0, 73))
    rest = rest.slice(73)
  }
  if (rest) out.push(' ' + rest)
  return out.join('\r\n')
}

export interface ReminderOptions {
  /** Day of the month to fire on, 1-28. Capped at 28 so it exists in February. */
  day: number
  /** Local hour, 0-23. */
  hour?: number
  /** Where the reminder should send them back to. */
  url?: string
}

/** Build the .ics text for a monthly recurring reminder. */
export function buildReminderIcs({ day, hour = 19, url }: ReminderOptions): string {
  const safeDay = Math.min(28, Math.max(1, Math.round(day)))
  const now = new Date()

  // First occurrence: this month if the day hasn't passed, otherwise next.
  const first = new Date(now.getFullYear(), now.getMonth(), safeDay, hour, 0, 0)
  if (first.getTime() <= now.getTime()) first.setMonth(first.getMonth() + 1)
  const end = new Date(first.getTime() + 15 * 60 * 1000)

  const link = url || (typeof location !== 'undefined' ? location.origin + location.pathname : 'https://keydate.ca/app/')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:keydate-monthly-${safeDay}-${Date.now()}@keydate.ca`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(first)}`,
    `DTEND:${stamp(end)}`,
    `RRULE:FREQ=MONTHLY;BYMONTHDAY=${safeDay}`,
    `SUMMARY:${esc('🔑 Log this month’s savings — KeyDate')}`,
    `DESCRIPTION:${esc(`Add what you saved this month and watch your keys date move.\n\n${link}`)}`,
    `URL:${esc(link)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT10M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc('Log this month’s savings')}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

/** Hand the .ics to the OS. On iOS and Android this opens the calendar app
 *  directly; on desktop it downloads. */
export function downloadReminder(opts: ReminderOptions): void {
  const blob = new Blob([buildReminderIcs(opts)], { type: 'text/calendar;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = 'keydate-monthly-reminder.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Revoke on the next tick — revoking immediately cancels the download in
  // some browsers.
  setTimeout(() => URL.revokeObjectURL(href), 2000)
}
