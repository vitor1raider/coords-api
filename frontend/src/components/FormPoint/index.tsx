import { useState, type FormEvent } from "react";
import { LocateFixed, MapPin, Plus } from "lucide-react";
import type { Point } from "../../types/point";
import { pointSchema } from "../../libs/validator";
import { createPoint } from "../../services/api";

interface FormPointProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  onCreate?: (point: Point) => void;
}

export function FormPoint({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  onCreate,
}: FormPointProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePoint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const validation = pointSchema.safeParse({ name, latitude, longitude });
    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Confira os dados informados.",
      );
      return;
    }
    setLoading(true);
    try {
      const newPoint = await createPoint(validation.data);
      onCreate?.(newPoint);
      setName("");
      onLatitudeChange("");
      onLongitudeChange("");
    } catch {
      setError("Não foi possível salvar o ponto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCreatePoint}
      className="rounded-[18px] border border-[#dde5e0] bg-white p-5.5 shadow-[0_4px_20px_rgba(31,48,40,.045)] max-md:order-1 max-[420px]:p-4.5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="m-0 text-[10px] leading-none font-bold tracking-[.12em] text-[#008a59] uppercase">
            Novo local
          </p>
          <h1 className="mt-0.5 mb-0 font-[Manrope] text-xl leading-tight font-extrabold tracking-[-.035em] text-[#17202a]">
            Adicionar ponto
          </h1>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-[#eaf5ef] text-[#008a59]">
          <MapPin size={20} />
        </div>
      </div>
      <p className="mt-4 mb-4 flex items-center gap-2 rounded-xl bg-[#f3f8f5] px-3 py-2.5 text-xs text-[#486357]">
        <LocateFixed size={15} /> Clique no mapa para capturar as coordenadas.
      </p>
      <label className="mt-3 grid gap-2">
        <span className="text-xs font-semibold text-[#3e4a44]">
          Nome do ponto
        </span>
        <input
          className="h-10.5 w-full rounded-xl border border-[#d7e0db] bg-[#fbfcfb] px-3 text-[13px] text-[#17202a] outline-none transition placeholder:text-[#9aa49f] focus:border-[#008a59] focus:bg-white focus:ring-3 focus:ring-[#008a59]/10"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Informe um nome para o ponto"
          maxLength={255}
        />
      </label>
      <div className="grid grid-cols-2 gap-2.5 max-[420px]:grid-cols-1 max-[420px]:gap-0">
        <label className="mt-3 grid gap-2">
          <span className="text-xs font-semibold text-[#3e4a44]">Latitude</span>
          <input
            className="h-10.5 w-full rounded-xl border border-[#d7e0db] bg-[#fbfcfb] px-3 text-[13px] text-[#17202a] outline-none transition placeholder:text-[#9aa49f] focus:border-[#008a59] focus:bg-white focus:ring-3 focus:ring-[#008a59]/10"
            type="number"
            step="any"
            value={latitude}
            onChange={(event) => onLatitudeChange(event.target.value)}
            placeholder="-27.5948"
          />
        </label>
        <label className="mt-3 grid gap-2">
          <span className="text-xs font-semibold text-[#3e4a44]">
            Longitude
          </span>
          <input
            className="h-10.5 w-full rounded-xl border border-[#d7e0db] bg-[#fbfcfb] px-3 text-[13px] text-[#17202a] outline-none transition placeholder:text-[#9aa49f] focus:border-[#008a59] focus:bg-white focus:ring-3 focus:ring-[#008a59]/10"
            type="number"
            step="any"
            value={longitude}
            onChange={(event) => onLongitudeChange(event.target.value)}
            placeholder="-48.5482"
          />
        </label>
      </div>
      {error && (
        <p className="mt-2.5 -mb-1 text-xs text-[#b42318]" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex min-h-10.5 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[#008a59] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_5px_14px_rgba(0,138,89,.18)] transition hover:-translate-y-px hover:bg-[#008a59] hover:brightness-90 hover:shadow-lg disabled:cursor-wait disabled:opacity-65 disabled:transform-none"
      >
        {loading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />{" "}
            Salvando...
          </>
        ) : (
          <>
            <Plus size={18} /> Adicionar ao mapa
          </>
        )}
      </button>
    </form>
  );
}
