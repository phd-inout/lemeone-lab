import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center scanlines font-display p-4">
      <div className="w-full max-w-md border border-border-dark bg-[#0a0f14] shadow-2xl relative overflow-hidden">
        {/* Decorative header */}
        <div className="h-1 bg-primary/80 absolute top-0 left-0 w-full shadow-[0_0_10px_rgba(0,255,136,0.5)]"></div>
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <span className="material-symbols-outlined text-[120px] text-white">fingerprint</span>
        </div>

        <div className="p-8 relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-widest flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-4xl">terminal</span>
              CORTEX<span className="text-gray-600">_OS</span>
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-sm leading-relaxed">
              [ AUTHENTICATION REQUIRED ]<br/>
              ENTER SYSTEM CREDENTIALS TO COMPROMISE LAB ENVIRONMENT
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest" htmlFor="email">
                &gt; Identity_Token (Email)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-black border border-border-dark text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="founder@cyberspace.net"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest" htmlFor="password">
                &gt; Security_Key (Password)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-black border border-border-dark text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                formAction={login}
                className="flex-1 bg-transparent border border-primary text-primary font-bold py-3 uppercase tracking-widest hover:bg-primary hover:text-black transition-colors"
              >
                [ LOGIN ]
              </button>
              <button
                formAction={signup}
                className="flex-1 bg-transparent border border-border-dark text-gray-400 font-bold py-3 uppercase tracking-widest hover:border-gray-300 hover:text-white transition-colors"
              >
                [ REGISTER ]
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-border-dark pt-6">
            <p className="text-xs text-gray-600 font-mono">
              SECURE CONNECTION IDENTIFIED.<br/>
              UNAUTHORIZED ACCESS IS STRICTLY MONITORED.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
