/**
 * Fetches the last 365 days of GitHub contributions for a public user via the
 * jogruber third-party API (mirror of github.com/users/<user>/contributions).
 *
 * Pure server-side helper — do not import from a client component. The next
 * fetch cache + revalidate keeps this to ~1 request per hour per username.
 */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface DayContribution {
  date: string
  count: number
  level: ContributionLevel
}

export interface ContributionData {
  total: number
  /** 52–53 columns of 7 days (Sun–Sat), padded with empty days for the first/last partial weeks. */
  weeks: DayContribution[][]
}

const EMPTY_DAY: DayContribution = { date: "", count: 0, level: 0 }

function buildEmptyWeeks(): DayContribution[][] {
  return Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => ({ ...EMPTY_DAY }))
  )
}

const FALLBACK: ContributionData = {
  total: 0,
  weeks: buildEmptyWeeks(),
}

interface JogruberResponse {
  total: Record<string, number>
  contributions: { date: string; count: number; level: ContributionLevel }[]
}

export async function getContributions(
  username: string,
  revalidateSeconds = 3600
): Promise<ContributionData> {
  if (!username) return FALLBACK

  try {
    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
      username
    )}?y=last`
    const res = await fetch(url, { next: { revalidate: revalidateSeconds } })
    if (!res.ok) {
      console.warn(
        `[contributions] ${username}: HTTP ${res.status} from jogruber API`
      )
      return FALLBACK
    }

    const data = (await res.json()) as JogruberResponse
    const days = [...data.contributions].sort((a, b) =>
      a.date.localeCompare(b.date)
    )
    if (days.length === 0) return FALLBACK

    // Anchor the grid to Sunday of the first week — pad the first week with
    // empty days so each column displays a clean Sun-through-Sat strip.
    const firstDate = new Date(days[0].date + "T00:00:00")
    const firstDayOfWeek = firstDate.getUTCDay() // 0 = Sun

    const weeks: DayContribution[][] = []
    let current: DayContribution[] = []
    for (let i = 0; i < firstDayOfWeek; i++) current.push({ ...EMPTY_DAY })

    for (const day of days) {
      current.push(day)
      if (current.length === 7) {
        weeks.push(current)
        current = []
      }
    }
    if (current.length > 0) {
      while (current.length < 7) current.push({ ...EMPTY_DAY })
      weeks.push(current)
    }

    const total =
      data.total?.lastYear ??
      Object.values(data.total ?? {})[0] ??
      days.reduce((sum, d) => sum + d.count, 0)

    return { total, weeks }
  } catch (err) {
    console.warn(`[contributions] ${username}: fetch threw`, err)
    return FALLBACK
  }
}
