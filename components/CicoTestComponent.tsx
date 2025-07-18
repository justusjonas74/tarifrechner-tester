import { ITrip } from "dvbjs";
import { useState } from "react";
import RoutingComponent from "./RoutingComponent";
import TarifrechnerComponent from "./TarifrechnerComponent";
import TarifrechnerCiCoComponent from "./TarifrechnerCICOComponent";
import { IFAIRTIQ_REISENDER, } from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import ReisendenComponent from "./ReisendenComponent";

export default function CicoTestComponent() {

    const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);

    const defaultReisender: IFAIRTIQ_REISENDER = {
        typ: {
            nr: "1",
            name: "Erwachsener"
        },
        erweiterungsliste: [
            { nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "T" },
        ],
    }

    const [reisendenliste, setReisendenliste] = useState<IFAIRTIQ_REISENDER[]>([defaultReisender]);

    const handleChangedReisendenliste = (reisendenliste: IFAIRTIQ_REISENDER[]) => {
        setReisendenliste(reisendenliste);
    }


    const handleChangedTrip = (trip: ITrip | null) => {
        setSelectedTrip(trip);
    };
    return (
        <div className="container">
            <h1>Check-In/Check-Out-Tests</h1>

            <h2 className="my-4">
                {reisendenliste.length > 0 ? "Ausgewählte Reisende" : "Reisende auswählen"}
            </h2>
            <ReisendenComponent
                reisendenliste={reisendenliste}
                handleChangedReisendenliste={handleChangedReisendenliste}
            />
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
                    <TarifrechnerCiCoComponent selectedTrip={selectedTrip} reisendenliste={reisendenliste} />
                </>
            )}
        </div >
    );
}