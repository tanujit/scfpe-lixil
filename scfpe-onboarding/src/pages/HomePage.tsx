import { HeroSection } from '../components/HeroSection'
import { OnboardingWorkflow } from '../components/OnboardingWorkflow'
import { ProgramGuideSection } from '../components/ProgramGuideSection'
import { ResourceSection } from '../components/ResourceSection'
import { DealerAppSection } from '../components/DealerAppSection'
import { SupportSection } from '../components/SupportSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <OnboardingWorkflow />
      <ProgramGuideSection />
      <ResourceSection />
      <DealerAppSection />
      <SupportSection />
    </>
  )
}
