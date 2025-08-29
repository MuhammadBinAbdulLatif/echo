import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Phone, MessageSquare, AlertTriangle, Users, BarChart3, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-slate-950 to-black"></div>

      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/30 via-transparent to-slate-800/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-700/20 to-transparent"></div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-pulse opacity-40"></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-zinc-300/50 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-slate-300/40 rounded-full animate-pulse opacity-20"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-32 text-center">
        <div className="absolute inset-0 bg-gradient-radial from-zinc-900/40 via-transparent to-transparent"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-12 text-balance leading-tight">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              AI-Powered Solutions
            </span>
            <br />
            <span className="text-zinc-300">for the Future of Business</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-4xl mx-auto text-pretty leading-relaxed font-light">
            Revolutionize B2B communication with intelligent calls, seamless messaging, and proactive problem-solving,
            all driven by a single AI platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 border border-zinc-600 hover:border-zinc-500 text-white text-lg px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-zinc-900/50 font-medium"
            >
              Request a Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-zinc-600 text-zinc-300 hover:bg-zinc-900/50 hover:border-zinc-500 hover:text-white text-lg px-10 py-4 rounded-lg transition-all duration-300 bg-transparent font-medium"
            >
              Explore Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-32 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-20 text-balance">
            <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Intelligent Services
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-950/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <Phone className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Intelligent B2B Calls</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Automated sales, support, and lead generation handled by AI agents.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-950/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Dynamic Messaging Hub</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Centralize and automate client communication across all platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-950/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Proactive Problem Resolution</h3>
                <p className="text-zinc-400 leading-relaxed">AI identifies and solves issues before they escalate.</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-950/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Automated Lead Qualification</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Let AI agents qualify and nurture leads to fill your pipeline.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-950/90 backdrop-blur-sm md:col-span-2 lg:col-span-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Real-Time Analytics</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Gain deep insights into every conversation with AI-powered analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-32 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-20 text-balance">
            <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Trusted by Leaders
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-zinc-400 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed">
                  "This AI platform transformed our sales process. We're closing 40% more deals with half the effort."
                </p>
                <div>
                  <p className="font-semibold text-white">Sarah Chen</p>
                  <p className="text-zinc-500">VP Sales, TechFlow Inc</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-zinc-400 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed">
                  "The proactive problem resolution saved us countless hours. Our customer satisfaction is at an
                  all-time high."
                </p>
                <div>
                  <p className="font-semibold text-white">Marcus Rodriguez</p>
                  <p className="text-zinc-500">CTO, DataSync Solutions</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-zinc-400 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed">
                  "The analytics insights are incredible. We finally understand our customers at a deeper level."
                </p>
                <div>
                  <p className="font-semibold text-white">Emily Watson</p>
                  <p className="text-zinc-500">CEO, GrowthLab</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="px-6 py-32 relative">
        <div className="absolute inset-0 bg-gradient-radial from-zinc-900/30 via-transparent to-transparent"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-16 text-balance leading-tight">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Ready to Supercharge Your Business?
            </span>
          </h2>

          <Button
            size="lg"
            className="bg-white text-black hover:bg-zinc-200 text-xl px-12 py-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/20 font-semibold"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  )
}
