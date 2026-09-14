import { HeartPulse, LoaderCircle, RefreshCw, WifiOff } from "lucide-react"

export function LoadingScreen({ message = "Chargement en cours…" }: { message?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl bg-white/80 p-8 backdrop-blur-sm">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <LoaderCircle className="h-7 w-7 animate-spin" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">{message}</p>
        <p className="mt-1 text-xs text-slate-500">Veuillez patienter quelques secondes.</p>
      </div>
    </div>
  )
}

export function NetworkErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-300">
          <WifiOff className="h-8 w-8" />
        </div>
        <HeartPulse className="mx-auto mt-6 h-7 w-7 text-red-400" />
        <h1 className="mt-3 text-2xl font-bold">Connexion interrompue</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Le réseau est indisponible ou le serveur met trop de temps à répondre.
          Vérifiez votre connexion puis réessayez.
        </p>
        <button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold hover:bg-red-500">
          <RefreshCw className="h-4 w-4" /> Réessayer
        </button>
      </div>
    </div>
  )
}
