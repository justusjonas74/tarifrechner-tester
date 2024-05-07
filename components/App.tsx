import React, { useState } from "react";
import { ITrip } from "dvbjs";


import "./App.css";
import RoutingComponent from "./RoutingComponent";
import TarifrechnerComponent from "./TarifrechnerComponent";

// const UseTestCaseComponent = ({handleExportToFile}: UseTestCaseComponentProps) => (
//   <div className="row">
//     <div className="card col-sm-12 shadow-sm mb-2 rounded">
//       <div className="card-body">
//         <h2 className="card-title">Verwende Testfall</h2>
//         <div className="row">
//          <div className="col-sm-6 text-center">
//               <button className="btn btn-lg btn-primary m-4" onClick={handleExportToFile}>
//                   <FontAwesomeIcon icon={faFileDownload} size="lg"/><br/>
//                   Exportiere Testfall<br/>
//                   <small>IVI-Format (*.xlsx)</small>
//               </button>
//           </div>
//           <div className="col-sm-6 text-center">
//             <button className="btn btn-lg btn-info m-4" disabled>
//               <FontAwesomeIcon icon={faPaperPlane} size="lg"/> <br/>
//               Frage Tarifrechner an<br/>
//               <small>(JSON-Request)</small>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )

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
