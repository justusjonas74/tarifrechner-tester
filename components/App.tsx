import React, { useState } from "react";
import { ITrip } from "dvbjs";


import "./App.css";
import RoutingComponent from "./RoutingComponent";
import TarifrechnerComponent from "./TarifrechnerComponent";


export default function App() {
  const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);

  const handleChangedTrip = (trip: ITrip | null) => {
    setSelectedTrip(trip);
  };

  return (
    <div className="container">
      <h1 className="my-4">
        Testfallgenerator
        <small className="text-muted"> für VVO-Tarifrechner</small>{" "}
      </h1>
      <h2 className="my-4">
        {selectedTrip ? "Ausgewählte Verbindung" : "Verbindungsauswahl"}
      </h2>
      <RoutingComponent
        handleChangedTrip={handleChangedTrip}
        selectedTrip={selectedTrip}
      />
      {selectedTrip && (
        <>
          <h2 className="my-4">Tarifrechner-Antworten</h2>
          <TarifrechnerComponent selectedTrip={selectedTrip} />
        </>
      )}

      {/* {isTripSelected && 
      <Reisende/>}
      {isTripSelected &&
      <Tarifangebot handleProductsChange={this.handleProductsChange}/>}
      {isTripSelected &&
      <UseTestCaseComponent handleExportToFile={this.handleExportToFile} />} */}

    </div>
  );
}
