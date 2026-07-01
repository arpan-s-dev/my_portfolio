import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProfileCard } from "@/components/home/profile-card"
import { GitHubActivity } from "@/components/home/github-activity"
import { TerritoryMap } from "@/components/home/territory-map"
import { LinkedInCard } from "@/components/home/linkedin-card"
import { AchievementHighlights } from "@/components/home/achievement-highlights"
import { TechStack } from "@/components/home/tech-stack"
import { BootIntro } from "@/components/home/boot-intro"
import { BackgroundGlobe } from "@/components/home/background-globe"
import { ProjectsSection } from "@/components/projects/projects-section"
import { ArchitectureSection } from "@/components/architecture/architecture-section"
import { getContributions } from "@/lib/github-contributions"

const GITHUB_USERNAME = "arpan-s-dev"

export default async function HomePage() {
  const contributions = await getContributions(GITHUB_USERNAME)

  return (
    <main
      className="relative isolate min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <BootIntro />
      <BackgroundGlobe />
      <div className="relative z-10">
        <Navigation />

        <section id="home" className="scroll-mt-28">
          <div className="mx-auto max-w-[1300px] px-6 pt-28 pb-12 md:pt-32">
            <div className="grid auto-rows-min grid-flow-row-dense grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4 md:row-span-2">
                <ProfileCard />
              </div>

              <div className="col-span-12 md:col-span-8">
                <GitHubActivity
                  contributions={contributions}
                  username={GITHUB_USERNAME}
                />
              </div>

              <div className="col-span-12 md:col-span-5">
                <TerritoryMap />
              </div>
              <div className="col-span-12 md:col-span-3">
                <LinkedInCard />
              </div>

              <div className="col-span-12">
                <TechStack />
              </div>

              <div className="col-span-12">
                <AchievementHighlights />
              </div>
            </div>
          </div>
        </section>

        <ProjectsSection />
        <ArchitectureSection />

        <Footer />
      </div>
    </main>
  )
}
