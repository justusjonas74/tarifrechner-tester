import Badge from "react-bootstrap/Badge";
import { parseTarifrechnerTicketFairtiq } from "@/lib/parseTarifrechnerTicket";
import { TicketDetailsEfa } from "./TicketDetailsEfa";
import {
  IFAIRTIQ_ANTWORTLISTE,
  IFAIRTIQ_TICKETDATEN,
} from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import { Button } from "react-bootstrap";

function ListItem(props: { id: string; children: React.ReactNode }) {
  const { id } = props;
  return (
    <li
      className="list-group-item d-flex justify-content-between align-items-start"
      key={id}
    >
      {props.children}
    </li>
  );
}

interface TarifangabenProps {
  tarifrechnerResponse: IFAIRTIQ_ANTWORTLISTE;
  handleSaveCiCoRequest: () => void;
  // reisendenliste: IFAIRTIQ_REISENDER[];
}

export default function CicoTarifangaben(props: TarifangabenProps) {
  const { ticketdatenliste, angebotsdatenliste } =
    props.tarifrechnerResponse.antwortliste?.[0];

  if (!ticketdatenliste || ticketdatenliste.length === 0) {
    return (
      <ListItem id="li-no-cico-tickets">
        Die Anwort des Tarifrechners enthält keine Ticketdaten.
      </ListItem>
    );
  }

  if (!angebotsdatenliste || angebotsdatenliste.length === 0) {
    return (
      <ListItem id="li-no-cico-offers">
        Die Anwort des Tarifrechners enthält keine Angebotsdaten.
      </ListItem>
    );
  }

  return (
    <>
      <ul className="list-group  list-group-flush">
        {angebotsdatenliste.map((angebot, angebot_index) => {
          const { ticketdatenbezug } = angebot;
          if (!ticketdatenbezug || ticketdatenbezug.length === 0) {
            return (
              <ListItem
                key={"ListItem-" + angebot_index + "-without-tickets"}
                id={"li-" + angebot_index + "-without-tickets"}
              >
                Keine Ticketdaten für dieses Angebot verfügbar.
              </ListItem>
            );
          }
          return ticketdatenbezug.map(
            (ticketReference, ticketdatenbezug_index) => {
              const ticketdaten = ticketdatenliste[ticketReference - 1];
              if (!ticketdaten) {
                return (
                  <ListItem
                    key={"ListItem-" + angebot_index + "-ticket-not-found"}
                    id={
                      "a" +
                      angebot_index.toString() +
                      "-t" +
                      ticketdatenbezug_index.toString()
                    }
                  >
                    Ticketdaten nicht gefunden.
                  </ListItem>
                );
              }
              return (
                <ListItem
                  key={
                    "listitem-a" + angebot_index + "-t" + ticketdatenbezug_index
                  }
                  id={"a" + angebot_index + "-t" + ticketdatenbezug_index}
                >
                  <TicketDetailsCicoTicket ticket={ticketdaten} />
                </ListItem>
              );
            },
          );
        })}
        <ListItem key="save-trip-and-ticket" id="save-trip-and-ticket">
          <Button
            variant="primary"
            onClick={props.handleSaveCiCoRequest}
            className="d-flex align-items-center"
          >
            <span className="fa fa-save me-2"></span>
            Fahrt und Ticket speichern
          </Button>
        </ListItem>
      </ul>
    </>
  );
}

export function TicketDetailsCicoTicket(props: {
  ticket: IFAIRTIQ_TICKETDATEN;
}) {
  const ticket = parseTarifrechnerTicketFairtiq(props.ticket);
  return (
    <>
      <div className="ms-2 me-auto">
        <span className="p-2 fw-bold">{ticket.anzeigetext}</span>
        <br />

        <span className="fw-normal small text-body-secondary p-2">
          Preisberücksichtigungsfrist:{" "}
          {ticket.preisberuecksichtigungsfrist || "n/a"}
        </span>
        <br />
        <span className="fw-normal small text-body-secondary p-2">
          Ticketdatenersetzungsfrist:{" "}
          {ticket.ticketdatenersetzungsfrist || "n/a"}
        </span>
        <br />
        <span className="fw-normal small  p-2">
          Für Reisenden:{" "}
          {ticket.reisendenbezug.map((r, i) => (
            <Badge key={"reisenden-badge-" + i} pill bg="primary">
              {r}.
            </Badge>
          ))}
        </span>
        {/* <br /> */}
        {/* <span className="fw-light fst-italic text-body-secondary p-2">
          <small>{ticket.gueltigkeitsraumText || "Keine Raumangabe"}</small>
        </span> */}
      </div>
      <span className="badge bg-success rounded">
        {ticket.betraginEuro || "Keine Preisangabe"}
      </span>
    </>
  );
}
