import { parseTarifrechnerTicketEfa } from "@/lib/parseTarifrechnerTicket";
import { IEFA_TICKETDATEN } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/efa/interfaces";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export interface TicketDetailsProps {
  ticket: IEFA_TICKETDATEN;
}

export function TicketDetailsEfa(props: TicketDetailsProps) {
  const ticket = parseTarifrechnerTicketEfa(props.ticket);
  const renderTooltip = (
    <Tooltip>
    <small>
      <ul className="text-start ps-3 mb-0">
        {ticket.gueltigkeitsraumText && <li><b>Gültigkeitsraum:</b> {ticket.gueltigkeitsraumText}</li>}
        {ticket.produktnummer && <li><b>Produktnummer:</b> {ticket.produktnummer}</li>}
        {ticket.netzkennung && <li><b>Netzkennung:</b> {ticket.netzkennung}</li>}
      </ul>
      </small>
    </Tooltip>
  );
  return (
    <>
      <div className="ms-2 me-auto">
        <span className="fw-bold p-2">{ticket.anzeigetext}</span>
        <span className="fw-normal text-body-secondary p-2">
          {ticket.preisstufeText || "Keine Preisstufenangabe"}
        </span>
        <br />
        <span className="fw-light fst-italic text-body-secondary p-2">
          <small>{ticket.raumText || "Keine Raumangabe"}</small>
        </span>
      </div>
      <OverlayTrigger overlay={renderTooltip} placement="right">
        <span className="badge bg-primary rounded-pill">
          {ticket.betraginEuro || "Keine Preisangabe"}
        </span>
      </OverlayTrigger>
    </>
  );
}
