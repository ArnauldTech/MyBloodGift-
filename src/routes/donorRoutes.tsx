import { Route } from "react-router-dom"
import { ProtectedRoute } from "./guards"
import { Dashboard, Don, Demande } from "@/Pages/donneur"
import { Centres, Notifications, Parametres, Profil, RendezVous } from "@/Pages/commun"

export function donorRoutes() {
  return (
    <>
      <Route
        path="/donneur"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donneur/dons"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Don />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donneur/demandes"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Demande />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donneur/rendez-vous"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <RendezVous />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donneur/notifications"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donneur/profil"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Profil />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donneur/parametres"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Parametres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donneur/centres"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Centres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Centres"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Centres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Dash"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Don"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Don />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Demande"
        element={
          <ProtectedRoute roles={["donneur"]}>
            <Demande />
          </ProtectedRoute>
        }
      />
    </>
  )
}
