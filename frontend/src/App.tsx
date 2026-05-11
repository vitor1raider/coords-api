import "./index.css";
import { Map } from "./components/Map/Map.tsx";

import { fetchPoints } from "./services/api.ts";
import { useState, useEffect } from "react";
import type { Point } from "./types/point.ts";
import { Loader, Search } from "lucide-react";
import { FormPoint } from "./components/FormPoint/index.tsx";

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
  }
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
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <button
              type="button"
              className="cursor-pointer flex items-center justify-center text-white bg-blue-700 h-9 w-9 rounded-md  hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
              onClick={() => handleSearch()}
            >
              {loading ? <Loader /> : <Search size={16} strokeWidth={3} />}
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
