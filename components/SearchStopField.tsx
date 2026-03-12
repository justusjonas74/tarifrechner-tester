import React from "react";
import { IPoint } from "dvbjs";
import AsyncSelect from "react-select/async";
import { api } from "@/lib/apiFetch";

interface SearchStopFieldProps {
  handleNewSelectedStop: (stop: IPoint) => void;
}

interface Option {
  value: string;
  label: string;
  stop: IPoint;
}

const formatOptionLabel = (option: Option) => (
  <div>
    {option.stop.name}
    <br />
    <small style={{ fontSize: "0.8em", color: "#666" }}>{option.stop.city}</small>
  </div>
);

export default function SearchStopField(props: SearchStopFieldProps) {
  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const searchTerm = inputValue.trim();
    if (searchTerm.length < 3) {
      return [];
    }

    const data = await api<IPoint[]>(
      "api/stops?" +
        new URLSearchParams({
          name: searchTerm,
        }),
    );

    if (data) {
      return data.slice(0, 20).map((stop) => ({
        value: stop.id || stop.name,
        label: stop.name,
        stop: stop,
      }));
    }

    return [];
  };

  const handleChange = (option: Option | null) => {
    if (option) {
      props.handleNewSelectedStop(option.stop);
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      placeholder="Haltstelle suchen..."
      noOptionsMessage={({ inputValue }) =>
        inputValue.trim().length < 3 ? "Mindestens 3 Zeichen eingeben" : "Keine Haltestellen gefunden"
      }
      loadingMessage={() => "Lade..."}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "31px",
          height: "31px",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0 6px",
        }),
        input: (base) => ({
          ...base,
          margin: "0",
          padding: "0",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: "29px",
        }),
      }}
    />
  );
}
