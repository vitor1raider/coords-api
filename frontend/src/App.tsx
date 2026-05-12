import "./index.css";
import { Map } from "./components/Map/index.tsx";
import {
  calculateDistance,
  deletePoint,
  fetchPoints,
  searchByName,
} from "./services/api.ts";
import { useState, useEffect, useRef } from "react";
import type { Point } from "./types/point.ts";
import { Check, LoaderCircle, Search, Trash2 } from "lucide-react";
import { FormPoint } from "./components/FormPoint/index.tsx";
import { Modal } from "./components/Modal/index.tsx";

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
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
  const searchName = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPoints = async () => {
      setLoading(true);
      try {
        const data = await fetchPoints();
        setPoints(data);
      } catch {
        console.error("Failed to fetch points");
      } finally {
        setLoading(false);
      }
    };
    loadPoints();
  }, []);

  const handleSearch = async (name: string) => {
    setLoading(true);

    const searchField = name.trim();

    try {
      const search = searchField
        ? await searchByName(searchField)
        : await fetchPoints();

      setPoints(search);
    } catch {
      console.error("Failed to search points");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDistance = async () => {
      if (selectedPoints.length !== 2 || distanceResult) {
        return;
      }

      const pointA = points.find((p) => p.id === selectedPoints[0]);
      const pointB = points.find((p) => p.id === selectedPoints[1]);

      if (!pointA || !pointB) {
        return;
      }

      const distance = await calculateDistance(pointA.id, pointB.id);

      setDistanceResult({
        pointAName: pointA.name,
        pointBName: pointB.name,
        distance,
      });
    };

    fetchDistance();
  }, [selectedPoints, points, distanceResult]);

  const handleDeletePoint = (point: Point) => {
    setPointToDelete(point);
  };

  const handleConfirmDelete = async () => {
    if (!pointToDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePoint(pointToDelete.id);
      setPoints((prev) => prev.filter((p) => p.id !== pointToDelete.id));
      setSelectedPoints((prev) => prev.filter((id) => id !== pointToDelete.id));
      setPointToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDistanceModal = () => {
    setDistanceResult(null);
    setSelectedPoints([]);
  };

  const handleMapClick = (latitude: number, longitude: number) => {
    setFormLatitude(latitude.toFixed(6));
    setFormLongitude(longitude.toFixed(6));
  };

  const handleSelectPoint = (id: number) => {
    setSelectedPoints((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }

      if (current.length < 2) {
        return [...current, id];
      }

      return [current[1], id];
    });
  };

  return (
    <>
      <main className="flex flex-col md:flex-row h-screen m-auto container py-4 md:py-10 px-4 gap-4">
        <div className="w-full h-[55vw] min-h-65 md:h-full md:min-h-0 order-first md:order-last">
          <Map
            points={points}
            onMapClick={handleMapClick}
            selectedPoints={selectedPoints}
            onSelectPoint={handleSelectPoint}
          />
        </div>

        <div className="flex flex-col md:w-80 lg:w-100 md:shrink-0 order-last md:order-first">
          <FormPoint
            latitude={formLatitude}
            longitude={formLongitude}
            onLatitudeChange={setFormLatitude}
            onLongitudeChange={setFormLongitude}
          />
          <div className="flex bg-white md:h-full max-h-80 md:max-h-full overflow-y-auto p-5 border border-neutral-200 rounded-lg mt-5 flex-col gap-2">
            <p className="text-sm">Pontos ({points.length})</p>
            <div className="flex gap-2 items-end justify-end relative">
              <div className="w-full">
                <input
                  type="text"
                  id="search"
                  className="w-full text-sm rounded-md border border-neutral-200 outline-none focus:ring-1 focus:shadow-md focus:ring-blue-700 h-9 pl-2"
                  placeholder="Buscar por nome"
                  ref={searchName}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch(searchName.current?.value || "");
                    }
                  }}
                />
              </div>
              <button
                type="button"
                className="cursor-pointer flex items-center justify-center text-white bg-blue-700 h-9 w-9 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
                onClick={() => handleSearch(searchName.current?.value || "")}
              >
                {loading ? (
                  <LoaderCircle />
                ) : (
                  <Search size={16} strokeWidth={3} />
                )}
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
              {points.map((point) => (
                <div
                  key={point.id}
                  onClick={() => handleSelectPoint(point.id)}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all border ${
                    selectedPoints.includes(point.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {selectedPoints.includes(point.id) && (
                      <Check size={16} className="text-blue-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-sm">{point.name}</p>
                      <span className="text-xs text-neutral-600">
                        Latitude: {point.latitude.toFixed(6)}, Longitude:{" "}
                        {point.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePoint(point);
                    }}
                  >
                    <Trash2 size={16} color="red" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={Boolean(pointToDelete)}
        title="Excluir ponto"
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        confirmVariant="delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setPointToDelete(null)}
      >
        Tem certeza que deseja excluir o ponto{" "}
        <strong>{pointToDelete?.name}</strong>?
      </Modal>

      <Modal
        isOpen={Boolean(distanceResult)}
        title="Distância calculada"
        confirmLabel="Fechar"
        showCancel={false}
        onClose={handleCloseDistanceModal}
        showButtons={false}
      >
        Distância entre <strong>{distanceResult?.pointAName}</strong> e{" "}
        <strong>{distanceResult?.pointBName}</strong>:{" "}
        {distanceResult?.distance} km.
      </Modal>
    </>
  );
}

export default App;
