import { parseTarifrechnerTicketEfa } from "@/lib/parseTarifrechnerTicket";
import { IEFA_TICKETDATEN } from "pkm-tarifrechner/build/src/tarifrechner/interfaces";

export interface TicketDetailsProps {
  ticket: IEFA_TICKETDATEN;
}

export function TicketDetailsEfa(props: TicketDetailsProps) {
  const ticket = parseTarifrechnerTicketEfa(props.ticket);

  return (
    <>
      <div className="ms-2 me-auto">
        <span className="fw-bold p-2">{ticket.anzeigetext}</span>
        <span className="fw-normal text-body-secondary p-2">
          {ticket.preisstufeText || "Keine Preisstufenangabe"}
        </span>
        <br />
        <span className="fw-light fst-italic text-body-secondary p-2">
          <small>{ticket.gueltigkeitsraumText || "Keine Raumangabe"}</small>
        </span>
      </div>
      <span className="badge bg-primary rounded-pill">
        {ticket.betraginEuro || "Keine Preisangabe"}
      </span>
    </>
  );
}
