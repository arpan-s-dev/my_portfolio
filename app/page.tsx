import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProfileCard } from "@/components/home/profile-card"
import { GitHubActivity } from "@/components/home/github-activity"
import { TerritoryMap } from "@/components/home/territory-map"
import { LinkedInCard } from "@/components/home/linkedin-card"
import { TechStack } from "@/components/home/tech-stack"
import { AIAssistant } from "@/components/home/ai-assistant"
import { getContributions } from "@/lib/github-contributions"

const GITHUB_USERNAME = "arpan-s-dev"

export default async function HomePage() {
  const contributions = await getContributions(GITHUB_USERNAME)

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Navigation />

      <div className="mx-auto max-w-[1300px] px-6 pt-28 pb-12 md:pt-32">
        <div className="grid grid-cols-12 gap-6 grid-flow-row-dense auto-rows-min">
          {/* Profile card: spans entire left column across rows 1 + 2 */}
          <div className="col-span-12 md:col-span-4 md:row-span-2">
            <ProfileCard />
          </div>

          {/* Row 1 right: GitHub Activity */}
          <div className="col-span-12 md:col-span-8">
            <GitHubActivity
              contributions={contributions}
              username={GITHUB_USERNAME}
            />
          </div>

          {/* Row 2 right: Territory + LinkedIn side-by-side */}
          <div className="col-span-12 md:col-span-5">
            <TerritoryMap />
          </div>
          <div className="col-span-12 md:col-span-3">
            <LinkedInCard />
          </div>

          {/* Row 3: Tech Stack (under Profile) + AI Assistant */}
          <div className="col-span-12 md:col-span-4">
            <TechStack />
          </div>
          <div className="col-span-12 md:col-span-8">
            <AIAssistant />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
