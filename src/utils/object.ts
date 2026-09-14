import {
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
  Bell,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Settings,
  UserRound,
  Activity as ActivityIcon,
  Hospital as HospitalIcon,
  Megaphone,
  BarChart3,
  Building2,
  Hospital,
  type LucideIcon,
} from "lucide-react"

export const CardObject = [
  {
    title: "+3200",
    description: "Donneurs actifs",
    color: "bg-white text-slate-900",
    className: "",
  },
  {
    title: "+3200",
    description: "Banques de sang",
    color: "bg-gradient-to-br from-red-500 to-red-700 ",
    className: "text-base md:text-lg font-normal text-white text-center",
  },
  {
    title: "98%",
    description: "Réponse rapide",
    color: "bg-white text-slate-900",
    className: "",
  },
]

export const DescriptiveCardObject = [
  {
    title: "Mobilisation citoyenne",
    icon: Megaphone,
    position: "",
    className: "h-56 rounded-[1.5rem] border border-slate-200",
    description:
      "Suivez les poches de sang et les mouvements entre les centres depuis une interface claire.",
  },
  {
    title: "Mobilisation citoyenne",
    icon: BarChart3,
    position: "top-5 right-5 opacity-60",
    className: "h-56 rounded-[1.5rem] border border-slate-200",
    description: "Diffusez les campagnes et les alertes aux donneurs proches de votre zone.",
  },
]
type Pngprops = {
  icon: LucideIcon
  title: string
  description: string
  iclass: string
}

export const PngCardObject: Pngprops[] = [
  {
    icon: Users,
    iclass: `h-10 w-10 text-red-600 group-hover:text-white`,
    title: "Inscription",
    description: "Créez un compte en quelques minutes.",
  },
  {
    icon: ShieldCheck,
    iclass: `h-10 w-10 text-red-600 group-hover:text-white`,
    title: "Alertes",
    description: "Recevez les besoins de votre groupe sanguin.",
  },
  {
    icon: Stethoscope,
    iclass: `h-10 w-10 text-red-600 group-hover:text-white`,
    title: "Réponse",
    description: "Répondez rapidement aux demandes locales.",
  },
  {
    icon: HeartPulse,
    iclass: `h-10 w-10 text-red-600 group-hover:text-white`,
    title: "Don",
    description: "Participez à sauver des vies.",
  },
]

export const questionCardObject = [
  {
    question: "Comment faire un don de sang ?",
    answer:
      "Prenez rendez-vous dans un centre partenaire et suivez les consignes avant la collecte.",
  },
  {
    question: "Qui peut recevoir des alertes ?",
    answer:
      "Tous les donneurs inscrits reçoivent des alertes selon leur groupe sanguin et leur localisation.",
  },
  {
    question: "Mes données sont-elles protégées ?",
    answer:
      "Oui, les informations restent privées et sont utilisées uniquement pour le suivi du don.",
  },
]
type NavItem = {
  title: string
  icon: LucideIcon
  lien: string
}

export type AppRole = "donneur" | "demandeur" | "hospital" | "admin"

export const navItems: NavItem[] = [
  { title: "Tableau de bord", icon: LayoutDashboard, lien: "/Dash" },
  { title: "Dons", icon: HeartPulse, lien: "/Don" },
  { title: "Demandes", icon: ClipboardList, lien: "/Demande" },
  { title: "Rendez-vous", icon: CalendarDays, lien: "/RendezVous" },
  { title: "Notifications", icon: Bell, lien: "/Notifications" },
  { title: "Profil", icon: UserRound, lien: "/profil" },
  { title: "Paramètres", icon: Settings, lien: "/setting" },
]

export const roleNavItems: Record<AppRole, NavItem[]> = {
  donneur: [
    { title: "Tableau de bord", icon: LayoutDashboard, lien: "/donneur" },
    { title: "Dons", icon: HeartPulse, lien: "/donneur/dons" },
    { title: "Demandes", icon: ClipboardList, lien: "/donneur/demandes" },
    { title: "Rendez-vous", icon: CalendarDays, lien: "/donneur/rendez-vous" },
    { title: "Notifications", icon: Bell, lien: "/donneur/notifications" },
    { title: "Profil", icon: UserRound, lien: "/donneur/profil" },
    { title: "Paramètres", icon: Settings, lien: "/donneur/parametres" },
  ],
  demandeur: [
    { title: "Tableau de bord", icon: LayoutDashboard, lien: "/demandeur" },
    { title: "Nouvelle demande", icon: ClipboardList, lien: "/demandeur/nouvelle-demande" },
    { title: "Notifications", icon: Bell, lien: "/demandeur/notifications" },
    { title: "Profil", icon: UserRound, lien: "/demandeur/profil" },
  ],
  hospital: [
    { title: "Tableau de bord", icon: LayoutDashboard, lien: "/hospital" },
    { title: "Demandes", icon: ClipboardList, lien: "/hospital/demandes" },
    { title: "Stock", icon: HeartPulse, lien: "/hospital/stock" },
    { title: "Rapports", icon: ActivityIcon, lien: "/hospital/rapports" },
    { title: "Analyse IA", icon: ActivityIcon, lien: "/hospital/analyse" },
    { title: "Paramètres", icon: Settings, lien: "/hospital/parametres" },
  ],
  admin: [
    { title: "Tableau de bord", icon: LayoutDashboard, lien: "/admin" },
    { title: "Utilisateurs", icon: Users, lien: "/admin/utilisateurs" },
    { title: "Établissements", icon: HospitalIcon, lien: "/admin/etablissements" },
    { title: "Rapports", icon: ActivityIcon, lien: "/admin/rapports" },
    { title: "Analyse IA", icon: ActivityIcon, lien: "/admin/analyse" },
    { title: "Paramètres", icon: Settings, lien: "/admin/parametres" },
  ],
}
export const UsersCardObject = [
                {
                  icon: UserRound,
                  title: "Donneur",
                  text: "Planifiez vos dons et recevez les alertes compatibles.",
                  color: "text-red-600 bg-red-50",
                },
                {
                  icon: Users,
                  title: "Demandeur",
                  text: "Suivez vos demandes et les réponses des donneurs.",
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  icon: Hospital,
                  title: "Hôpital",
                  text: "Gérez vos stocks, dons et besoins urgents.",
                  color: "text-emerald-600 bg-emerald-50",
                },
                {
                  icon: Building2,
                  title: "Administrateur",
                  text: "Pilotez les utilisateurs et le réseau sanitaire.",
                  color: "text-amber-600 bg-amber-50",
                },
]