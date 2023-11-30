import { IEFA_ANTWORTLISTE, } from "pkm-tarifrechner/build/src/tarifrechner/interfaces";

import { TicketDetails } from "./TicketDetails";

interface TarifangabenProps {
    tarifrechnerResponse: IEFA_ANTWORTLISTE
}

export default function Tarifangaben(props: TarifangabenProps) {
    const ticketdatenliste = props.tarifrechnerResponse.antwortliste[0].ticketdatenliste


    return (
        <>
            <ul className="list-group list-group">
                {ticketdatenliste && ticketdatenliste.map((ticket, index) => {
                    return <li className="list-group-item d-flex justify-content-between align-items-start" key={index.toString()} ><TicketDetails ticket={ticket}  /></li>
                })}

                {(!ticketdatenliste || ticketdatenliste.length == 0) &&
                    <li>Die Anwort des Tarifrechners enthält keine Tarifangaben</li>}
            </ul>


        </>
    )

}