import {
  LocateFixed,
  Navigation,
  X,
  Clock,
  Footprints,
  Car,
  MapPin,
} from "lucide-react"
import { useEffect, useRef, useState, useCallback } from "react"
import type { DonationCenter } from "@/api/bloodServices"

type MapPreviewProps = {
  compact?: boolean
  centers?: DonationCenter[]
  location?: { latitude: number; longitude: number }
  onLocate?: () => void
}

type RouteInfo = {
  distanceKm: number
  durationMin: number
  center: DonationCenter
}

// Build an OSRM route URL between two points
function osrmUrl(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): string {
  return `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`
}

// Decode OSRM geometry into Leaflet LatLngTuple[]
function decodeGeojson(geometry: {
  type: string
  coordinates: [number, number][]
}): [number, number][] {
  return geometry.coordinates.map(([lng, lat]) => [lat, lng])
}

export function MapPreview({
  compact = false,
  centers = [],
  location,
  onLocate,
}: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null)
  const routeLayerRef = useRef<import("leaflet").Polyline | null>(null)
  const userMarkerRef = useRef<import("leaflet").CircleMarker | null>(null)
  const centerMarkersRef = useRef<import("leaflet").CircleMarker[]>([])

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    location ? { lat: location.latitude, lng: location.longitude } : null,
  )
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState<string | null>(null)
  const [route, setRoute] = useState<RouteInfo | null>(null)
  const [routing, setRouting] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)

  useEffect(() => {
    if (location) {
      // Synchronize the Leaflet user marker with the latest browser position.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserPos({ lat: location.latitude, lng: location.longitude })
    }
  }, [location])

  // ── Initialize Leaflet map ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    void Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([L]) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return

      const startPos: [number, number] = userPos
        ? [userPos.lat, userPos.lng]
        : [3.8667, 11.5167]

      const map = L.default.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(startPos, 12)

      // Premium tile layer — CartoDB Positron (cleaner, better contrast)
      L.default
        .tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
          },
        )
        .addTo(map)

      // Custom zoom control (bottom-right)
      L.default.control.zoom({ position: "bottomright" }).addTo(map)

      mapInstanceRef.current = map
    })

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Draw / refresh user position marker ──────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    void import("leaflet").then((L) => {
      // Remove old marker
      userMarkerRef.current?.remove()

      if (!userPos) return

      // Pulsing user marker using a custom DivIcon
      const pulseIcon = L.default.divIcon({
        className: "",
        html: `
          <div style="
            width:20px; height:20px; border-radius:50%;
            background:#e11d48; border:3px solid white;
            box-shadow:0 0 0 4px rgba(225,29,72,0.25), 0 2px 8px rgba(0,0,0,0.3);
            position:relative;
          ">
            <div style="
              position:absolute; inset:-8px; border-radius:50%;
              background:rgba(225,29,72,0.15);
              animation:pulse 2s ease-in-out infinite;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0%,100%{transform:scale(1);opacity:1}
              50%{transform:scale(1.5);opacity:0.4}
            }
          </style>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = L.default
        .marker([userPos.lat, userPos.lng], { icon: pulseIcon })
        .addTo(map)
        .bindPopup("<strong>📍 Votre position</strong>")

      userMarkerRef.current = marker as unknown as import("leaflet").CircleMarker

      map.setView([userPos.lat, userPos.lng], 13)
    })
  }, [userPos])

  // ── Draw center markers ───────────────────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    void import("leaflet").then((L) => {
      // Remove old markers
      centerMarkersRef.current.forEach((m) => m.remove())
      centerMarkersRef.current = []

      centers.forEach((center) => {
        const color = center.available ? "#10b981" : "#f59e0b"
        const marker = L.default
          .circleMarker([center.latitude, center.longitude], {
            radius: 10,
            color: "white",
            weight: 2,
            fillColor: color,
            fillOpacity: 0.9,
          })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:system-ui;min-width:160px">
              <strong style="font-size:13px">${center.name}</strong>
              <br/><span style="font-size:11px;color:#64748b">${center.address}</span>
              <br/><span style="font-size:11px;font-weight:600;color:${color}">
                ${center.available ? "✓ Ouvert" : "⚠ À confirmer"}
              </span>
            </div>`,
          )
          .on("click", () => setSelectedCenter(center))

        centerMarkersRef.current.push(marker)
      })
    })
  }, [centers])

  // ── Get user geolocation ─────────────────────────────────────────────────
  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    setLocating(true)
    setLocError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
        onLocate?.()
      },
      () => {
        setLocError("Autorisez la localisation pour voir les centres proches.")
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [onLocate])

  // ── Fetch OSRM route ──────────────────────────────────────────────────────
  const drawRoute = useCallback(
    async (center: DonationCenter) => {
      const map = mapInstanceRef.current
      if (!map || !userPos) return

      setRouting(true)
      setSelectedCenter(center)

      try {
        const res = await fetch(
          osrmUrl(userPos.lat, userPos.lng, center.latitude, center.longitude),
        )
        const data = (await res.json()) as {
          code: string
          routes: {
            geometry: { type: string; coordinates: [number, number][] }
            distance: number
            duration: number
          }[]
        }

        if (data.code !== "Ok" || !data.routes.length) {
          setLocError("Impossible de calculer l'itinéraire.")
          setRouting(false)
          return
        }

        const L = await import("leaflet")
        const raw = data.routes[0]
        const coords = decodeGeojson(
          raw.geometry as { type: string; coordinates: [number, number][] },
        )

        // Remove old route
        routeLayerRef.current?.remove()

        // Draw polyline with a red premium style
        const polyline = L.default
          .polyline(coords, {
            color: "#e11d48",
            weight: 5,
            opacity: 0.85,
            dashArray: undefined,
            lineCap: "round",
            lineJoin: "round",
          })
          .addTo(map)

        routeLayerRef.current = polyline

        // Fit map to the route
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] })

        setRoute({
          distanceKm: raw.distance / 1000,
          durationMin: raw.duration / 60,
          center,
        })
      } catch {
        setLocError("Erreur lors du calcul de l'itinéraire.")
      } finally {
        setRouting(false)
      }
    },
    [userPos],
  )

  const clearRoute = useCallback(() => {
    routeLayerRef.current?.remove()
    routeLayerRef.current = null
    setRoute(null)
    setSelectedCenter(null)
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm ${compact ? "h-64" : "h-105"}`}>
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* ── Top-left: location name ── */}
      <div className="absolute left-3 top-3 z-400 flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-sm">
        <MapPin className="h-3.5 w-3.5 text-red-500" />
        {userPos
          ? `${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}`
          : "Yaoundé, Cameroun"}
      </div>

      {/* ── Top-right: locate button ── */}
      <div className="absolute right-3 top-3 z-400 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Me localiser"
          onClick={locate}
          disabled={locating}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-md transition-all ${
            locating
              ? "border-red-200 bg-red-50 text-red-400"
              : "border-white bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          }`}
        >
          <LocateFixed className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ── Route info panel ── */}
      {route && (
        <div className="absolute bottom-3 left-3 right-3 z-400 rounded-2xl border border-white/80 bg-white/96 p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {route.center.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {route.center.address}
              </p>
            </div>
            <button
              type="button"
              onClick={clearRoute}
              className="shrink-0 rounded-lg border border-slate-200 p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Car className="h-3.5 w-3.5 text-red-500" />
              {route.distanceKm.toFixed(1)} km
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              ~{Math.ceil(route.durationMin)} min
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Footprints className="h-3.5 w-3.5 text-emerald-500" />
              {Math.ceil(route.durationMin * 4)} min à pied
            </div>
          </div>
          {/* Open in maps */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${route.center.latitude},${route.center.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-500 to-red-600 py-2 text-xs font-bold text-white shadow-sm transition hover:from-red-600 hover:to-red-700"
          >
            <Navigation className="h-3.5 w-3.5" /> Ouvrir dans Google Maps
          </a>
        </div>
      )}

      {/* ── Center list (when no route active and there are centers) ── */}
      {!route && !compact && centers.length > 0 && (
        <div className="absolute bottom-3 left-3 z-400 flex max-w-[calc(100%-1.5rem)] flex-col gap-1.5">
          {centers.slice(0, 3).map((center) => (
            <button
              key={center.id}
              type="button"
              onClick={() => {
                if (!userPos) {
                  setLocError("Localisez-vous d'abord pour calculer l'itinéraire.")
                  return
                }
                void drawRoute(center)
              }}
              disabled={routing}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-md backdrop-blur-sm transition-all ${
                selectedCenter?.id === center.id
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-white/80 bg-white/95 text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${center.available ? "bg-emerald-500" : "bg-amber-400"}`}
              />
              <span className="truncate max-w-40">{center.name}</span>
              {routing && selectedCenter?.id === center.id ? (
                <span className="ml-auto shrink-0 text-slate-400">…</span>
              ) : (
                <Navigation className="ml-auto h-3 w-3 shrink-0 text-slate-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Legend ── */}
      <div className="absolute right-3 bottom-3 z-400 flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-[10px] font-semibold text-slate-600 shadow-md backdrop-blur-sm">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Ouvert
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> À confirmer
        </span>
      </div>

      {/* ── Error toast ── */}
      {locError && (
        <div className="absolute left-3 right-3 top-14 z-400 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800 shadow-md">
          <span className="flex-1">{locError}</span>
          <button
            type="button"
            onClick={() => setLocError(null)}
            className="shrink-0 text-amber-600 hover:text-amber-900 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Route active indicator (top-center) ── */}
      {routing && (
        <div className="absolute left-1/2 top-3 z-400 -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 shadow-md">
          <span className="animate-pulse">Calcul de l'itinéraire…</span>
        </div>
      )}

      {/* ── "Locate first" prompt (no user pos + compact) ── */}
      {!userPos && compact && (
        <div className="absolute inset-0 z-300 flex flex-col items-center justify-center gap-3 bg-slate-900/10 backdrop-blur-[1px]">
          <button
            type="button"
            onClick={locate}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-red-50 hover:text-red-700"
          >
            <LocateFixed className="h-5 w-5 text-red-500" />
            Activer ma position
          </button>
        </div>
      )}
    </div>
  )
}
