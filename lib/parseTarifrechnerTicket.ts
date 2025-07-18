import moment from "moment";
import { IEFA_ANTWORTLISTE, IEFA_TICKETDATEN } from "pkm-tarifrechner/build/src/tarifrechner/efa/interfaces";
import { IFAIRTIQ_TICKETDATEN } from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import { ITICKETDATEN } from "pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";

export type TarifrechnerTicket = {
  anzeigetext: string;
  betraginEuro?: string;
  preisstufeKennung?: string;
  preisstufeText?: string;
  gueltigkeitsraumText?: string;
  dvbAnzeigetexte?: { befahreneZonen?: string };
};

export type TariffOverview = {
  abPreis: string;
  preisstufeText: string;
};

export const getTariffOverviewFromEfaAntwort = (
  efa_antwort: IEFA_ANTWORTLISTE
): TariffOverview | undefined => {
  if (
    !efa_antwort ||
    !efa_antwort.antwortliste ||
    efa_antwort.antwortliste.length == 0
  ) {
    return undefined;
  }

  const antwort = efa_antwort.antwortliste[0];

  if (
    !antwort ||
    !antwort.ticketdatenliste ||
    antwort.ticketdatenliste.length == 0
  ) {
    return undefined;
  }

  if (
    !antwort ||
    !antwort.ticketdatenliste ||
    antwort.ticketdatenliste.length == 0
  ) {
    return undefined;
  }

  const ticketRaw = antwort.ticketdatenliste.find(
    (t) => t.anzeigetext == "VVO Einzelfahrt"
  );
  if (!ticketRaw) return undefined;
  const ticket = parseTarifrechnerTicketEfa(ticketRaw);

  if (
    ticket.anzeigetext !== "VVO Einzelfahrt" ||
    !ticket.betraginEuro ||
    !ticket.preisstufeText
  ) {
    return undefined;
  }

  return {
    abPreis: ticket.betraginEuro,
    preisstufeText: ticket.preisstufeText,
  };
};

export const parseTarifrechnerTicketEfa = (
  ticket: IEFA_TICKETDATEN
): TarifrechnerTicket => {
  let trTicket: TarifrechnerTicket = {
    anzeigetext: ticket.anzeigetext,
  };

  if (
    ticket.bezahldatenliste &&
    ticket.bezahldatenliste.length > 0 &&
    ticket.bezahldatenliste[0].betrag
  ) {
    const bezahldaten = ticket.bezahldatenliste[0];
    trTicket.betraginEuro = centToEuroString(bezahldaten.betrag);
  }
  if (ticket.erweiterungsliste) {
    const { erweiterungsliste } = ticket;
    const erweiterungenNummern = [
      "FPAVVO_PREISSTUFE_KENNUNG",
      "FPAVVO_PREISSTUFE_TEXT",
      "FPAVVO_RAUM_TEXT",
    ];
    const [preisstufeKennung, preisstufeText, gueltigkeitsraumText] =
      erweiterungenNummern.map((erweiterungNr) => {
        const erweiterung = erweiterungsliste.find(
          (e) => e.nr == erweiterungNr
        );
        if (erweiterung && erweiterung.wert) {
          return erweiterung.wert.slice(1);
        } else {
          return undefined;
        }
      });
    trTicket.preisstufeKennung = preisstufeKennung;
    trTicket.preisstufeText = preisstufeText;
    trTicket.gueltigkeitsraumText = gueltigkeitsraumText;
  }
  return trTicket;
};

export const parseTarifrechnerTicketDvb = (
  ticket: ITICKETDATEN
): TarifrechnerTicket => {
  let trTicket: TarifrechnerTicket = {
    anzeigetext: ticket.anzeigetext,
  };

  if (
    ticket.bezahldatenliste &&
    ticket.bezahldatenliste.length > 0 &&
    ticket.bezahldatenliste[0].betrag
  ) {
    const bezahldaten = ticket.bezahldatenliste[0];
    trTicket.betraginEuro = centToEuroString(bezahldaten.betrag);
  }
  //   if (ticket.erweiterungsliste) {
  //     const { erweiterungsliste } = ticket;
  //     const erweiterungenNummern = ["DVBMOB_ANZEIGETEXTE"];
  //     const [dvbAnzeigetexte] = erweiterungenNummern.map((erweiterungNr) => {
  //       const erweiterung = erweiterungsliste.find((e) => e.nr == erweiterungNr);
  //       if (erweiterung && erweiterung.wert) {
  //         return erweiterung.wert.slice(1);
  //       } else {
  //         return undefined;
  //       }
  //     });
  //     trTicket.dvbAnzeigetexte = dvbAnzeigetexte;
  //   }
  return trTicket;
};

type FairtiqTarifrechnerTicket = TarifrechnerTicket & {
  preisberuecksichtigungsfrist?: string;
  ticketdatenersetzungsfrist?: string
  reisendenbezug: number[];
}
export const parseTarifrechnerTicketFairtiq = (
  ticket: IFAIRTIQ_TICKETDATEN
): FairtiqTarifrechnerTicket => {
  let trTicket: FairtiqTarifrechnerTicket = {
    anzeigetext: ticket.anzeigetext,
    reisendenbezug: []
  };

  if (
    ticket.bezahldatenliste &&
    ticket.bezahldatenliste.length > 0 &&
    ticket.bezahldatenliste[0].betrag
  ) {
    const bezahldaten = ticket.bezahldatenliste[0];
    trTicket.betraginEuro = centToEuroString(bezahldaten.betrag);
  }
  trTicket.reisendenbezug = ticket.reisendenbezug;

  const preisberuecksichtigungsfrist = ticket.erweiterungsliste?.find(
    (e) => e.nr === "PREISBERUECKSICHTIGUNGSFRIST"
  )?.wert as string | undefined;

  const ticketdatenersetzungsfrist = ticket.erweiterungsliste?.find(
    (e) => e.nr === "TICKETDATENERSETZUNGSFRIST"
  )?.wert as string | undefined;

  if (preisberuecksichtigungsfrist) {
    trTicket.preisberuecksichtigungsfrist = moment(preisberuecksichtigungsfrist.substring(1)).format("DD.MM.YYYY HH:mm:ss");
  }
  if (ticketdatenersetzungsfrist) {
    trTicket.ticketdatenersetzungsfrist = moment(ticketdatenersetzungsfrist.substring(1)).format("DD.MM.YYYY HH:mm:ss");
  }
  return trTicket;
};
function centToEuroString(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
