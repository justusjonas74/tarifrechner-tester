import { IELEMENT } from "pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export interface TARIFZONEN extends IELEMENT { }

interface MultiSelectProps {
  items: TARIFZONEN[];
  selectedItems?: TARIFZONEN[];
  onChange: (selected: TARIFZONEN[]) => void;
}
export default function MultiSelect({ items, onChange, selectedItems }: MultiSelectProps) {
  const [selected, setSelected] = useState<string[]>(selectedItems?.map((i) => i.nr) || []);
  useEffect(() => {
    const selectedItems = items.filter((i) => selected.includes(i.nr));
    onChange(selectedItems);
  }, [selected]);

  const toggleSelect = (nr: string) => {
    setSelected((prev) =>
      prev.includes(nr) ? prev.filter((id) => id !== nr) : [...prev, nr]
    )
  };

  const selectAll = () => setSelected(items.map((i) => i.nr));
  const selectNone = () => setSelected([]);

  return (
    <div>
      <h5>Tarifzonen auswählen</h5>
      <div
        className="d-flex flex-wrap gap-2 mb-4"
        style={{
          maxWidth: "700px",
        }}
      >
        {items.map((item) => {
          const isSelected = selected.includes(item.nr);
          return (
            <Button
              key={item.nr}
              variant={isSelected ? "primary" : "outline-primary"}
              onClick={() => toggleSelect(item.nr)}
              className="rounded-pill px-3 py-1"
              style={{
                transition: "all 0.15s ease-in-out",
                backgroundColor: isSelected ? "#0d6efd" : "transparent",
                color: isSelected ? "white" : "#0d6efd",
                borderColor: "#0d6efd",
              }}
            >
              {"TZ " + item.nr + " - " + item.name}
            </Button>
          );
        })}
      </div>
      <div className="d-flex gap-2">
        <Button variant="secondary" onClick={selectAll}>
          Alle auswählen
        </Button>
        <Button variant="secondary" onClick={selectNone}>
          Keine auswählen
        </Button>
        {/* <Button variant="primary" onClick={handleSubmit}> */}
        {/*   Submit */}
        {/* </Button> */}
      </div>
    </div>
  );
};
