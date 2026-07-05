import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { invitation } from "./config/invitation";
import PageShell, { AppFrame } from "./components/Layout/PageShell";
import SEO from "./components/SEO/SEO";
import LoadingScreen from "./components/Opening/LoadingScreen";
import InvitationReveal from "./components/Opening/InvitationReveal";
import ScratchReveal from "./components/Opening/ScratchReveal";
import BismillahIntro from "./components/Opening/BismillahIntro";
import Hero from "./components/Hero/Hero";
import DualCountdown from "./components/Hero/DualCountdown";
import EventHall from "./components/Events/EventHall";
import BottomNav from "./components/Navigation/BottomNav";
import AudioPlayer from "./components/Audio/AudioPlayer";
import PalaceBackground from "./components/Effects/PalaceBackground";
import { validateInvitationConfig } from "./utils/configValidation";

const RSVPForm = lazy(() => import("./components/RSVP/RSVPForm"));
const ClosingCeremony = lazy(() => import("./components/Footer/ClosingCeremony"));
const ShareInvitation = lazy(() => import("./components/Share/ShareInvitation"));
const Particles = lazy(() => import("./components/Effects/Particles"));
const Petals = lazy(() => import("./components/Effects/Petals"));
const Lanterns = lazy(() => import("./components/Effects/Lanterns"));

function SectionLoader() {
  return <div className="section-loader" aria-hidden="true" />;
}

export default function App() {
  const { features } = invitation;
  const startMusicRef = useRef(null);
  const [loadingDone, setLoadingDone] = useState(!features.loadingScreen);
  const [revealDone, setRevealDone] = useState(!(features.invitationReveal ?? features.palaceDoors));
  const [scratchDone, setScratchDone] = useState(!features.scratchReveal);
  const [entered, setEntered] = useState(false);
  const [introDone, setIntroDone] = useState(!features.bismillahIntro);
  const [activeVariant, setActiveVariant] = useState("entrance");
  const [farewellVisible, setFarewellVisible] = useState(false);

  useEffect(() => {
    validateInvitationConfig(invitation);
  }, []);

  const registerMusicStart = useCallback((startMusic) => {
    startMusicRef.current = startMusic;
  }, []);

  const startMusicFromGesture = useCallback(() => {
    startMusicRef.current?.();
  }, []);

  return (
    <AppFrame invitation={invitation}>
      <SEO invitation={invitation} />
      {!loadingDone && (
        <LoadingScreen
          opening={invitation.opening}
          onComplete={() => setLoadingDone(true)}
        />
      )}

      {loadingDone && !revealDone && <InvitationReveal opening={invitation.opening} onComplete={() => setRevealDone(true)} />}

      {loadingDone && revealDone && !entered && (
        <ScratchReveal
          opening={invitation.opening}
          nikah={invitation.nikah}
          reception={invitation.reception}
          scratchDone={scratchDone}
          onScratchComplete={() => setScratchDone(true)}
          onEnter={() => setEntered(true)}
          onMusicStart={startMusicFromGesture}
        />
      )}

      {entered && !introDone && (
        <BismillahIntro opening={invitation.opening} onComplete={() => setIntroDone(true)} />
      )}

      {introDone && (
        <>
          <PalaceBackground theme={invitation.theme} variant={activeVariant} />
          <Suspense fallback={null}>
            {features.particles && <Particles />}
            {features.petals && <Petals />}
            {features.lanterns && <Lanterns />}
          </Suspense>

          <PageShell id="home" variant="entrance">
            <Hero invitation={invitation} />
          </PageShell>

          {features.dualCountdown && (
            <PageShell id="countdown" variant="couple">
              <DualCountdown nikah={invitation.nikah} reception={invitation.reception} />
            </PageShell>
          )}

          <PageShell id="nikah" variant="nikah">
            <EventHall event={invitation.nikah} type="nikah" />
          </PageShell>

          <PageShell id="reception" variant="reception">
            <EventHall event={invitation.reception} type="reception" />
          </PageShell>

          {features.rsvp && invitation.rsvp.enabled && (
            <PageShell id="rsvp" variant="rsvp">
              <Suspense fallback={<SectionLoader />}>
                <RSVPForm rsvp={invitation.rsvp} thankYouMessage={invitation.messages.thankYou} />
                {invitation.share?.enabled && <ShareInvitation invitation={invitation} />}
              </Suspense>
            </PageShell>
          )}

          {features.closingCeremony && (
            <PageShell id="farewell" variant="farewell">
              <Suspense fallback={<SectionLoader />}>
                <ClosingCeremony invitation={invitation} onFarewellVisible={() => setFarewellVisible(true)} />
              </Suspense>
            </PageShell>
          )}

          {features.bottomNavigation && <BottomNav onActiveChange={setActiveVariant} dimmed={activeVariant === "farewell"} />}
        </>
      )}
      {revealDone && features.music && invitation.music.enabled && (
        <AudioPlayer
          music={invitation.music}
          shouldStart={entered}
          visible={introDone}
          fadeOut={farewellVisible || activeVariant === "farewell"}
          registerStart={registerMusicStart}
        />
      )}
    </AppFrame>
  );
}
