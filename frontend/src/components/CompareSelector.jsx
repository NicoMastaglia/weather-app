import { Repeat2 } from "lucide-react";

import { cities } from "../data/cities";

function CompareSelector({
  isCompareMode,
  onToggleCompareMode,
  cityA,
  cityB,
  onChangeCityA,
  onChangeCityB,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-soft backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Modalità confronto
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Confronto in tempo reale tra due città
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleCompareMode}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            isCompareMode
              ? "bg-sky-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Repeat2 size={16} />
          {isCompareMode ? "Disattiva confronto" : "Attiva confronto"}
        </button>
      </div>

      {isCompareMode ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <SelectField
            label="Città A"
            value={cityA}
            onChange={onChangeCityA}
            options={cities}
          />
          <SelectField
            label="Città B"
            value={cityB}
            onChange={onChangeCityB}
            options={cities}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          Attiva il confronto per selezionare due città e visualizzarle
          affiancate.
        </p>
      )}
    </section>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      >
        {options.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CompareSelector;
