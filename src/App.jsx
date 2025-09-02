import { useEffect, useState } from "react";
import "./index.css";

/* ---------------- Icons ---------------- */
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

/* ---------------- Loading ---------------- */
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-secondary">
    <h1
      className="text-6xl font-bold tracking-widest animate-pulse"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      Kiwi
    </h1>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-12 h-12 border-4 border-t-transparent border-muted rounded-full animate-spin" />
    <p className="mt-4 text-lg font-semibold text-muted">
      Generating your schedule...
    </p>
    <p className="text-sm text-muted/80">The AI is planning your week.</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
    <p className="font-bold">An Error Occurred</p>
    <p>{message}</p>
  </div>
);

/* ---------------- Header ---------------- */
const Header = () => (
  <header className="flex items-center justify-between p-4">
    <div className="flex items-center gap-2">
      <img
        src="/images/kiwi.png"
        alt="Kiwi Logo"
        className="w-10 h-10 object-contain"
      />

      <h1 className="text-2xl font-bold">Kiwi</h1>
    </div>
    <div className="text-muted text-sm">Your smart weekly planner</div>
  </header>
);

/* ---------------- Task Input ---------------- */
const TaskInput = ({ tasks, setTasks, startDate, setStartDate, onGenerate, loading }) => (
  <div className="p-4 bg-white rounded-xl shadow-card">
    <label className="block text-sm font-semibold mb-2 text-muted">YOUR TASKS</label>
    <textarea
      value={tasks}
      onChange={(e) => setTasks(e.target.value)}
      placeholder="e.g., Learn C#, work on startup, write report..."
      className="w-full h-32 p-3 border border-muted/50 rounded-xl focus:ring-2 focus:ring-[#16DB65]"
      disabled={loading}
    />

    <label className="block text-sm font-semibold mt-4 mb-2 text-muted">
      START DATE
    </label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full p-3 border border-muted/50 rounded-xl focus:ring-2 focus:ring-[#16DB65]"
      disabled={loading}
    />

    <button
      onClick={onGenerate}
      disabled={loading || !tasks.trim() || !startDate}
      className="mt-4 w-full flex items-center justify-center bg-[#020202] text-white font-bold py-3 px-4 rounded-xl hover:text-[#16DB65] disabled:bg-muted disabled:text-secondary"
    >
      {loading ? (
        <>
          <span className="w-5 h-5 mr-2 border-2 border-t-transparent border-primary/70 rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Icon path="M12 6v6l4 2" className="w-5 h-5 mr-2" />
          Generate Schedule
        </>
      )}
    </button>
  </div>
);

/* ---------------- Schedule Display ---------------- */
const ScheduleDisplay = ({ schedule, loading, error }) => {
  const parsedSchedule = schedule
    ? schedule
        .trim()
        .split("\n")
        .map((line) => {
          const [day, date, time, task, description] = line.split(";").map((i) => i.trim());
          return { day, date, time, task, description };
        })
    : [];

  const grouped = parsedSchedule.reduce((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = { date: entry.date, slots: {} };
    acc[entry.day].slots[entry.time] = { task: entry.task, description: entry.description };
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white rounded-xl shadow-card">
      <h2 className="text-sm font-semibold mb-3 text-muted">GENERATED SCHEDULE</h2>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && parsedSchedule.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-primary border border-muted/30">
            <thead>
              <tr className="bg-muted/10">
                <th className="p-2 border border-muted/30">Day</th>
                <th className="p-2 border border-muted/30">Morning (9AM-12PM)</th>
                <th className="p-2 border border-muted/30">Afternoon (1PM-4PM)</th>
                <th className="p-2 border border-muted/30">Evening (7PM-9PM)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([day, info], idx) => (
                <tr key={idx} className="border border-muted/20">
                  <td className="p-2 font-semibold border border-muted/30">
                    {day} <br />
                    <span className="text-xs text-muted">{info.date}</span>
                  </td>
                  {["Morning", "Afternoon", "Evening"].map((slot) => (
                    <td key={slot} className="p-2 border border-muted/30">
                      {info.slots[slot] ? (
                        <>
                          <span className="font-medium">{info.slots[slot].task}</span>
                          <p className="text-xs text-muted">{info.slots[slot].description}</p>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && !schedule && (
        <div className="text-center py-10 text-muted">
          <Icon
            path="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
            className="w-12 h-12 mx-auto mb-2"
          />
          <p>Your AI-planned week will appear here.</p>
        </div>
      )}
    </div>
  );
};

/* ---------------- Main App ---------------- */
export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [tasks, setTasks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setIsAppLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleGenerateSchedule = async () => {
  if (!tasks.trim() || !startDate) {
    setError("Please enter tasks and select a start date.");
    return;
  }

  setLoading(true);
  setError("");
  setSchedule("");

  const prompt = `
Create a balanced weekly schedule starting from ${startDate} for the following tasks: "${tasks}".  

Guidelines:
- Distribute tasks across 7 days (Sunday to Saturday).  
- Include dedicated days such as:
  • Review and Plan  
  • Relax and Recharge  
  • Catch Up and Deep Dive  
  • Free Time (preferably on Saturdays and Sundays).  
- Tasks should not always appear exactly as written. Rephrase them naturally so the schedule feels personalized.  
- Each task must have a short description (normal sentence, not rigid).  

Time slots:
- Morning (9AM - 12PM)  
- Afternoon (1PM - 4PM)  
- Evening (7PM - 9PM)  

Return the result as plain text, each line formatted exactly as:
Day;Date;Slot (Morning|Afternoon|Evening);Task;Short Description  

Example:
Sunday;2025-09-07;Morning;C# Practice;Focus on classes and objects  
Sunday;2025-09-07;Afternoon;Startup Work;Sketch landing page ideas  
Sunday;2025-09-07;Evening;Report Writing;Draft introduction and outline  
  `.trim();

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!res.ok) throw new Error(`API failed with status ${res.status}`);

    const data = await res.json();
    if (data?.candidates?.length) {
      const text = data.candidates[0]?.content?.parts?.[0]?.text ?? "";
      setSchedule(text);
    } else {
      throw new Error("No content was generated by the AI.");
    }
  } catch (e) {
    console.error(e);
    setError(e.message || "An unknown error occurred.");
  } finally {
    setLoading(false);
  }
};

  if (isAppLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-secondary text-primary">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <Header />
        <div className="space-y-4 mt-2">
          <TaskInput
            tasks={tasks}
            setTasks={setTasks}
            startDate={startDate}
            setStartDate={setStartDate}
            onGenerate={handleGenerateSchedule}
            loading={loading}
          />
          <ScheduleDisplay schedule={schedule} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
