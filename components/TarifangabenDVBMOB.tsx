import { TicketDetailsDvb } from "./TicketDetailsDvb";
import { toast } from "react-toastify";
import { useState } from "react";
import KaufangeboteModal from "./KaufangeboteModal";
import { IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/dvb-mobi/interfaces";
import { IEINGABEDATEN } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";

interface TarifangabenProps {
  tarifrechnerResponse: IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG;
}

export default function TarifangabenDVBMOB(props: TarifangabenProps) {
  const [selectedEingabedaten, setSelectetEingabedaten] = useState<
    IEINGABEDATEN | undefined
  >(undefined);
  const ticketdatenliste =
    props.tarifrechnerResponse.antwortliste[0].ticketdatenliste;

  const resetEingabedaten = () => {
    setSelectetEingabedaten(undefined);
  };
  const fetchKaufangeboteNachEingabedaten = (
    e: React.MouseEvent<HTMLAnchorElement>,
    eingabedaten?: IEINGABEDATEN,
  ) => {
    if (!eingabedaten) {
      toast.error("Das Ticket hat keine Eingabedaten");
      return;
    }

    setSelectetEingabedaten(eingabedaten);
  };

  return (
    <>
      {/* <ul className="list-group  list-group-flush"> */}
      <div className="list-group list-group-flush">
        {ticketdatenliste &&
          ticketdatenliste.map((ticket, index) => {
            return (
              // <li
              //   className="list-group-item d-flex justify-content-between align-items-start"
              //   key={index.toString()}
              // >
              <a
                href="#"
                key={index.toString()}
                onClick={
                  (e) =>
                    fetchKaufangeboteNachEingabedaten(e, ticket.eingabedaten)
                  // TODO: Arbeit vor Elternzeit im Juni 2024 begonnen aber nicht abgeschlossen. Es öffnet sich ein Modal, dass aber noch nicht funktioniert. Hat aber aktuell keine Prio.
                }
                className="list-group-item d-flex  justify-content-between align-items-start list-group-item-action"
              >
                <TicketDetailsDvb ticket={ticket} />
              </a>
            );
            // </li>
          })}

        {(!ticketdatenliste || ticketdatenliste.length == 0) && (
          // <li className="list-group-item d-flex justify-content-between align-items-start">
          <a
            className="list-group-item d-flex justify-content-between align-items-start list-group-item-action disabled"
            aria-disabled="true"
          >
            Die Anwort des Tarifrechners enthält keine Tarifangaben
          </a>
        )}
      </div>
      <KaufangeboteModal
        eingabedaten={selectedEingabedaten}
        handleCloseFn={resetEingabedaten}
      />
    </>
  );
}
