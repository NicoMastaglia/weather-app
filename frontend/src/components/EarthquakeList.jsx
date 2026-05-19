import ErrorFallback from "./ErrorFallback";

function EarthquakeList({ earthquakes }) {
  if (!earthquakes) {
    return <ErrorFallback />;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-700">
          Terremoti recenti
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Area di monitoraggio
        </h2>
      </div>

      <div className="space-y-3">
        {earthquakes.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Nessun evento rilevato nel periodo selezionato.
          </div>
        ) : (
          earthquakes.slice(0, 4).map((earthquake, index) => (
            <div
              key={`${earthquake.time}-${index}`}
              className="rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">
                  M {formatMagnitude(earthquake.magnitude)}
                </p>
                <p className="text-sm text-slate-500">
                  {earthquake.formattedTime ?? "Data non disponibile"}
                </p>
              </div>
              <p className="mt-1 text-sm text-slate-600">{earthquake.place}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function formatMagnitude(value) {
  if (value == null) {
    return "N/D";
  }

  return value.toFixed(1);
}

export default EarthquakeList;
