import "./index.css";
import { Map } from "./components/Map/Map.tsx";

import { fetchPoints, searchByName } from "./services/api.ts";
import { useState, useEffect, useRef } from "react";
import type { Point } from "./types/point.ts";
import { LoaderCircle, Search } from "lucide-react";
import { FormPoint } from "./components/FormPoint/index.tsx";

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
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
  
  return (
    <main className="flex h-screen m-auto container py-10">
      <div className="flex flex-col px-4">
        <FormPoint />
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
              {loading ? <LoaderCircle /> : <Search size={16} strokeWidth={3} />}
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
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <Map />
      </div>
    </main>
  );
}

export default App;
