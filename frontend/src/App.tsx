import "./index.css";
import { Map } from "./components/Map/index.tsx";
import {
  calculateDistance,
  deletePoint,
  fetchPoints,
  searchByName,
} from "./services/api.ts";
import { useCallback, useEffect, useState } from "react";
import type { Point } from "./types/point.ts";
import {
  Check,
  LoaderCircle,
  MapPin,
  Route,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { FormPoint } from "./components/FormPoint/index.tsx";
import { Modal } from "./components/Modal/index.tsx";

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  const [formLatitude, setFormLatitude] = useState("");
  const [formLongitude, setFormLongitude] = useState("");
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [pointToDelete, setPointToDelete] = useState<Point | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [distanceResult, setDistanceResult] = useState<{
    pointAName: string;
    pointBName: string;
    distance: number;
  } | null>(null);

  const loadPoints = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPoints(await fetchPoints());
      setHasActiveSearch(false);
    } catch {
      setError("Não foi possível carregar os pontos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadPoints);
  }, [loadPoints]);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    const query = searchTerm.trim();
    try {
      setPoints(query ? await searchByName(query) : await fetchPoints());
      setHasActiveSearch(Boolean(query));
    } catch {
      setError("Não foi possível realizar a busca.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDistance = async () => {
      if (selectedPoints.length !== 2 || distanceResult) return;
      const pointA = points.find((point) => point.id === selectedPoints[0]);
      const pointB = points.find((point) => point.id === selectedPoints[1]);
      if (!pointA || !pointB) return;
      try {
        const distance = await calculateDistance(pointA.id, pointB.id);
        setDistanceResult({
          pointAName: pointA.name,
          pointBName: pointB.name,
          distance,
        });
      } catch {
        setError("Não foi possível calcular a distância.");
        setSelectedPoints([]);
      }
    };
    fetchDistance();
  }, [selectedPoints, points, distanceResult]);

  const handleConfirmDelete = async () => {
    if (!pointToDelete) return;
    setIsDeleting(true);
    try {
      await deletePoint(pointToDelete.id);
      setPoints((current) =>
        current.filter((point) => point.id !== pointToDelete.id),
      );
      setSelectedPoints((current) =>
        current.filter((id) => id !== pointToDelete.id),
      );
      setPointToDelete(null);
    } catch {
      setError("Não foi possível excluir o ponto.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectPoint = (id: number) => {
    setDistanceResult(null);
    setSelectedPoints((current) => {
      if (current.includes(id))
        return current.filter((selectedId) => selectedId !== id);
      if (current.length < 2) return [...current, id];
      return [current[1], id];
    });
  };

  const selectedNames = selectedPoints
    .map((id) => points.find((point) => point.id === id)?.name)
    .filter(Boolean);
  const parsedLatitude = Number(formLatitude);
  const parsedLongitude = Number(formLongitude);
  const previewPosition: [number, number] | null =
    formLatitude.trim() !== "" &&
    formLongitude.trim() !== "" &&
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude) &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180
      ? [parsedLatitude, parsedLongitude]
      : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f7f5] max-md:h-auto max-md:min-h-dvh max-md:overflow-visible">
      <main className="mx-auto grid h-full min-h-0 w-full max-w-450 flex-1 grid-cols-[minmax(340px,410px)_1fr] gap-4.5 overflow-hidden p-4.5 max-md:flex max-md:flex-col max-md:gap-3 max-md:p-3">
        <aside className="flex h-full min-h-0 flex-col gap-3.5 overflow-hidden max-md:contents">
          <FormPoint
            latitude={formLatitude}
            longitude={formLongitude}
            onLatitudeChange={setFormLatitude}
            onLongitudeChange={setFormLongitude}
            onCreate={(newPoint) =>
              setPoints((current) => [newPoint, ...current])
            }
          />

          <section className="flex h-0 min-h-55 flex-1 flex-col overflow-hidden rounded-[18px] border border-[#dde5e0] bg-white px-3 pt-5 pb-3 shadow-[0_4px_20px_rgba(31,48,40,.045)] max-md:order-2 max-md:h-[clamp(340px,58vh,520px)] max-md:max-h-130 max-md:min-h-85 max-md:w-full max-md:flex-none max-[420px]:h-[min(68vh,480px)] max-[420px]:min-h-80">
            <div className="flex items-center justify-between gap-4 px-2">
              <div>
                <p className="m-0 text-[10px] leading-none font-bold tracking-[.12em] text-[#008a59] uppercase">
                  Seus locais
                </p>
                <h2 className="mt-0.5 mb-0 font-[Manrope] text-lg leading-tight font-extrabold tracking-[-.035em] text-[#17202a]">
                  Pontos salvos
                </h2>
              </div>
              <span className="grid h-7 min-w-7 place-items-center rounded-lg bg-[#eaf5ef] px-2 text-xs font-bold text-[#008a59]">
                {points.length}
              </span>
            </div>
            <div className="mx-1 mt-4 mb-3 flex h-10.5 items-center gap-2 rounded-xl border border-[#d7e0db] bg-[#fbfcfb] pl-3 text-[#78847e] transition focus-within:border-[#008a59] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#008a59]/10">
              <Search size={17} aria-hidden="true" />
              <input
                className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] text-[#17202a] outline-none placeholder:text-[#9aa49f]"
                value={searchTerm}
                aria-label="Buscar ponto por nome"
                placeholder="Buscar por nome..."
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              />
              {searchTerm && (
                <button
                  className="grid cursor-pointer place-items-center rounded-lg border-0 bg-transparent p-1 text-[#718078] hover:bg-[#008a59]/8 hover:text-[#17202a]"
                  type="button"
                  aria-label="Limpar busca"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={15} />
                </button>
              )}
              <button
                className="h-full cursor-pointer rounded-r-[9px] border-0 bg-[#008a59] px-3 text-xs font-bold text-white disabled:opacity-70"
                type="button"
                aria-label="Buscar"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin" size={17} />
                ) : (
                  "Buscar"
                )}
              </button>
            </div>

            {selectedPoints.length > 0 && (
              <div className="mx-1 mb-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-xl border border-[#cee6d9] bg-[#eaf5ef] p-2.5 text-[#008a59]">
                <div className="grid size-7.5 place-items-center rounded-lg bg-[#008a59] text-white">
                  <Route size={16} />
                </div>
                <div className="min-w-0">
                  <strong className="block text-[11px]">
                    {selectedPoints.length}/2 selecionados
                  </strong>
                  <span className="block truncate text-[10px] text-[#5e7368]">
                    {selectedNames.join(" • ") || "Escolha outro ponto"}
                  </span>
                </div>
                <button
                  type="button"
                  className="grid cursor-pointer place-items-center rounded-lg border-0 bg-transparent p-2 text-[#718078] hover:bg-[#008a59]/8 hover:text-[#17202a]"
                  aria-label="Limpar seleção"
                  onClick={() => setSelectedPoints([])}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {error && (
              <div
                className="mx-1 mb-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-[11px] text-orange-800"
                role="alert"
              >
                {error}{" "}
                <button
                  className="cursor-pointer border-0 bg-transparent p-0 font-bold text-inherit underline"
                  type="button"
                  onClick={loadPoints}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 pt-0.5 pb-1 [scrollbar-color:#cdd8d2_transparent] scrollbar-thin">
              {loading && points.length === 0 && (
                <div className="flex min-h-37.5 flex-1 flex-col items-center justify-center p-5 text-center text-[#7c8982]">
                  <LoaderCircle className="animate-spin" />
                  <p className="mt-1 text-[11px]">Carregando seus pontos...</p>
                </div>
              )}
              {!loading && points.length === 0 && (
                <div className="flex min-h-37.5 flex-1 flex-col items-center justify-center p-5 text-center text-[#7c8982]">
                  <div className="grid size-12 place-items-center rounded-2xl bg-[#eaf5ef] text-[#008a59]">
                    <MapPin size={24} />
                  </div>
                  <strong className="mt-2.5 text-sm text-[#35423b]">
                    {hasActiveSearch
                      ? "Nenhum resultado encontrado"
                      : "Seu mapa está vazio"}
                  </strong>
                  <p className="mt-1 max-w-62.5 text-[11px] leading-normal">
                    {hasActiveSearch
                      ? "Tente buscar por outro nome."
                      : "Clique no mapa ou preencha o formulário para adicionar o primeiro ponto."}
                  </p>
                </div>
              )}
              {points.map((point) => {
                const isSelected = selectedPoints.includes(point.id);
                return (
                  <article
                    key={point.id}
                    className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 outline-none transition hover:-translate-y-px hover:border-[#b7cabf] hover:shadow-sm focus-visible:ring-3 focus-visible:ring-[#008a59]/15 ${isSelected ? "border-[#008a59] bg-[#f0f8f4]" : "border-[#e1e7e3] bg-white"}`}
                    onClick={() => handleSelectPoint(point.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    onKeyDown={(event) =>
                      (event.key === "Enter" || event.key === " ") &&
                      handleSelectPoint(point.id)
                    }
                  >
                    <div
                      className={`grid size-8 shrink-0 place-items-center rounded-lg ${isSelected ? "bg-[#008a59] text-white" : "bg-[#eaf5ef] text-[#008a59]"}`}
                    >
                      {isSelected ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        <MapPin size={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-[13px] text-[#29352f]">
                        {point.name}
                      </strong>
                      <span className="mt-0.5 block truncate text-[10px] text-[#849089] tabular-nums">
                        {point.latitude.toFixed(5)},{" "}
                        {point.longitude.toFixed(5)}
                      </span>
                    </div>
                    <button
                      className="grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#b42318] opacity-45 transition hover:bg-[#fff0ef] hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                      type="button"
                      aria-label={`Excluir ${point.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setPointToDelete(point);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        </aside>

        <section
          className="relative min-h-115 overflow-hidden rounded-[22px] border-6 border-white bg-[#dfe8e3] shadow-[0_7px_28px_rgba(31,48,40,.11)] max-md:order-first max-md:h-[48vh] max-md:min-h-85 max-[420px]:h-[44vh] max-[420px]:min-h-75 max-[420px]:border-4 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:rounded-2xl"
          aria-label="Mapa de pontos"
        >
          <div className="pointer-events-none absolute top-3.5 left-1/2 z-500 flex max-w-[calc(100%-120px)] -translate-x-1/2 items-center gap-2 rounded-full border border-[#d7e0db]/80 bg-white/95 px-3 py-2 text-[11px] whitespace-nowrap text-[#46544d] shadow-md backdrop-blur-md max-md:left-3 max-md:max-w-[calc(100%-24px)] max-md:translate-x-0 max-[420px]:whitespace-normal">
            <MapPin className="shrink-0 text-[#008a59]" size={16} />
            <span>
              <strong>Clique no mapa</strong> para preencher as coordenadas
            </span>
          </div>
          <Map
            points={points}
            previewPosition={previewPosition}
            onMapClick={(latitude, longitude) => {
              setFormLatitude(latitude.toFixed(6));
              setFormLongitude(longitude.toFixed(6));
            }}
            selectedPoints={selectedPoints}
            onSelectPoint={handleSelectPoint}
          />
        </section>
      </main>

      <Modal
        isOpen={Boolean(pointToDelete)}
        title="Excluir ponto?"
        confirmLabel="Sim, excluir"
        confirmVariant="delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setPointToDelete(null)}
      >
        O ponto <strong>{pointToDelete?.name}</strong> será removido
        permanentemente do mapa.
      </Modal>
      <Modal
        isOpen={Boolean(distanceResult)}
        title="Distância calculada"
        showButtons={false}
        onClose={() => {
          setDistanceResult(null);
          setSelectedPoints([]);
        }}
      >
        <div className="flex flex-col items-center pt-2 text-center">
          <div className="mb-3 grid size-12.5 place-items-center rounded-2xl bg-[#eaf5ef] text-[#008a59]">
            <Route size={24} />
          </div>
          <span className="text-xs text-[#69766f]">
            {distanceResult?.pointAName} → {distanceResult?.pointBName}
          </span>
          <strong className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-[-.04em] text-[#17202a]">
            {distanceResult?.distance.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            })}{" "}
            <small className="text-sm text-[#69766f]">km</small>
          </strong>
          <button
            className="mt-4.5 flex min-h-10.5 w-full cursor-pointer items-center justify-center rounded-xl border-0 bg-[#008a59] px-4 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:-translate-y-px hover:bg-[#008a59] hover:brightness-90"
            type="button"
            onClick={() => {
              setDistanceResult(null);
              setSelectedPoints([]);
            }}
          >
            Concluir
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
