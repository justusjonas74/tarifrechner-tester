

import { parseTarifrechnerTicketFairtiq } from "@/lib/parseTarifrechnerTicket";
import { TicketDetailsEfa } from "./TicketDetailsEfa";
import { IFAIRTIQ_ANTWORTLISTE, IFAIRTIQ_TICKETDATEN } from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";

function ListItem(props: {
    key?: string,
    children: React.ReactNode
}) {
    const { key } = props;
    return (
        <li className="list-group-item d-flex justify-content-between align-items-start" key={key}>
            {props.children}
        </li>
    );
}

interface TarifangabenProps {
    tarifrechnerResponse: IFAIRTIQ_ANTWORTLISTE;
}

export default function CicoTarifangaben(props: TarifangabenProps) {
    const { ticketdatenliste, angebotsdatenliste } =
        props.tarifrechnerResponse.antwortliste?.[0];

    if (!ticketdatenliste || ticketdatenliste.length === 0) {
        return <ListItem>Die Anwort des Tarifrechners enthält keine Ticketdaten.</ListItem>
    }

    if (!angebotsdatenliste || angebotsdatenliste.length === 0) {
        return <ListItem>Die Anwort des Tarifrechners enthält keine Angebotsdaten.</ListItem>
    }

    return (
        <>
            <ul className="list-group  list-group-flush">
                {angebotsdatenliste.map((angebot, angebot_index) => {
                    const { ticketdatenbezug } = angebot
                    if (!ticketdatenbezug || ticketdatenbezug.length === 0) {
                        return <ListItem key={"a" + angebot_index.toString()}>Keine Ticketdaten für dieses Angebot verfügbar.</ListItem>
                    }
                    return ticketdatenbezug.map((ticketReference, ticketdatenbezug_index) => {
                        const ticketdaten = ticketdatenliste[ticketReference - 1]
                        if (!ticketdaten) {
                            return < ListItem key={"a" + angebot_index.toString() + "-t" + ticketdatenbezug_index.toString()}>Ticketdaten nicht gefunden.</ListItem>
                        }
                        return (<ListItem key={"a" + angebot_index.toString() + "-t" + ticketdatenbezug_index.toString()}>
                            <TicketDetailsCicoTicket ticket={ticketdaten} />
                        </ListItem>)

                    });
                })}
            </ul>
        </>
    );
}


export function TicketDetailsCicoTicket(props: { ticket: IFAIRTIQ_TICKETDATEN }) {

    const ticket = parseTarifrechnerTicketFairtiq(props.ticket);
    console.log("TicketDetailsCicoTicket", ticket);
    return (
        <>
            <div className="ms-2 me-auto">
                <span className="p-2 fw-bold">{ticket.anzeigetext}</span><br />

                <span className="fw-normal small text-body-secondary p-2">
                    Preisberücksichtigungsfrist: {ticket.preisberuecksichtigungsfrist || "n/a"}
                </span><br />
                <span className="fw-normal small text-body-secondary p-2">
                    Ticketdatenersetzungsfrist: {ticket.ticketdatenersetzungsfrist || "n/a"}
                </span>
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
