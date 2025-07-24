import { ITrip } from "dvbjs";
import { useState } from "react";
import RoutingComponent from "./RoutingComponent";
import TarifrechnerCiCoComponent from "./TarifrechnerCICOComponent";
import {
  IFAIRTIQ_ANFRAGE_ANTWORT,
  IFAIRTIQ_ANFRAGELISTE,
  IFAIRTIQ_ANTWORTLISTE,
  IFAIRTIQ_REISENDER,
  IFAIRTIQ_VERBINDUNG,
} from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import ReisendenComponent from "./ReisendenComponent";
import PreviousRequestComponent from "./PreviousRequestComponent";
import { toast } from "react-toastify";

export default function CicoTestComponent() {
  const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);
  const [previousCiCoRequests, setPreviousCiCoRequests] = useState<
    IFAIRTIQ_ANFRAGE_ANTWORT[]
  >([]);

  const defaultReisender: IFAIRTIQ_REISENDER = {
    typ: {
      nr: "1",
      name: "Erwachsener",
    },
    erweiterungsliste: [{ nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "T" }],
  };

  const [reisendenliste, setReisendenliste] = useState<IFAIRTIQ_REISENDER[]>([
    defaultReisender,
  ]);

  const handleChangedReisendenliste = (
    reisendenliste: IFAIRTIQ_REISENDER[],
  ) => {
    setReisendenliste(reisendenliste);
  };

  const handleChangedTrip = (trip: ITrip | null) => {
    setSelectedTrip(trip);
  };

  const handleAddCiCoRequests = (request: IFAIRTIQ_ANFRAGE_ANTWORT) => {
    // Check if the request already exists
    const exists = previousCiCoRequests.some(
      (prevRequest) =>
        JSON.stringify(prevRequest.anfrage) ===
          JSON.stringify(request.anfrage) &&
        JSON.stringify(prevRequest.antwort) === JSON.stringify(request.antwort),
    );
    if (exists) {
      toast.warn("Request already exists, not adding again.");
      return;
    }
    // Add the new request to the list
    setPreviousCiCoRequests((prevRequests) => [...prevRequests, request]);
    toast.success("FAIRTIQ-Antwort gespeichert.");
  };

  return (
    <div className="container">
      <h1>Check-In/Check-Out-Tests</h1>

      <div className="row">
        <ReisendenComponent
          reisendenliste={reisendenliste}
          handleChangedReisendenliste={handleChangedReisendenliste}
        />
        <PreviousRequestComponent
          previousRequests={previousCiCoRequests}
          handleResetPreviousCiCoRequests={() => setPreviousCiCoRequests([])}
        />
      </div>
      <h2 className="my-4">
        {selectedTrip ? "Ausgewählte Verbindung" : "Verbindungsauswahl"}
      </h2>
      <RoutingComponent
        handleChangedTrip={handleChangedTrip}
        selectedTrip={selectedTrip}
      />

      {selectedTrip && reisendenliste.length > 0 && (
        <>
          <h2 className="my-4">Tarifrechner-Antworten</h2>
          <TarifrechnerCiCoComponent
            previousCiCoRequests={previousCiCoRequests}
            selectedTrip={selectedTrip}
            reisendenliste={reisendenliste}
            handleSaveCiCoRequest={handleAddCiCoRequests}
          />
        </>
      )}
    </div>
  );
}
