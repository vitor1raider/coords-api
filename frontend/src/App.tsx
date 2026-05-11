import "./index.css";
import { Map } from "./components/Map/Map.tsx";

function App() {
  return (
    <main className="flex h-screen m-auto container">
      <div className="w-full h-full">
        <Map />
      </div>
    </main>
  );
}

export default App;
