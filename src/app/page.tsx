import profile from "../data/profile.json";
import SkillChart from "@/components/skillChart";

export default function Home() {

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-4xl font-bold">{profile.name}</h1>
      <p className="text-zinc-400">{profile.title}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Skills</h2>

        {/* Skill chart visualization */}
        <SkillChart />

        {/* Optional: text list */}
        <div className="mt-6 space-y-2">
          {profile.skills.map((skill) => (
            <div key={skill.name} className="w-64">
              <div className="flex justify-between text-sm">
                <span>{skill.name}</span>
                <span className="text-zinc-400">{skill.level}%</span>
              </div>

              <div className="h-2 bg-zinc-800 rounded mt-1">
                <div
                  className="h-2 bg-blue-500 rounded transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
