import { IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG } from "pkm-tarifrechner/build/src/tarifrechner/interfaces";

import { TicketDetailsDvb } from "./TicketDetailsDvb";

interface TarifangabenProps {
  tarifrechnerResponse: IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG;
}

export default function TarifangabenDVBMOB(props: TarifangabenProps) {
  const ticketdatenliste =
    props.tarifrechnerResponse.antwortliste[0].ticketdatenliste;

  return (
    <>
      <ul className="list-group  list-group-flush">
        {ticketdatenliste &&
          ticketdatenliste.map((ticket, index) => {
            return (
              <li
                className="list-group-item d-flex justify-content-between align-items-start"
                key={index.toString()}
              >
                <TicketDetailsDvb ticket={ticket} />
              </li>
            );
          })}

        {(!ticketdatenliste || ticketdatenliste.length == 0) && (
          <li className="list-group-item d-flex justify-content-between align-items-start">
            Die Anwort des Tarifrechners enthält keine Tarifangaben
          </li>
        )}
      </ul>
    </>
  );
}
