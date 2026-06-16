import Card from "@/components/Card";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-4xl font-bold mb-8">StartupOS</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Goal">
          <p>Reach 100 paying customers</p>
        </Card>

        <Card title="Health Score">
          <p className="text-3xl font-bold">78/100</p>
        </Card>

        <Card title="Top Risks">
          <ul className="list-disc pl-5">
            <li>Low customer activation</li>
            <li>No onboarding flow</li>
            <li>Few customer interviews</li>
          </ul>
        </Card>

        <Card title="Opportunities">
          <ul className="list-disc pl-5">
            <li>Referral program</li>
            <li>Email outreach</li>
            <li>Early adopter community</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}