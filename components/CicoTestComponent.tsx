import { ITrip } from "dvbjs";
import { useState } from "react";
import RoutingComponent from "./RoutingComponent";
import TarifrechnerComponent from "./TarifrechnerComponent";
import TarifrechnerCiCoComponent from "./TarifrechnerCICOComponent";

export default function CicoTestComponent() {

    const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);

    const handleChangedTrip = (trip: ITrip | null) => {
        setSelectedTrip(trip);
    };
    return (
        <div className="container">
            <h1>Check-In/Check-Out-Tests</h1>
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
                    <TarifrechnerCiCoComponent selectedTrip={selectedTrip} />
                </>
            )}
        </div >
    );
}