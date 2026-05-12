import { useState, type FormEvent } from "react";
import { pointSchema } from "../../libs/validator";
import { createPoint } from "../../services/api";

interface FormPointProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
}

export function FormPoint({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
}: FormPointProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClearForm = () => {
    setName("");
    onLatitudeChange("");
    onLongitudeChange("");
  };

  const handleCreatePoint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = pointSchema.safeParse({
      name,
      latitude,
      longitude,
    });

    if (!validation.success) {
      window.alert(validation.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }

    setLoading(true);
    try {
      await createPoint({
        name: validation.data.name,
        latitude: validation.data.latitude,
        longitude: validation.data.longitude,
      });
      handleClearForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCreatePoint}
      className="flex bg-white rounded-lg flex-col w-full space-y-2 p-5 border border-neutral-200"
    >
      <div className="mb-4 text-black">
        <h1 className="text-2xl font-semibold">Gerenciador de Pontos</h1>
        <p className="text-sm muted">
          Adicione, busque e visualize pontos no mapa
        </p>
      </div>
      <div>
        <label htmlFor="point-name" className="text-neutral-900 text-sm">
          Nome:
        </label>
        <input
          type="text"
          id="point-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Informe o nome do ponto"
          className="w-full text-sm rounded-md border border-neutral-200 outline-none focus:ring-1 focus:shadow-md focus:ring-blue-700 h-9 pl-2"
        />
      </div>

      <div className="w-full flex gap-2">
        <div className="w-full">
          <label htmlFor="point-latitude" className="text-neutral-900 text-sm">
            Latitude:
          </label>
          <input
            type="number"
            id="point-latitude"
            step="any"
            value={latitude}
            onChange={(event) => onLatitudeChange(event.target.value)}
            placeholder="Informe a latitude"
            className="w-full text-sm rounded-md border border-neutral-200 outline-none focus:ring-1 focus:shadow-md focus:ring-blue-700 h-9 pl-2"
          />
        </div>
        <div className="w-full">
          <label htmlFor="point-longitude" className="text-neutral-900 text-sm">
            Longitude:
          </label>
          <input
            type="number"
            id="point-longitude"
            step="any"
            value={longitude}
            onChange={(event) => onLongitudeChange(event.target.value)}
            placeholder="Informe a longitude"
            className="w-full text-sm rounded-md border border-neutral-200 outline-none focus:ring-1 focus:shadow-md focus:ring-blue-700 h-9 pl-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer text-sm text-white bg-green-700 px-3 py-2 rounded-md"
      >
        {loading ? "Salvando..." : "Adicionar Ponto"}
      </button>
    </form>
  );
}
