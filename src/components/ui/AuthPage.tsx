import { useState } from "react"
import {
  CircleUserRound,
  Clock3,
  HeartPulse,
  Hospital,
  ShieldCheck,
} from "lucide-react"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { authService } from "@/api/authServices"
import { FormInput } from "../formelement/FormInput"
import { Button } from "./button"



type AuthPageProps = {
  mode: "login" | "signup"
}

type AuthFormData = {
  nom?: string
  email: string
  password: string
  confirmPassword?: string
  contrat?: boolean
  role?: "Demandeur" | "Donneur"
}

const roleOptions = [
  { id: "administrateur", label: "Administrateur", apiRole: "admin" as const, icon: ShieldCheck },
  { id: "doneur", label: "Donneur", apiRole: "Donneur" as const, icon: CircleUserRound },
  { id: "hospital", label: "Hôpital", apiRole: "hospital" as const, icon: Hospital },
  { id: "Demandeur", label: "Demandeur", apiRole: "Demandeur" as const, icon: Hospital },
]

export default function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup"
  const [selectedRole, setSelectedRole] = useState("donor")
const navigate = useNavigate()
  const Schema = isSignup
    ? Yup.object({
        nom: Yup.string()
          .min(3, "Le nom doit contenir au moins 3 caractères")
          .max(30, "Ce nom est trop long")
          .required("Nom est obligatoire"),
        email: Yup.string().email("Email invalide").required("Email est obligatoire"),
        password: Yup.string()
          .min(8, "Le mot de passe doit contenir au moins 8 caractères")
          .required("Mot de passe obligatoire")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial"
          ),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre")
          .required("Confirmer le mot de passe est obligatoire"),
        contrat: Yup.boolean().oneOf([true], "Veuillez accepter les termes du contrat"),
      })
    : Yup.object({
        email: Yup.string().email("Email invalide").required("Email est obligatoire"),
        password: Yup.string().required("Mot de passe obligatoire"),
        contrat: Yup.boolean().oneOf([true], "Veuillez accepter les termes du contrat"),
      })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: yupResolver(Schema) as any,
    mode: "onChange",
  })

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isSignup) {
          const selectedRolePayload =
            roleOptions.find((option) => option.id === selectedRole)?.apiRole ?? "Donneur"

          const payload = {
            nom: data.nom ?? "",
            email: data.email,
            password: data.password,
            role: selectedRolePayload,
          }
          await authService.signup(payload)
      } else {
        console.log(data)
         const res = await authService.login(data)
        toast.success(res.message)
        navigate("/about")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(message)
    }
  }


    return (
      <main className="min-h-screen bg-[#f3f1ef] px-4 py-6 md:px-8 flex flex-col justify-center align-center">
        <div className="mx-auto bg-blue-300 max-w-6xl rounded-[1em]">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="px-2 py-6 lg:pl-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-200">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <div className="text-4xl font-black uppercase tracking-tight text-red-600">MybloodGift</div>
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-slate-600">
                  Système de gestion du sang
                </div>
              </div>
            </div>

            <h1 className="mt-12 max-w-155 text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 md:text-5xl">
              Logistique de précision pour des missions de <span className="text-red-600">sauvetage</span>.
            </h1>

            <p className="mt-6 max-w-145 text-lg leading-8 text-slate-600">
              La norme professionnelle pour les solutions médicales. Accès sécurisé et rapide aux stocks de sang,
              à l’historique des donneurs et à la coordination des urgences dans tout le réseau.
            </p>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Sécurité HIPAA</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Chiffrement de niveau militaire pour les données des patients.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Clock3 className="h-4 w-4" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Temps réel</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Mises à jour instantanées des stocks dans tous les centres.
                </p>
              </div>
            </div>
          </section>
            
             <section className="rounded-[1rem] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-sm md:p-8">
             {isSignup ?
              <>
              <h2 className="text-4xl font-light text-slate-800">Créer un compte</h2>
              <p className="mt-2 text-sm text-slate-500">Sélectionnez votre rôle et remplissez vos informations pour continuer.</p>
              <div className="mt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Je suis...</p>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map(({ id, label, icon: Icon }) => {
                    const isActive = selectedRole === id

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedRole(id)}
                        className={[
                          "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "border-red-300 bg-red-50 text-red-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
              </>
              :
              <>
              <h2 className="text-4xl font-light text-slate-800">Bon retour</h2>
              <p className="mt-2 text-sm text-slate-500">Sélectionnez votre rôle et entrez vos identifiants pour continuer.</p>
              </>
              }

              <form className="mt-6 space-y-5 p-2" onSubmit={handleSubmit(onSubmit)}>
               {isSignup ?<>
               
                <FormInput
                  label="Nom complet"
                  id="fullName"
                  type="text"
                  placeholder="Votre nom complet"
                  error={errors.nom}
                  {...register("nom")}
                />

                <FormInput
                  label="Adresse e-mail"
                  id="email"
                  type="email"
                  placeholder="nom@mybloodgift.fr"
                  error={errors.email}
                  {...register("email")}
                />

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Mot de passe
                    </label>
                    <div className="relative">
                        <FormInput
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          error={errors.password}
                          {...register("password")}
                            />
                        <button
                          type="button"
                          className="absolute right-3 top-[48%] -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label="Afficher le mot de passe"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.6]">
                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Mot de passe
                    </label>
                    <div className="relative">
                        <FormInput
                            label="Confirmer le mot de passe"
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            error={errors.confirmPassword}
                            {...register("confirmPassword")}
                            
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-[68%] -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label="Afficher le mot de passe"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.6]">
                              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    </div>
                </div>

                

                <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl py-5 text-base font-semibold">
                  Créer mon compte
                </Button>
               </>:
                <>
                 <FormInput
                label="Adresse e-mail"
                id="email"
                type="email"
                placeholder="nom@mybloodgift.fr"
                error={errors.email}
                {...register("email")}
                className="gap-2"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Mot de passe
                  </label>
                  <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <FormInput
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[50%] -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Afficher le mot de passe"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.6]">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-200 accent-primary" />
                Se souvenir de cet appareil pendant 30 jours
              </label>

              <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl py-5 text-base font-semibold">
                Se connecter au tableau de bord
              </Button>
                </>
                }
              </form>
               {isSignup ?
               
            <p className="mt-6 text-center text-sm text-slate-500">
                Déjà membre ? <a href="/login" className="font-semibold text-red-600 hover:text-red-700">Se connecter</a>
              </p>
              :
               <>
                  <div className="mt-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Ou utiliser un accès rapide</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size='lg'
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                      >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-red-500">
                            G
                          </span>
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size='lg'
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                      >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                            ◌
                          </span>
                        Biometric
                      </Button>
                  </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Vous n’avez pas de compte ? <a href="/signup" className="font-semibold text-red-600 hover:text-red-700">Créer un compte</a>
            </p>

            <div className="mt-8 flex items-center justify-center gap-8 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-700">Politique de confidentialité</a>
              <a href="#" className="hover:text-slate-700">État du système</a>
              <a href="#" className="hover:text-slate-700">Support</a>
            </div>
               </>
            
            }
              
            </section>
            
            

           
          </div>
        </div>
      </main>
    )
  }



