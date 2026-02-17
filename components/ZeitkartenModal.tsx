import { IFAIRTIQ_BERECHTIGUNG } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import { Button, Modal } from "react-bootstrap";
import MultiSelect, { TARIFZONEN } from "./MultiSelect";
import { useState } from "react";
import { toast } from "react-toastify";


interface ZeitkartenModalProps {
  showModal: boolean,
  berechtigungsliste: IFAIRTIQ_BERECHTIGUNG[],
  reisenderIndex: number,
  handleCloseModal: () => void,
  handleUpdateBerechtigungsliste: (berechtigungsliste: IFAIRTIQ_BERECHTIGUNG[]) => void,
}

export default function ZeitkartenModal(props: ZeitkartenModalProps) {
  const items: TARIFZONEN[] = [
    { nr: "10", name: "Dresden" },
    { nr: "20", name: "Hoyerswerda" },
    { nr: "30", name: "Kamenz" },
    { nr: "31", name: "Radeberg" },
    { nr: "32", name: "Wittichenau" },
    { nr: "33", name: "Lauta" },
    { nr: "34", name: "Königsbrück" },
    { nr: "40", name: "Großenhain" },
    { nr: "41", name: "Riesa" },
    { nr: "42", name: "Thiendorf" },
    { nr: "43", name: "Gröditz" },
    { nr: "50", name: "Meißen" },
    { nr: "51", name: "Nossen" },
    { nr: "52", name: "Radebeul" },
    { nr: "60", name: "Dippoldiswalde" },
    { nr: "61", name: "Freital" },
    { nr: "63", name: "Altenberg" },
    { nr: "70", name: "Pirna" },
    { nr: "71", name: "Bad Gottleuba" },
    { nr: "72", name: "Bad Schandau" },
    { nr: "73", name: "Neustadt" },
    { nr: "81", name: "Bischofswerda Bus" },
    { nr: "82", name: "Königswartha" },
    { nr: "92", name: "Spremberg" },
    { nr: "93", name: "Elsterwerda" },
    { nr: "94", name: "Mühlberg" },
    { nr: "96", name: "Döbeln" },
    { nr: "97", name: "Hetzdorf" },
    { nr: "98", name: "Bienenmühle" }
  ];


  function hinterlegteTarifzonen(): TARIFZONEN[] {
    const berechtigung = props.berechtigungsliste.find(berechtigung => berechtigung.reisendenbezug.includes(props.reisenderIndex + 1));
    const gueltigkeitsraum = berechtigung?.eingabedaten?.gueltigkeitsraum
    if (!berechtigung || !gueltigkeitsraum || gueltigkeitsraum.length !== 0) { return [] }
    return gueltigkeitsraum.map(element => items.find(item => item.nr === element.nr)).filter(item => item !== undefined)
  }

  const [selectedTarifzones, setSelectedTarifzones] = useState<TARIFZONEN[]>(hinterlegteTarifzonen());

  const handleChangedTarifzonen = (selectedZones: TARIFZONEN[]) => {
    setSelectedTarifzones(selectedZones);
  }

  const { handleCloseModal, handleUpdateBerechtigungsliste } = props;

  const handleSaveChanges = () => {
    if (selectedTarifzones.length === 0) {
      toast.info("Die Zeitkarte wurde entfernt.");
      handleUpdateBerechtigungsliste([]);
    } else {

      const neueBerechtigung: IFAIRTIQ_BERECHTIGUNG = {
        reisendenbezug: [props.reisenderIndex + 1],
        eingabedaten: {
          version: "INOUTVVO_PHASE_1",
          pv: {
            nr: "6060",
            name: "VVO"
          },
          produktbezeichnung: {
            nr: "111111111111",
            name: "Produktbezeichnung Phase 1"
          },
          gebietsparameter: {
            nr: "2222222222",
            name: "Gebietsparameter Phase 1"
          },
          gueltigkeitsraum: selectedTarifzones,
          gueltigkeitsende: "2080-07-31+02:00",
        }
      };
      toast.success("Die Zeitkarte wurde gespeichert.");
      handleUpdateBerechtigungsliste([neueBerechtigung]);
    }
  }
  return (
    <Modal show={props.showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Zeitkarte hinterlegen für {props.reisenderIndex + 1}. Reisenden</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MultiSelect items={items} selectedItems={selectedTarifzones} onChange={handleChangedTarifzonen} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Schließen
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Speichern
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
