import { Button } from "@/components/ui/button";

export default function LandingInfoSections() {
  return (
    <div>
      {/* Why Choose Section */}
      <section className="py-24 bg-[#fafbe9]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-center">
            Why Choose <span className="text-[#f9a825]">Bharat</span>
            <span className="text-green-700">Skill</span> Connect?
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-10">
            Empowering local communities through skill sharing and knowledge exchange
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-xl border p-6 text-center">
              <div className="text-4xl mb-2 text-green-700">📍</div>
              <h3 className="font-bold text-lg mb-2">Hyperlocal Discovery</h3>
              <p>Find skilled professionals and learners in your neighborhood</p>
            </div>
            {/* Card 2 */}
            <div className="rounded-xl border p-6 text-center">
              <div className="text-4xl mb-2 text-green-700">👥</div>
              <h3 className="font-bold text-lg mb-2">P2P Learning</h3>
              <p>Direct connection between Gurus and Shishyas for personalized learning</p>
            </div>
            {/* Card 3 */}
            <div className="rounded-xl border p-6 text-center">
              <div className="text-4xl mb-2 text-green-700">⭐</div>
              <h3 className="font-bold text-lg mb-2">Trust & Reviews</h3>
              <p>Build trust through community ratings and verified reviews</p>
            </div>
            {/* Card 4 */}
            <div className="rounded-xl border p-6 text-center">
              <div className="text-4xl mb-2 text-green-700">🤝</div>
              <h3 className="font-bold text-lg mb-2">Build Community</h3>
              <p>Connect and grow with fellow enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-28 mt-2 mb-2 bg-[#fafbe9]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-center">How It Works</h2>
          <p className="text-xl text-muted-foreground text-center mb-10">
            Simple steps to start your learning journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="text-2xl bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">1</div>
              <h3 className="font-bold mb-2">Browse</h3>
              <p>Explore courses and skills available in your area. Use filters to find exactly what you need.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="text-2xl bg-[#f9a825] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">2</div>
              <h3 className="font-bold mb-2">Connect</h3>
              <p>Message instructors directly and enroll in courses that match your schedule and learning style.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="text-2xl bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">3</div>
              <h3 className="font-bold mb-2">Grow</h3>
              <p>Attend classes, complete assignments, and build your skills with expert guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Section */}
      <section className="py-24 bg-gradient-to-r from-[#e8f5e9] to-[#fffde7]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-2">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners and teachers in your community
          </p>
          <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg rounded" onClick={() => window.location.href='/auth'}>
            Start Learning Today
          </Button>
        </div>
      </section>
    </div>
  );
}
