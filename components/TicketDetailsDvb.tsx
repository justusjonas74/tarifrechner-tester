import { ShoppingCartIcon } from "@phosphor-icons/react/dist/csr/ShoppingCart"

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
        <span className="p-2">
          <ShoppingCartIcon size="16" />

          {" " + ticket.anzeigetext}</span>

      </div>
      <span className="badge bg-secondary rounded">
        {ticket.betraginEuro || "Keine Preisangabe"}
      </span>
    </>
  );
}
