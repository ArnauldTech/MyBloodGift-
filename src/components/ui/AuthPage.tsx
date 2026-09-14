import { useState, type FormEvent, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  Info,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/api/authServices"
import { Button } from "../ui/button"
import { LoadingScreen } from "./LoadingScreen"

type AuthPageProps = { mode: "login" | "signup" }
type SignupData = {
  nom: string
  email: string
  password: string
  confirmPassword: string
  role: "donneur" | "demandeur" | "hopital"
  dateNaissance: string
  genre: string
  groupeSanguin: string
  enBonneSante: string
  donRecent: string
  medication: string
  establishmentName: string
  establishmentType: string
  licenseNumber: string
  city: string
  address: string
}

const initialData: SignupData = {
  nom: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "donneur",
  dateNaissance: "",
  genre: "",
  groupeSanguin: "",
  enBonneSante: "oui",
  donRecent: "non",
  medication: "non",
  establishmentName: "",
  establishmentType: "",
  licenseNumber: "",
  city: "",
  address: "",
}
const fieldClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

export default function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup"
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (key: keyof SignupData, value: string) =>
    setData((current) => ({ ...current, [key]: value }))

  const validateStep = () => {
    if (
      step === 1 &&
      (!data.nom.trim() ||
        !data.email.includes("@") ||
        data.password.length < 8 ||
        data.password !== data.confirmPassword)
    ) {
      toast.error("Vérifiez votre nom, votre email et vos mots de passe.")
      return false
    }
    if (step === 2 && data.role !== "hopital" && (!data.dateNaissance || !data.genre)) {
      toast.error("Complétez vos informations personnelles.")
      return false
    }
    if (step === 2 && data.role === "hopital" && (!data.establishmentName.trim() || !data.establishmentType || !data.licenseNumber.trim() || !data.city.trim() || !data.address.trim())) {
      toast.error("Renseignez les informations officielles de l'établissement.")
      return false
    }
    if (step === 3 && data.enBonneSante === "non") {
      toast.error("Veuillez consulter un professionnel avant de planifier un don.")
      return false
    }
    if (step === 3 && (data.donRecent === "oui" || data.medication === "oui")) {
      toast.error("Votre situation nécessite une validation médicale avant l’inscription au don.")
      return false
    }
    return true
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isSignup) {
      if (!data.email.includes("@") || !data.password)
        return toast.error("Saisissez un email et un mot de passe valides.")
      try {
        setSubmitting(true)
        const response = await authService.login({ email: data.email, password: data.password })
        toast.success(response.message || "Connexion réussie")
        const destinations: Record<string, string> = {
          donneur: "/donneur",
          demandeur: "/demandeur",
          hopital: "/hospital",
          hospital: "/hospital",
          admin: "/admin",
        }
        navigate(destinations[response.role ?? "donneur"] ?? "/donneur")
      } catch (error) {
        const apiError = error as { response?: { data?: { detail?: string } } }
        toast.error(apiError.response?.data?.detail ?? (error instanceof Error ? error.message : "Impossible de se connecter."))
      } finally {
        setSubmitting(false)
      }
      return
    }
    if (!validateStep()) return
    const finalStep = data.role === "hopital" ? 2 : 3
    if (step < finalStep) return setStep((current) => current + 1)
    try {
      setSubmitting(true)
      const nameParts = data.nom.trim().split(/\s+/)
      const firstName = nameParts.shift() ?? data.nom.trim()
      await authService.signup({
        first_name: firstName,
        last_name: nameParts.join(" ") || firstName,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.groupeSanguin
          ? {
              blood_group: data.groupeSanguin.replace(/[+-]/, "") as "A" | "B" | "AB" | "O",
              rhesus: data.groupeSanguin.endsWith("+") ? "+" : "-",
            }
          : {}),
        ...(data.role === "hopital"
          ? {
              establishment_name: data.establishmentName,
              establishment_type: data.establishmentType,
              license_number: data.licenseNumber,
              city: data.city,
              address: data.address,
            }
          : {}),
      })
      setSuccess(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de créer le compte.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success)
    return (
      <SuccessScreen
        onDashboard={() => {
          const dest = data.role === "hopital" ? "/hospital" : data.role === "demandeur" ? "/demandeur" : "/donneur"
          navigate(dest)
        }}
        onCenters={() => navigate("/Centres")}
        onVerify={async () => {
          try {
            await authService.requestOtp(data.email)
            navigate(`/otp?email=${encodeURIComponent(data.email)}`)
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Impossible d'envoyer le code OTP.")
          }
        }}
      />
    )


  return (
    <main className="relative min-h-screen bg-[#f4faff] px-4 py-8 text-slate-900 sm:px-6 md:py-12 flex items-center">
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <LoadingScreen message={isSignup ? "Création sécurisée de votre compte…" : "Connexion à votre espace…"} />
          </div>
        </div>
      )}
      <div
        className={`mx-auto grid w-full ${isSignup ? "max-w-lg" : "max-w-6xl lg:grid-cols-[1.1fr_0.9fr]"} items-center gap-8`}
      >
        <BrandIntro hidden={isSignup} />
        <section className="rounded-xl border border-[#e4beba] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-10">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-red-600">
              <HeartPulse className="h-8 w-8" />
              <span className="text-xl font-bold">My BloodGift</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              {isSignup ? "Créer un compte" : "Bon retour"}
            </h1>
          </div>
          {isSignup ? (
            <Progress step={step} total={data.role === "hopital" ? 2 : 3} />
          ) : (
            <p className="mb-6 text-sm text-slate-500">
              Connectez-vous pour accéder à votre espace sécurisé.
            </p>
          )}
          <form className="mt-8 space-y-6" onSubmit={submit}>
            {isSignup && step === 1 && (
              <button
                type="button"
                onClick={() =>
                  toast.info("La connexion Google sera activée avec le fournisseur OAuth.")
                }
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e4beba] px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#e9f6fd]"
              >
                <span className="font-bold text-blue-600">G</span> Continuer avec Google
              </button>
            )}
            {isSignup ? (
              <SignupStep
                step={step}
                data={data}
                update={update}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            ) : (
              <LoginFields
                data={data}
                update={update}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {isSignup && step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => setStep((current) => current - 1)}
                >
                  <ArrowLeft className="h-4 w-4" /> Retour
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit" variant="primary" size="lg" className="rounded-lg" disabled={submitting}>
                {isSignup ? (step === (data.role === "hopital" ? 2 : 3) ? "Soumettre l'inscription" : "Continuer") : "Se connecter"}
                {isSignup && step < (data.role === "hopital" ? 2 : 3) ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </div>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            {isSignup ? (
              <>
                Déjà membre ?{" "}
                <a className="font-semibold text-blue-700 hover:underline" href="/login">
                  Se connecter
                </a>
              </>
            ) : (
              <>
                Pas encore de compte ?{" "}
                <a className="font-semibold text-red-600 hover:underline" href="/signup">
                  Créer un compte
                </a>
              </>
            )}
          </p>
        </section>
      </div>
    </main>
  )
}

function BrandIntro({ hidden }: { hidden: boolean }) {
  if (hidden) return null
  return (
    <section className="hidden space-y-8 lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white">
          <HeartPulse />
        </div>
        <div>
          <p className="text-3xl font-black text-red-600">MyBloodGift</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Système de gestion du sang
          </p>
        </div>
      </div>
      <h2 className="max-w-xl text-5xl font-semibold leading-tight">
        La coordination qui transforme chaque don en <span className="text-red-600">espoir</span>.
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Feature
          icon={<ShieldCheck />}
          title="Sécurisé"
          text="Vos données médicales sont protégées."
        />
        <Feature icon={<HeartPulse />} title="Solidaire" text="Rejoignez une communauté engagée." />
      </div>
    </section>
  )
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  )
}

function Progress({ step, total }: { step: number; total: number }) {
  const labels = total === 2 ? ["Compte", "Établissement"] : ["Compte", "Profil", "Santé"]
  return (
    <div>
      <div className="mb-3 flex justify-between text-xs font-semibold text-slate-500">
        <span>Étape {step} sur {total}</span>
        <span>{labels[step - 1]}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className={`mt-4 grid ${total === 2 ? "grid-cols-2" : "grid-cols-3"} text-center text-xs`}>
        {labels.map((label, index) => (
          <div
            className={index < step ? "font-semibold text-blue-700" : "text-slate-400"}
            key={label}
          >
            <span
              className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full ${index < step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
            >
              {index + 1}
            </span>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function SignupStep({
  step,
  data,
  update,
  showPassword,
  setShowPassword,
}: {
  step: number
  data: SignupData
  update: (key: keyof SignupData, value: string) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}) {
  if (step === 1)
    return (
      <>
        <StepTitle
          icon={<LockKeyhole />}
          title="Informations du compte"
          description="Créez vos identifiants pour accéder à MyBloodGift."
        />
        <div className="block text-sm font-semibold text-slate-700">
          Rôle sur la plateforme
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { id: "donneur", label: "Donneur" },
              { id: "demandeur", label: "Demandeur" },
              { id: "hopital", label: "Hôpital" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${data.role === r.id ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                onClick={() => update("role", r.id as SignupData["role"])}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <Field
          label="Nom complet"
          icon={<UserRound />}
          value={data.nom}
          onChange={(value) => update("nom", value)}
          placeholder="Sophie Martin"
        />
        <Field
          label="Adresse e-mail"
          icon={<Mail />}
          type="email"
          value={data.email}
          onChange={(value) => update("email", value)}
          placeholder="nom@exemple.com"
        />
        <PasswordField
          label="Mot de passe"
          value={data.password}
          onChange={(value) => update("password", value)}
          visible={showPassword}
          setVisible={setShowPassword}
        />
        <PasswordField
          label="Confirmer le mot de passe"
          value={data.confirmPassword}
          onChange={(value) => update("confirmPassword", value)}
          visible={showPassword}
          setVisible={setShowPassword}
        />
      </>
    )

  if (step === 2 && data.role === "hopital")
    return (
      <>
        <StepTitle
          icon={<ShieldCheck />}
          title="Informations de l'établissement"
          description="Ces informations seront vérifiées avant l'ouverture des fonctionnalités hospitalières."
        />
        <Field label="Nom officiel de l'établissement" icon={<MapPin />} value={data.establishmentName} onChange={(value) => update("establishmentName", value)} placeholder="Hôpital Général de Yaoundé" />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Type d'établissement" value={data.establishmentType} onChange={(value) => update("establishmentType", value)} options={["Hôpital public", "Clinique privée", "Centre de transfusion", "Centre de santé"]} />
          <Field label="Numéro d'agrément" icon={<ShieldCheck />} value={data.licenseNumber} onChange={(value) => update("licenseNumber", value)} placeholder="AGC-2026-0001" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ville" icon={<MapPin />} value={data.city} onChange={(value) => update("city", value)} placeholder="Yaoundé" />
          <Field label="Adresse complète" icon={<MapPin />} value={data.address} onChange={(value) => update("address", value)} placeholder="Quartier, rue, repère" />
        </div>
        <div className="rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4 text-sm leading-6 text-slate-600">
          Le compte sera créé en attente de vérification administrative. Préparez votre document d'agrément pour le contrôle.
        </div>
      </>
    )
  if (step === 2)
    return (
      <>
        <StepTitle
          icon={<UserRound />}
          title="Votre profil"
          description="Ces informations nous aident à vous proposer des centres adaptés."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Date de naissance"
            icon={<CalendarDays />}
            type="date"
            value={data.dateNaissance}
            onChange={(value) => update("dateNaissance", value)}
          />
          <SelectField
            label="Genre"
            value={data.genre}
            onChange={(value) => update("genre", value)}
            options={["Femme", "Homme", "Autre"]}
          />
        </div>
        <div>
          <p className="text-sm font-semibold">
            Groupe sanguin <span className="font-normal text-slate-400">(facultatif)</span>
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((group) => (
              <button
                type="button"
                className={`rounded-lg border px-2 py-3 text-sm font-semibold ${data.groupeSanguin === group ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-50"}`}
                onClick={() => update("groupeSanguin", group)}
                key={group}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </>
    )
  return (
    <>
      <StepTitle
        icon={<HeartPulse />}
        title="Éligibilité au don"
        description="Répondez à ces questions de santé. La validation finale est réalisée au centre."
      />
      <RadioQuestion
        title="Vous sentez-vous actuellement en bonne santé ?"
        hint="Pas de fièvre, rhume ou infection en cours."
        value={data.enBonneSante}
        onChange={(value) => update("enBonneSante", value)}
      />
      <RadioQuestion
        title="Avez-vous donné votre sang durant les 56 derniers jours ?"
        value={data.donRecent}
        onChange={(value) => update("donRecent", value)}
      />
      <RadioQuestion
        title="Prenez-vous un traitement pour une infection ?"
        value={data.medication}
        onChange={(value) => update("medication", value)}
      />
      <div className="flex gap-3 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4 text-sm leading-6 text-slate-600">
        <Info className="h-5 w-5 shrink-0 text-blue-600" /> La décision finale d’éligibilité sera
        prise par l’équipe médicale sur place.
      </div>
    </>
  )
}

function StepTitle({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="border-b border-slate-100 pb-5">
      <div className="flex items-center gap-3 text-blue-700">
        <span className="rounded-lg bg-blue-50 p-2">{icon}</span>
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}
function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <span className="relative block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          required={label !== "Groupe sanguin"}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${fieldClass} pl-10`}
        />
      </span>
    </label>
  )
}
function PasswordField({
  label,
  value,
  onChange,
  visible,
  setVisible,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  visible: boolean
  setVisible: (value: boolean) => void
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <span className="relative block">
        <input
          required
          minLength={8}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClass} pr-20`}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700"
        >
          {visible ? "Masquer" : "Afficher"}
        </button>
      </span>
    </label>
  )
}
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      >
        <option value="">Sélectionner</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
function RadioQuestion({
  title,
  hint,
  value,
  onChange,
}: {
  title: string
  hint?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      <div className="mt-3 flex gap-5 text-sm">
        <label>
          <input
            type="radio"
            checked={value === "oui"}
            onChange={() => onChange("oui")}
            className="mr-2 accent-red-600"
          />
          Oui
        </label>
        <label>
          <input
            type="radio"
            checked={value === "non"}
            onChange={() => onChange("non")}
            className="mr-2 accent-red-600"
          />
          Non
        </label>
      </div>
    </div>
  )
}
function LoginFields({
  data,
  update,
  showPassword,
  setShowPassword,
}: {
  data: SignupData
  update: (key: keyof SignupData, value: string) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}) {
  return (
    <>
      <Field
        label="Adresse e-mail"
        icon={<Mail />}
        type="email"
        value={data.email}
        onChange={(value) => update("email", value)}
        placeholder="nom@exemple.com"
      />
      <PasswordField
        label="Mot de passe"
        value={data.password}
        onChange={(value) => update("password", value)}
        visible={showPassword}
        setVisible={setShowPassword}
      />
      <label className="flex items-center gap-2 text-sm text-slate-500">
        <input type="checkbox" className="accent-red-600" /> Se souvenir de moi
      </label>
      <a
        href="/forgot-password"
        className="block text-right text-sm font-semibold text-blue-700 hover:underline"
      >
        Mot de passe oublié ?
      </a>
    </>
  )
}
function SuccessScreen({
  onDashboard,
  onCenters,
  onVerify,
}: {
  onDashboard: () => void
  onCenters: () => void
  onVerify: () => void
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4faff] px-4 py-8">
      <section className="w-full max-w-2xl rounded-xl border border-[#e4beba] bg-white p-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.05)] md:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-600">
          <CheckCircle2 className="h-14 w-14" />
        </div>
        <h1 className="mt-7 text-3xl font-semibold">Bienvenue sur MyBloodGift !</h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">
          Votre compte a été créé avec succès. Vérifiez votre adresse email pour sécuriser votre
          compte.
        </p>
        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <Feature
            icon={<Mail />}
            title="Vérifier votre email"
            text="Saisissez le code reçu dans votre boîte mail."
          />
          <Feature
            icon={<MapPin />}
            title="Trouver un centre"
            text="Prêt à donner ? Localisez un centre proche de chez vous."
          />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" className="rounded-lg" onClick={onVerify}>
            <Mail className="h-4 w-4" /> Vérifier mon email
          </Button>
          <Button variant="outline" className="rounded-lg" onClick={onDashboard}>
            Accéder au tableau de bord <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-lg" onClick={onCenters}>
            <MapPin className="h-4 w-4" /> Trouver un centre
          </Button>
        </div>
      </section>
    </main>
  )
}
