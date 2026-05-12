import "./index.css";
import { Map } from "./components/Map/index.tsx";
import { deletePoint, fetchPoints, searchByName } from "./services/api.ts";
import { useState, useEffect, useRef } from "react";
import type { Point } from "./types/point.ts";
import { LoaderCircle, Search, Trash2 } from "lucide-react";
import { FormPoint } from "./components/FormPoint/index.tsx";

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLatitude, setFormLatitude] = useState("");
  const [formLongitude, setFormLongitude] = useState("");
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

  const handleDeletePoint = async (id: number) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o ponto ${points.find((p) => p.id === id)?.name}?`,
    );
    if (confirmed) {
      await deletePoint(id);
      setPoints((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleMapClick = (latitude: number, longitude: number) => {
    setFormLatitude(latitude.toFixed(6));
    setFormLongitude(longitude.toFixed(6));
  };

  console.log(points)

  return (
    <main className="flex h-screen m-auto container py-10">
      <div className="flex flex-col px-4">
        <FormPoint
          latitude={formLatitude}
          longitude={formLongitude}
          onLatitudeChange={setFormLatitude}
          onLongitudeChange={setFormLongitude}
        />
        <div className="flex bg-white h-full p-5 border border-neutral-200 rounded-lg mt-5 flex-col gap-2">
          <p>Pontos ({points.length})</p>
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
              className="cursor-pointer flex items-center justify-center text-white bg-blue-700 h-9 w-9 rounded-md  hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
              onClick={() => handleSearch(searchName.current?.value || "")}
            >
              {loading ? (
                <LoaderCircle />
              ) : (
                <Search size={16} strokeWidth={3} />
              )}
            </button>
          </div>
          <div className="space-y-2 h-100 overflow-y-auto">
            {points.map((point) => (
              <div
                key={point.id}
                className={`p-3 border border-neutral-200 rounded-lg flex items-center justify-between cursor-pointer transition-all`}
              >
                <div className="flex items-center gap-2 flex-1">
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
                    handleDeletePoint(point.id);
                  }}
                >
                  <Trash2 size={16} color="red" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <Map points={points} onMapClick={handleMapClick} />
      </div>
    </main>
  );
}

export default App;
