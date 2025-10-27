import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { parseTarifrechnerTicketFairtiq } from "@/lib/parseTarifrechnerTicket";
import {
  IFAIRTIQ_ANTWORTLISTE,
  IFAIRTIQ_TICKETDATEN,
} from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import { Button } from "react-bootstrap";
import { IPRUEFERGEBNIS } from "pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";

function ListItem(props: { id: string; children: React.ReactNode }) {
  const { id } = props;
  return (
    <li
      className="list-group-item d-flex w-100 justify-content-between align-items-start"
      key={id}
    >
      {props.children}
    </li>
  );
}
function formatPruefergebnis(pruefergebnis: IPRUEFERGEBNIS) {
  const element = (string: string, entwicklerinfo?: string) => {
    return <div className="justify-content-between"><FontAwesomeIcon icon={faTriangleExclamation} />{" " + string} {entwicklerinfo && <><br /><span className="text-body-secondary small" >{entwicklerinfo}</span></>}</div>;
  }

  switch (pruefergebnis.nr) {
    case "ANFRAGE_UNGUELTIG":
      return element("Die Anfrage ist ungültig.", pruefergebnis.entwicklerinfo);
    case "KEIN_ANGEBOT_VERFUEGBAR":
      return element("Für die Anfrage kann insbesondere aus tariflichen Gründen kein Angebot berechnet werden.", pruefergebnis.entwicklerinfo);
    case "HISTORIE_UNGUELTIG":
      return element("Für eine vergangene Fahrt können keine Angebote berechnet werden.", pruefergebnis.entwicklerinfo);
    case "UNERWARTETER_ABBRUCH":
      return element("Die Tarifberechnung wurde unerwartet abgebrochen.", pruefergebnis.entwicklerinfo);
    case "HALT_UNGUELTIG":
      return element("Ein Halt in der Anfrage ist ungültig.", pruefergebnis.entwicklerinfo);
    case "LINIENDATEN_UNGUELTIG":
      return element("Die Liniendaten für die Anfrage sind ungültig.", pruefergebnis.entwicklerinfo);
    case "VERKEHRSMITTEL_UNGUELTIG":
      return element("Ein Verkehrsmittel in der Anfrage ist ungültig.", pruefergebnis.entwicklerinfo);
    case "BERECHTIGUNG_ANWENDBAR":
      return element("Eine hinterlegte Berechtigung ist anwendbar.", pruefergebnis.entwicklerinfo);
    case "KEIN_ANGEBOT_NOTWENDIG":
      return element("Für diese Fahrt oder Teile dieser ist kein Angebot notwendig, z.B. weil eine vorhandene Berechtigung hierfür noch gültig ist, eine Freifahrt für den Hauptreisenden oder einen Mitreisenden gestattet ist", pruefergebnis.entwicklerinfo);
    default:
      return element("Unbekanntes Prüfergebnis: " + pruefergebnis.nr, pruefergebnis.entwicklerinfo);
  }
}

interface TarifangabenProps {
  tarifrechnerResponse: IFAIRTIQ_ANTWORTLISTE;
  handleSaveCiCoRequest: () => void;
  // reisendenliste: IFAIRTIQ_REISENDER[];
}

export default function CicoTarifangaben(props: TarifangabenProps) {
  const { ticketdatenliste, angebotsdatenliste, pruefergebnisliste } =
    props.tarifrechnerResponse.antwortliste?.[0];

  const output = []
  if (pruefergebnisliste && pruefergebnisliste.length > 0) {
    pruefergebnisliste.forEach((pruefergebnis, index) => {
      output.push((
        <ListItem key={"li-cico-pruefergebnisse-" + index} id={"li-cico-pruefergebnisse-" + index}>
          {formatPruefergebnis(pruefergebnis)}
        </ListItem >
      ))
    })
  }

  if (!ticketdatenliste || ticketdatenliste.length === 0) {
    output.push((
      <ListItem key="li-no-cico-tickets" id="li-no-cico-tickets">
        Die Anwort des Tarifrechners enthält keine Ticketdaten.
      </ListItem>
    ));
  }

  if (!angebotsdatenliste || angebotsdatenliste.length === 0) {
    output.push((
      <ListItem key="li-no-cico-offers" id="li-no-cico-offers">
        Die Anwort des Tarifrechners enthält keine Angebotsdaten.
      </ListItem>
    ));
  }

  if (angebotsdatenliste && angebotsdatenliste.length > 0 && ticketdatenliste && ticketdatenliste.length > 0) {
    output.push(<>
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
                <TicketDetailsCicoTicket key={"TicketDetailsCicoTicket-a" + angebot_index + "-t" + ticketdatenbezug_index} ticket={ticketdaten} />
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
    </>)
  }
  return <ul className="list-group  list-group-flush">{output}</ul>

}

export function TicketDetailsCicoTicket(props: {
  ticket: IFAIRTIQ_TICKETDATEN;
}) {
  const ticket = parseTarifrechnerTicketFairtiq(props.ticket);
  return (
    <>
      <div className="">
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
