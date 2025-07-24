import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { parseTarifrechnerTicketDvb } from "@/lib/parseTarifrechnerTicket";
import { ITICKETDATEN } from "pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";

export interface TicketDetailsProps {
  ticket: ITICKETDATEN;
}

export function TicketDetailsDvb(props: TicketDetailsProps) {
  const ticket = parseTarifrechnerTicketDvb(props.ticket);

  return (
    <>
      <div className="ms-2 me-auto">
        <FontAwesomeIcon icon={faCartShopping} />
        <span className="p-2">{ticket.anzeigetext}</span>

        {/* <span className="fw-normal text-body-secondary p-2">
          {ticket.preisstufeText || "Keine Preisstufenangabe"}
        </span> */}
        {/* <br /> */}
        {/* <span className="fw-light fst-italic text-body-secondary p-2">
          <small>{ticket.gueltigkeitsraumText || "Keine Raumangabe"}</small>
        </span> */}
      </div>
      <span className="badge bg-secondary rounded">
        {ticket.betraginEuro || "Keine Preisangabe"}
      </span>
    </>
  );
}
