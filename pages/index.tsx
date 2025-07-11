import WorldIDGate from "../components/WorldIDGate";
import StakingDashboard from "../components/StakingDashboard";

export default function Home() {
  return (
    <main>
      <WorldIDGate>
        <StakingDashboard />
      </WorldIDGate>
    </main>
  );
}
