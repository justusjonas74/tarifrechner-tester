import type { Trip } from "dvbjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getTariffOverviewFromEfaAntwort,
  type TariffOverview,
} from "@/lib/parseTarifrechnerTicket";
import { tarifrechnerEfaAnfrage } from "@/lib/tarifrechnerAnfrage";

interface TarifAbAnzeigeProps {
  trip: Trip;
}

export default function TarifAbAnzeige(props: TarifAbAnzeigeProps) {
  const [efaAntwort, setEfaAntwort] = useState<TariffOverview | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { trip } = props;

  useEffect(() => {
    const sendRequest = async () => {
      const efaAnfrage = tarifrechnerEfaAnfrage(trip);
      try {
        setIsLoading(true);
        const response = await efaAnfrage.sendRequest();
        if (response) {
          setEfaAntwort(getTariffOverviewFromEfaAntwort(response));
        }
        setIsLoading(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
      }
    };
    sendRequest();
  }, [trip]);

  return (
    <>
      {isLoading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!isLoading && efaAntwort && (
        <>
          <span>ab {efaAntwort.abPreis}</span>
          <br />
          <span>{efaAntwort.preisstufeText}</span>
        </>
      )}
      {!isLoading && !efaAntwort && <span>Keine Preisauskunft</span>}
    </>
  );
}
