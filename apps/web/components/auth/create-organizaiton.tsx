
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Building2, Plus, ArrowRight } from "lucide-react"

export default function CreateOrganization() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center">
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

      <div className="relative z-10 px-6 max-w-2xl mx-auto text-center">
        <div className="absolute inset-0 bg-gradient-radial from-zinc-900/40 via-transparent to-transparent"></div>

        <Card className="bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm relative z-10">
          <CardContent className="p-12">
            <div className="w-20 h-20 mx-auto mb-8 bg-zinc-800 rounded-xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-zinc-300" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Create Your Organization
              </span>
            </h1>

            <p className="text-xl text-zinc-400 mb-12 text-pretty leading-relaxed font-light">
              Get started by setting up your organization to access AI-powered business solutions and manage your team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-zinc-200 text-lg px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/20 font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Organization
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-zinc-600 text-zinc-300 hover:bg-zinc-900/50 hover:border-zinc-500 hover:text-white text-lg px-10 py-4 rounded-lg transition-all duration-300 bg-transparent font-medium flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-800">
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your organization will be the central hub for managing AI agents, analytics, and team collaboration. You
                can invite team members and configure settings after creation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
