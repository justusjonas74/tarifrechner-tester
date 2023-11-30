import { TariffOverview, getTariffOverviewFromEfaAntwort, parseTarifrechnerTicket } from "@/lib/parseTarifrechnerTicket";
import tarifrechnerAnfrage from "@/lib/tarifrechnerAnfrage";
import { ITrip } from "dvbjs";
import { IEFA_ANTWORTLISTE } from "pkm-tarifrechner/build/src/tarifrechner/interfaces";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface TarifAbAnzeigeProps {
    trip: ITrip
}

export default function TarifAbAnzeige(props: TarifAbAnzeigeProps) {

    const [efaAntwort, setEfaAntwort] = useState<TariffOverview | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    
    const {trip} = props


    useEffect(() => {
        const sendRequest = async () => {
            const efaAnfrage = tarifrechnerAnfrage(trip)
            console.log("Fired sendRequest")
            try {
                setIsLoading(true)
                const response = await efaAnfrage.sendRequest()
                if (response) { setEfaAntwort(getTariffOverviewFromEfaAntwort(response)) }
                setIsLoading(false)
            } catch (error) {
                let message
                if (error instanceof Error) message = error.message
                else message = String(error)
                toast.error(message)
            }
        }
        sendRequest()

    }, [trip])



    return (
        <>
            {isLoading && <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>}
            {(!isLoading && efaAntwort) &&
                <>
                    <span>
                        ab {efaAntwort.abPreis}
                    </span><br />
                    <span>
                        {efaAntwort.preisstufeText}
                    </span>
                </>
            }
            {(!isLoading && !efaAntwort) &&
                <span>Keine Preisauskunft</span>
            }
        </>


    )
}