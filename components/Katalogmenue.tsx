import { Button } from "react-bootstrap";
import * as json from "../json/MENU_DVBMOB_G230801_0000_F2_1_Katalogmenue.json";
import { useState, useEffect, useCallback } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function Katalogmenue() {
  const { tarifprodukte, zonenwahl } = json;
  type pvType = { PVNr: number; PVText: string };
  type produktType = {
    ProduktbezeichnungNr: number;
    ProduktbezeichnungText: string;
  };

  type gebietsType = {
    GebietsparameterNr: number;
    GebietsparameterText: string;
    Zonenwahl: number;
  };

  type zonenType = {
    nr: string;
    name: string;
  }[];

  const [selectedPv, setSelectedPv] = useState<pvType | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<
    produktType | undefined
  >(undefined);
  const [selectedGebiet, setSelectedGebiet] = useState<gebietsType | undefined>(
    undefined,
  );
  const [selectedZonen, setSelectedZonen] = useState<zonenType | undefined>(
    undefined,
  );

  const pvTarifproduktGebiete = useCallback(
    (pv: pvType, produkt: produktType) => {
      const intialPvTarifproduktGebiete: gebietsType[] = [];
      return tarifprodukte
        .filter(
          (tp) =>
            tp.PVNr === pv.PVNr &&
            tp.ProduktbezeichnungNr === produkt.ProduktbezeichnungNr,
        )
        .map((tp) => {
          const { GebietsparameterNr, GebietsparameterText, Zonenwahl } = tp;
          return { GebietsparameterNr, GebietsparameterText, Zonenwahl };
        })
        .reduce((accumulator, current) => {
          if (
            !accumulator.find(
              (item) => item.GebietsparameterNr === current.GebietsparameterNr,
            )
          ) {
            accumulator.push(current);
          }
          return accumulator;
        }, intialPvTarifproduktGebiete);
    },
    [tarifprodukte],
  );

  useEffect(() => {
    if (!selectedPv) {
      setSelectedProduct(undefined);
      setSelectedGebiet(undefined);
      setSelectedZonen(undefined);
    }
    if (!selectedProduct) {
      setSelectedGebiet(undefined);
      setSelectedZonen(undefined);
    }
    if (
      selectedProduct &&
      selectedPv &&
      !selectedGebiet &&
      pvTarifproduktGebiete(selectedPv, selectedProduct).length == 1
    ) {
      setSelectedGebiet(pvTarifproduktGebiete(selectedPv, selectedProduct)[0]);
    }
    if (!selectedGebiet) {
      setSelectedZonen(undefined);
    }
  }, [
    selectedPv,
    selectedProduct,
    selectedGebiet,
    selectedZonen,
    pvTarifproduktGebiete,
  ]);

  const initialPvValue: { PVNr: number; PVText: string }[] = [];
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
    }, initialPvValue);

  const intialPvTarifprodukte: produktType[] = [];
  const pvTarifprodukte = (pv: pvType) =>
    tarifprodukte
      .filter((tp) => tp.PVNr === pv.PVNr)
      .map((tp) => {
        const { ProduktbezeichnungNr, ProduktbezeichnungText } = tp;
        return { ProduktbezeichnungNr, ProduktbezeichnungText };
      })
      .reduce((accumulator, current) => {
        if (
          !accumulator.find(
            (item) =>
              item.ProduktbezeichnungNr === current.ProduktbezeichnungNr,
          )
        ) {
          accumulator.push(current);
        }
        return accumulator;
      }, intialPvTarifprodukte);

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
        {selectedPv && !selectedProduct && (
          <>
            <div className="d-grid gap-2 mx-auto">
              {pvTarifprodukte(selectedPv).map((tp) => (
                <Button
                  key={
                    selectedPv.PVNr.toString() +
                    tp.ProduktbezeichnungNr.toString()
                  }
                  onClick={() => setSelectedProduct(tp)}
                >
                  {tp.ProduktbezeichnungText}
                </Button>
              ))}
            </div>
          </>
        )}
        {selectedPv && selectedProduct && (
          <>
            <span className="fs-3">
              <b>Produkt: </b>
              {selectedProduct.ProduktbezeichnungText}
            </span>
            <Button
              type="button"
              className="close m-1"
              variant="light"
              size="sm"
              aria-label="Close"
              onClick={() => setSelectedProduct(undefined)}
            >
              <FontAwesomeIcon size="sm" icon={faPen} />
            </Button>
          </>
        )}
        {selectedPv && selectedProduct && !selectedGebiet && (
          <>
            <div className="d-grid gap-2 mx-auto">
              {pvTarifproduktGebiete(selectedPv, selectedProduct).map((tp) => (
                <Button
                  key={
                    selectedPv.PVNr.toString() +
                    selectedProduct.ProduktbezeichnungNr.toString() +
                    tp.GebietsparameterNr.toString()
                  }
                  onClick={() => setSelectedGebiet(tp)}
                >
                  {tp.GebietsparameterText}
                </Button>
              ))}
            </div>
          </>
        )}
        {selectedPv && selectedProduct && selectedGebiet && (
          <>
            <span className="fs-3">
              <b>Gebiet: </b>
              {selectedGebiet.GebietsparameterText}
            </span>
            <Button
              type="button"
              className="close m-1"
              variant="light"
              size="sm"
              aria-label="Close"
              onClick={() => setSelectedGebiet(undefined)}
            >
              <FontAwesomeIcon size="sm" icon={faPen} />
            </Button>
          </>
        )}

        {selectedPv &&
          selectedProduct &&
          selectedGebiet &&
          !selectedZonen &&
          selectedGebiet.Zonenwahl !== 0 && (
            <>
              <div className="d-grid gap-2 mx-auto">
                {zonenwahl[selectedGebiet.Zonenwahl - 1].map((zonen, index) => {
                  return (
                    <Button
                      key={
                        selectedPv.PVNr.toString() +
                        selectedProduct.ProduktbezeichnungNr.toString() +
                        selectedGebiet.GebietsparameterNr.toString() +
                        index.toString()
                      }
                      onClick={() => setSelectedZonen(zonen)}
                    >
                      {zonen.map((zone) => {
                        return zone.name;
                      })}
                    </Button>
                  );
                })}
              </div>
            </>
          )}

        {selectedPv && selectedProduct && selectedGebiet && selectedZonen && (
          <>
            <span className="fs-3">
              <b>Zonen: </b>
              {selectedZonen.map((zone) => (
                <span className="p-1" key={"zone-" + zone.nr}>
                  {zone.name}
                </span>
              ))}
            </span>
            <Button
              type="button"
              className="close m-1"
              variant="light"
              size="sm"
              aria-label="Close"
              onClick={() => setSelectedZonen(undefined)}
            >
              <FontAwesomeIcon size="sm" icon={faPen} />
            </Button>
          </>
        )}
      </div>
    </>
  );
}
