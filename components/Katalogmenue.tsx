import { Button } from "react-bootstrap";
import * as json from "../json/MENU_DVBMOB_G230801_0000_F2_1_Katalogmenue.json";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function Katalogmenue() {
  const { tarifprodukte } = json;
  type pvType = { PVNr: number; PVText: string };
  type produktType = {ProduktbezeichnungNr: number,
    ProduktbezeichnungText: string}
  const [selectedPv, setSelectedPv] = useState<pvType | undefined>(undefined);


  const initialValue: { PVNr: number; PVText: string }[] = [];
  const pv = tarifprodukte
    .map((tp) => {
      const { PVNr, PVText } = tp;
      return { PVNr, PVText };
    })
    .reduce((accumulator, current) => {
      if (!accumulator.find((item) => item.PVNr === current.PVNr)) {
        accumulator.push(current);
      }
      return accumulator;
    }, initialValue);

    const intialPvTarifprodukte : produktType[] = []
    const pvTarifprodukte = (pv:pvType) => tarifprodukte.filter(tp=>tp.PVNr === pv.PVNr)    
    .map(tp => {
        const { ProduktbezeichnungNr, ProduktbezeichnungText } = tp;
        return { ProduktbezeichnungNr, ProduktbezeichnungText }
    })
    .reduce((accumulator, current) => {
        if (!accumulator.find((item) => item.ProduktbezeichnungNr === current.ProduktbezeichnungNr)) {
          accumulator.push(current);
        }
        return accumulator;
      },intialPvTarifprodukte );
  

  return (
    <>
      <div className="container">

          <h1>Test Katalogmenü</h1>

          {!selectedPv && (
            <div className="d-grid gap-2 mx-auto">
              {pv.map((pvItem) => (
                <Button
                  size="lg"
                  onClick={() => setSelectedPv(pvItem)}
                  key={pvItem.PVText + "button"}
                >
                  {pvItem.PVText + "-Tarif"}
                </Button>
              ))}
            </div>
          )}
          {selectedPv && (
            <>
              <span className="fs-3">
                <b>Tarif: </b>
                {selectedPv.PVText}
              </span>
              <Button
                type="button"
                className="close m-1"
                variant="light"
                size="sm"
                aria-label="Close"
                onClick={() => setSelectedPv(undefined)}
              >
                <FontAwesomeIcon size="sm" icon={faPen} />
              </Button>
            </>
          )}
          {selectedPv && <>
            <div className="d-grid gap-2 mx-auto">
            {pvTarifprodukte(selectedPv).map(tp => <Button
                key={selectedPv.PVNr.toString() + tp.ProduktbezeichnungNr.toString()}>
                    {tp.ProduktbezeichnungText}
                </Button>
                )}
                </div>
            </>}
      </div>
    </>
  );
}
