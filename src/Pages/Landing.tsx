import { Button } from "@/components/ui/button"
import Card, { DescriptiveCard, EmergencyCard, IllustrativeCard, PngCard, QuestionCard } from "@/components/ui/Card"
import NavBar from "@/components/ui/NavBar.tsx"
import { HeartPulse, ShieldCheck, Sparkles, Users } from "lucide-react"

export default function Landing() {
    return (
        <>
            <header className="sticky top-0 z-50">
                <NavBar />
            </header>

            <main className="w-full min-h-screen bg-white text-slate-900">
                <section className="mx-auto flex w-full max-w-7xl flex-col-reverse gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-16">
                    <div className="flex w-full flex-col gap-6 md:w-1/2">
                        <div className="max-w-2xl space-y-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                                <HeartPulse className="h-4 w-4" /> Plateforme nationale de don de sang
                            </span>
                            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">MyBloodGift, la plateforme qui connecte les donneurs et les centres de sang.</h1>
                            <p className="text-base leading-7 text-slate-600 sm:text-lg">Suivez les stocks, trouvez les points de collecte et recevez des alertes dès qu’un groupe sanguin correspond à votre profil.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button asChild variant="primary" size="lg" className="w-full rounded-xl px-6 text-base font-semibold sm:w-auto">
                                <a href="/signup">Créer un compte</a>
                            </Button>
                            <Button asChild variant="secondary" size="lg" className="w-full rounded-xl px-6 text-base font-semibold sm:w-auto">
                                <a href="/login">Se connecter</a>
                            </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
                                <p className="text-sm text-red-500">Campagnes actives</p>
                                <p className="mt-2 text-2xl font-semibold">11</p>
                            </div>
                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">Banques partenaires</p>
                                <p className="mt-2 text-2xl font-semibold">15</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-center md:w-1/2">
                        <div className="relative flex h-full w-full max-w-md overflow-hidden rounded-[2rem] border border-red-100 bg-red-50 p-6 shadow-md">
                            <div className="flex h-full w-full flex-col justify-between rounded-[1.5rem] bg-white p-6 shadow-sm">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-red-500">Alerte urgente</p>
                                    <h2 className="mt-3 text-xl font-semibold text-slate-900">Groupe O- requis maintenant</h2>
                                </div>
                                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                                    <div className="rounded-3xl bg-slate-50 p-4 text-center">
                                        <p className="text-sm text-slate-500">Centres proches</p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">24</p>
                                    </div>
                                    <div className="rounded-3xl bg-slate-50 p-4 text-center">
                                        <p className="text-sm text-slate-500">Donneurs disponibles</p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">84</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-red-100 opacity-80 blur-2xl" />
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-8">
                    <div className="grid gap-5 md:grid-cols-3">
                        <Card title="+3200" description="Donneurs actifs" color="bg-white text-slate-900" />
                        <Card title="15" description="Banques de sang" color="bg-gradient-to-br from-red-500 to-red-700 text-white" />
                        <Card title="98%" description="Réponse rapide" color="bg-white text-slate-900" />
                    </div>
                </section>

                <section className="bg-slate-50 py-14">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                        <div className="mb-10 text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">Fonctionnalités clés</p>
                            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Tout ce dont vous avez besoin pour suivre les dons</h2>
                        </div>
                        <div className="grid gap-6 lg:grid-cols-2">
                            <IllustrativeCard className="h-72 w-full rounded-[1.5rem] border border-slate-200" description="Retrouvez les stocks de sang en temps réel et les sites de collecte autour de vous." title="Localisation" url="src/assets/react.svg" />
                            <EmergencyCard title="Alertes d’urgence" information="Recevez des notifications quand votre groupe sanguin est nécessaire dans votre région." status="Live" url="src/assets/vite.svg" className="h-72 w-full" />
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:px-8">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <DescriptiveCard
                            title="Gestion centralisée"
                            url="src/assets/react.svg"
                            className="h-56 rounded-[1.5rem] border border-slate-200"
                            description="Suivez les poches de sang et les mouvements entre les centres depuis une interface claire."
                        />
                        <DescriptiveCard
                            title="Mobilisation citoyenne"
                            url="src/assets/react.svg"
                            position="top-5 right-5 opacity-60"
                            className="h-56 rounded-[1.5rem] border border-slate-200"
                            description="Diffusez les campagnes et les alertes aux donneurs proches de votre zone." 
                        />
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 md:px-8">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">Comment ça marche</p>
                        <h3 className="mt-4 text-3xl font-semibold text-slate-900">Simple et rapide en 4 étapes</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                        <PngCard icon={<Users className="h-10 w-10 text-red-600" />} title="Inscription" description="Créez un compte en quelques minutes." />
                        <PngCard icon={<ShieldCheck className="h-10 w-10 text-red-600" />} title="Alertes" description="Recevez les besoins de votre groupe sanguin." />
                        <PngCard icon={<Sparkles className="h-10 w-10 text-red-600" />} title="Réponse" description="Répondez rapidement aux demandes locales." />
                        <PngCard icon={<HeartPulse className="h-10 w-10 text-red-600" />} title="Don" description="Participez à sauver des vies." />
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 md:px-8">
                    <div className="mb-10 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">FAQ</p>
                        <h3 className="mt-4 text-3xl font-semibold text-slate-900">Questions fréquentes</h3>
                    </div>
                    <div className="space-y-4">
                        <QuestionCard question="Comment faire un don de sang ?" answer="Prenez rendez-vous dans un centre partenaire et suivez les consignes avant la collecte." />
                        <QuestionCard question="Qui peut recevoir des alertes ?" answer="Tous les donneurs inscrits reçoivent des alertes selon leur groupe sanguin et leur localisation." />
                        <QuestionCard question="Mes données sont-elles protégées ?" answer="Oui, les informations restent privées et sont utilisées uniquement pour le suivi du don." />
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 md:px-8">
                    <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">Prêt à commencer ?</p>
                                <h2 className="mt-4 text-3xl font-semibold text-slate-900">Inscrivez-vous et soyez alerté au bon moment.</h2>
                                <p className="mt-4 max-w-2xl text-slate-600">Rejoignez la communauté et recevez des notifications dès qu’un besoin correspond à votre groupe sanguin.</p>
                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild variant="primary" size="lg" className="rounded-lg">
                                        <a href="/signup">Créer un compte</a>
                                    </Button>
                                    <Button asChild variant="secondary" size="lg" className="rounded-lg">
                                        <a href="/login">Connexion</a>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
                                    <HeartPulse className="h-20 w-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 bg-white py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
                    <div className="flex items-center justify-center gap-3 md:justify-start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-700 font-bold text-white">MGB</div>
                        <div>
                            <p className="font-semibold text-slate-900">MyBloodGift</p>
                            <p className="text-sm text-slate-500">© 2026 MyBloodGift</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                        <a href="#" className="transition hover:text-red-600">Confidentialité</a>
                        <a href="#" className="transition hover:text-red-600">Mentions légales</a>
                        <a href="#" className="transition hover:text-red-600">Contact</a>
                    </div>
                </div>
            </footer>
        </>
    )
}