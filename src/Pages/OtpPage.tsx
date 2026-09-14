import { useState, useRef, type FormEvent } from "react"
import { ArrowLeft, CheckCircle2, HeartPulse, RefreshCw, ShieldCheck } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { authService } from "@/api/authServices"

export default function OtpPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [verified, setVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const email = params.get("email") || "votre adresse email"

  const updateCode = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    setCode((current) => current.map((item, position) => (position === index ? digit : item)))
    // Auto-advance focus
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (code.join("").length !== 6) return toast.error("Saisissez les 6 chiffres du code.")
    setSubmitting(true)
    try {
      await authService.verifyOtp(email, code.join(""))
      setVerified(true)
      toast.success("Votre adresse e-mail est vérifiée.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Code OTP invalide.")
    } finally {
      setSubmitting(false)
    }
  }

  if (verified)
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 px-4">
        <section className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Adresse vérifiée !</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Votre compte MyBloodGift est maintenant sécurisé et actif.
          </p>
          <Button
            variant="primary"
            className="mt-6 w-full rounded-xl py-3 text-base font-bold"
            onClick={() => navigate("/login")}
          >
            Accéder à mon espace
          </Button>
        </section>
      </main>
    )

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 px-4 py-10">
      <section className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl sm:p-10">
          {/* Brand header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30">
              <HeartPulse className="h-8 w-8 heart-beat" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Vérifiez votre adresse</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Nous avons envoyé un code à 6 chiffres à{" "}
              <strong className="font-semibold text-slate-800">{email}</strong>.
            </p>
          </div>

          {/* OTP inputs */}
          <form onSubmit={submit}>
            <div className="flex justify-center gap-2.5 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  aria-label={`Chiffre ${index + 1}`}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => updateCode(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`h-13 w-11 rounded-xl border-2 bg-slate-50 text-center text-xl font-bold outline-none transition-all duration-200 sm:w-12 ${
                    digit
                      ? "border-red-400 bg-red-50/50 text-red-700 shadow-sm"
                      : "border-slate-200 text-slate-900 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  }`}
                />
              ))}
            </div>

            {/* Progress dots */}
            <div className="mt-5 flex justify-center gap-1.5">
              {code.map((d, i) => (
                <span
                  key={i}
                  className={`inline-block h-1.5 rounded-full transition-all duration-200 ${
                    d ? "w-4 bg-red-500" : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-7 w-full rounded-xl py-3 text-base font-bold shadow-md"
              disabled={submitting}
            >
              <ShieldCheck className="h-5 w-5" /> Vérifier le code
            </Button>
          </form>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-sm">
            <button
              type="button"
              className="flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-800"
              onClick={() => navigate("/signup")}
            >
              <ArrowLeft className="h-4 w-4" /> Modifier l'email
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 font-semibold text-red-600 transition hover:text-red-700"
              onClick={async () => {
                try {
                  await authService.requestOtp(email)
                  setCode(["", "", "", "", "", ""])
                  toast.success("Un nouveau code a été envoyé.")
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Impossible d'envoyer le code.")
                }
              }}
            >
              <RefreshCw className="h-4 w-4" /> Renvoyer le code
            </button>
          </div>
        </div>

        {/* Back link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Vous avez un compte ?{" "}
          <a href="/login" className="font-semibold text-red-600 hover:text-red-700 transition">
            Se connecter
          </a>
        </p>
      </section>
    </main>
  )
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 px-4 py-10">
      <section className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Réinitialiser le mot de passe</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Saisissez votre email pour recevoir un code de vérification.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!email.includes("@")) return toast.error("Saisissez une adresse email valide.")
              navigate(`/otp?email=${encodeURIComponent(email)}`)
            }}
          >
            <label className="block text-sm font-semibold text-slate-700">
              Adresse e-mail
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="nom@exemple.com"
              />
            </label>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-5 w-full rounded-xl py-3 text-base font-bold shadow-md"
            >
              Envoyer le code
            </Button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à la connexion
          </button>
        </div>
      </section>
    </main>
  )
}
