"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import type { Route } from "@/lib/types"

type RouteMapProps = {
  routes: Route[]
}

// Coordenadas aproximadas de aeropuertos principales de LATAM
const airportCoordinates: Record<string, [number, number]> = {
  'SCL': [-70.5458, -33.3928], // Santiago, Chile
  'LIM': [-77.1144, -12.0219], // Lima, Perú
  'GRU': [-46.4731, -23.4356], // São Paulo, Brasil
  'BOG': [-74.1469, 4.7016],   // Bogotá, Colombia
  'MEX': [-99.0721, 19.4363],  // Ciudad de México, México
  'EZE': [-58.5358, -34.8222], // Buenos Aires, Argentina
  'CUN': [-86.8771, 21.0365],  // Cancún, México
  'PTY': [-79.3836, 9.0714],   // Panamá, Panamá
  'UIO': [-78.3572, -0.1411],  // Quito, Ecuador
  'CCS': [-66.9910, 10.6031],  // Caracas, Venezuela
}

export function RouteMap({ routes }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Inicializar el mapa
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: [-70, -20], // Centro en América Latina
      zoom: 3
    })

    map.current.on('load', () => {
      if (!map.current) return

      // Agregar aeropuertos como puntos
      const airports = new Set<string>()
      routes.forEach(route => {
        airports.add(route.origin.split(' - ')[0])
        airports.add(route.destination.split(' - ')[0])
      })

      const airportFeatures = Array.from(airports).map(iata => {
        const coords = airportCoordinates[iata]
        if (!coords) return null
        return {
          type: 'Feature' as const,
          properties: { iata },
          geometry: {
            type: 'Point' as const,
            coordinates: coords
          }
        }
      }).filter(Boolean)

      // Agregar rutas como líneas
      const routeFeatures = routes.map(route => {
        const originIata = route.origin.split(' - ')[0]
        const destIata = route.destination.split(' - ')[0]
        const originCoords = airportCoordinates[originIata]
        const destCoords = airportCoordinates[destIata]
        
        if (!originCoords || !destCoords) return null

        return {
          type: 'Feature' as const,
          properties: { 
            routeCode: route.route_code,
            distance: route.distance_km,
            frequency: route.frequency,
            active: route.active
          },
          geometry: {
            type: 'LineString' as const,
            coordinates: [originCoords, destCoords]
          }
        }
      }).filter(Boolean)

      // Agregar fuente de aeropuertos
      map.current.addSource('airports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: airportFeatures
        }
      })

      // Agregar fuente de rutas
      map.current.addSource('routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: routeFeatures
        }
      })

      // Agregar capa de aeropuertos
      map.current.addLayer({
        id: 'airports',
        type: 'circle',
        source: 'airports',
        paint: {
          'circle-color': '#3b82f6',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      })

      // Agregar etiquetas de aeropuertos
      map.current.addLayer({
        id: 'airport-labels',
        type: 'symbol',
        source: 'airports',
        layout: {
          'text-field': ['get', 'iata'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-offset': [0, 2],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#1f2937',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      })

      // Agregar capa de rutas
      map.current.addLayer({
        id: 'routes',
        type: 'line',
        source: 'routes',
        paint: {
          'line-color': [
            'case',
            ['get', 'active'],
            '#10b981', // Verde para rutas activas
            '#6b7280'  // Gris para rutas inactivas
          ],
          'line-width': [
            'case',
            ['get', 'active'],
            3,
            2
          ],
          'line-opacity': 0.8
        }
      })

      // Agregar capa de rutas con patrón de puntos
      map.current.addLayer({
        id: 'route-dots',
        type: 'circle',
        source: 'routes',
        paint: {
          'circle-color': [
            'case',
            ['get', 'active'],
            '#10b981',
            '#6b7280'
          ],
          'circle-radius': 2,
          'circle-opacity': 0.6
        }
      })

      // Agregar popup para aeropuertos
      map.current.on('click', 'airports', (e) => {
        if (!map.current) return
        
        const coordinates = e.lngLat
        const iata = e.features?.[0]?.properties?.iata
        
        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<div class="p-2"><strong>Aeropuerto:</strong> ${iata}</div>`)
          .addTo(map.current)
      })

      // Agregar popup para rutas
      map.current.on('click', 'routes', (e) => {
        if (!map.current) return
        
        const coordinates = e.lngLat
        const properties = e.features?.[0]?.properties
        
        if (properties) {
          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div class="p-2">
                <strong>Ruta:</strong> ${properties.routeCode}<br>
                <strong>Distancia:</strong> ${properties.distance} km<br>
                <strong>Frecuencia:</strong> ${properties.frequency}<br>
                <strong>Estado:</strong> ${properties.active ? 'Activa' : 'Inactiva'}
              </div>
            `)
            .addTo(map.current)
        }
      })

      // Cambiar cursor al pasar sobre elementos
      map.current.on('mouseenter', 'airports', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer'
      })

      map.current.on('mouseleave', 'airports', () => {
        if (map.current) map.current.getCanvas().style.cursor = ''
      })

      map.current.on('mouseenter', 'routes', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer'
      })

      map.current.on('mouseleave', 'routes', () => {
        if (map.current) map.current.getCanvas().style.cursor = ''
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [routes])

  return (
    <div className="space-y-4">
      <div className="h-96 w-full rounded-lg border" ref={mapContainer} />
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span>Aeropuertos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span>Rutas Activas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-500"></div>
          <span>Rutas Inactivas</span>
        </div>
      </div>
    </div>
  )
}
