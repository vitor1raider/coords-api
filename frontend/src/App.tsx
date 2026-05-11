import "./index.css";
import { Map } from "./components/Map/Map.tsx";
import { FormPoint } from "./components/FormPoint/index.tsx";

function App() {
  return (
    <main className="flex h-screen m-auto container py-10">
      <div className="flex flex-col px-4">
        <FormPoint />
      </div>
      <div className="w-full h-full">
        <Map />
      </div>
    </main>
  );
}

export default App;
