import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import { cities } from "../data/cities";

const cityIcon = new L.divIcon({
  className: "city-marker",
  html: '<div class="city-marker__dot"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function CityMap({ selectedCity, onSelectCity }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-soft backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-4 px-2 pt-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Mappa interattiva
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Seleziona una città ligure
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {selectedCity}
        </span>
      </div>

      <div className="h-[420px] w-full overflow-hidden rounded-2xl">
        <MapContainer
          center={[44.2, 8.85]}
          zoom={8}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {cities.map((city) => (
            <Marker
              key={city.name}
              position={[city.latitude, city.longitude]}
              icon={cityIcon}
              eventHandlers={{ click: () => onSelectCity(city.name) }}
            >
              <Popup>
                <button
                  type="button"
                  onClick={() => onSelectCity(city.name)}
                  className="font-semibold text-sky-700"
                >
                  {city.name}
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default CityMap;
