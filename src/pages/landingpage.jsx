export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#3C5148] to-[#5DDA4D] text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Kiwi</h1>
      <p className="text-lg md:text-xl max-w-xl text-center mb-8">
        Plan smarter. Stay organized. Take control of your schedule effortlessly.
      </p>
      <a
        href="/app"
        className="px-6 py-3 bg-white text-[#3C5148] rounded-xl shadow-lg hover:bg-[#C0C2B8] hover:text-[#020202] transition"
      >
        Get Started
      </a>
    </div>
  );
}
