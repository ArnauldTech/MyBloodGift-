import { Route } from "react-router-dom"
import { ProtectedRoute } from "./guards"
import {
  AdminDashboard,
  AdminEstablishments,
  AdminUsers,
  AIInsights,
  DemandeurDashboard,
  HospitalDashboard,
  NewBloodRequest,
  Notifications,
  Parametres,
  Profil,
  Rapports,
  Stock,
} from "@/Pages/AdditionalPages"

export function roleRoutes() {
  return (
    <>
      <Route
        path="/demandeur"
        element={
          <ProtectedRoute roles={["demandeur"]}>
            <DemandeurDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/demandeur/nouvelle-demande"
        element={
          <ProtectedRoute roles={["demandeur"]}>
            <NewBloodRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/demandeur/notifications"
        element={
          <ProtectedRoute roles={["demandeur"]}>
            <Notifications role="demandeur" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/demandeur/profil"
        element={
          <ProtectedRoute roles={["demandeur"]}>
            <Profil role="demandeur" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital"
        element={
          <ProtectedRoute roles={["hospital"]}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/stock"
        element={
          <ProtectedRoute roles={["hospital"]}>
            <Stock role="hospital" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/demandes"
        element={
          <ProtectedRoute roles={["hospital"]}>
            <NewBloodRequest role="hospital" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/rapports"
        element={
          <ProtectedRoute roles={["hospital"]}>
            <Rapports role="hospital" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/analyse"
        element={
          <ProtectedRoute roles={["hospital"]}>
            <AIInsights role="hospital" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/parametres"
        element={
          <ProtectedRoute roles={["hospital"]}>
            <Parametres role="hospital" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rapports"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Rapports role="admin" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analyse"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AIInsights role="admin" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/utilisateurs"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/etablissements"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminEstablishments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/parametres"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Parametres role="admin" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Rapports"
        element={
          <ProtectedRoute>
            <Rapports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Stock"
        element={
          <ProtectedRoute roles={["hospital"]}>
            <Stock role="hospital" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nouvelle-demande"
        element={
          <ProtectedRoute roles={["demandeur"]}>
            <NewBloodRequest />
          </ProtectedRoute>
        }
      />
    </>
  )
}
