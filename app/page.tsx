export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-4xl font-bold mb-8">StartupOS</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="font-semibold">Goal</h2>
          <p>Reach 100 paying customers</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="font-semibold">Health Score</h2>
          <p className="text-3xl font-bold">78/100</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="font-semibold">Top Risks</h2>
          <ul>
            <li>Low customer activation</li>
            <li>No onboarding flow</li>
            <li>Few customer interviews</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="font-semibold">Opportunities</h2>
          <ul>
            <li>Referral program</li>
            <li>Email outreach</li>
            <li>Early adopter community</li>
          </ul>
        </div>
      </div>
    </main>
  );
}