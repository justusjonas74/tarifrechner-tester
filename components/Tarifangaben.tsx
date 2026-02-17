import { IEFA_ANTWORTLISTE } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/efa/interfaces";
import { TicketDetailsEfa } from "./TicketDetailsEfa";

interface TarifangabenProps {
  tarifrechnerResponse: IEFA_ANTWORTLISTE;
}

export default function Tarifangaben(props: TarifangabenProps) {
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
                <TicketDetailsEfa ticket={ticket} />
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
