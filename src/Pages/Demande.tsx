
import SideBar from "@/components/ui/SideBar"


function Demande() {
    
  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-slate-100">
        <nav className=" fixed md:hidden bg-linear-to-b from-sky-950 via-blue-950 to-indigo-950 border-b-2 border-slate-600 w-full h-15 flex items-center p-3 ">
          <SideBar Donneur="Sophie" Role="Donneur" lieu="Demandes" />
        </nav>
          <nav className="hidden md:flex h-screen">
            <SideBar Donneur="Sophie" Role="Donneur" lieu="Demandes" />
          </nav>

      <section className=" mt-15 md:mt-5 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Bienvenue</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Votre Demande de sang.
            </p>
        </div>
      </section>
    </main>
  )
}

export default Demande
