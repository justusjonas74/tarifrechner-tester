import type {
  IEFA_ANTWORTLISTE,
  IEFA_TICKETDATEN,
} from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/efa/interfaces";
import type { IFAIRTIQ_TICKETDATEN } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import type { ITICKETDATEN } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";
import moment from "moment";
import { describe, expect, it } from "vitest";
import {
  getTariffOverviewFromEfaAntwort,
  parseTarifrechnerTicketDvb,
  parseTarifrechnerTicketEfa,
  parseTarifrechnerTicketFairtiq,
} from "./parseTarifrechnerTicket";

describe("parseTarifrechnerTicket", () => {
  describe("parseTarifrechnerTicketEfa", () => {
    it("should parse ticket fields and convert cents to euro string", () => {
      const ticket: IEFA_TICKETDATEN = {
        anzeigetext: "VVO Einzelfahrt",
        bezahldatenliste: [{ betrag: 300 }],
        erweiterungsliste: [
          { nr: "FPAVVO_PREISSTUFE_KENNUNG", wert: "X1" },
          { nr: "FPAVVO_PREISSTUFE_TEXT", wert: "XEinzonen-Tarif" },
          { nr: "FPAVVO_RAUM_TEXT", wert: "XTZ 10 Dresden" },
          { nr: "FPAVVO_PRODUKTNUMMER", wert: "X1001" },
          { nr: "FPAVVO_GUELTIGKEITSRAUM_TEXT", wert: "XTarifzone Dresden" },
          { nr: "FPAVVO_NETZKENNUNG", wert: "XVVO" },
        ],
      };

      const result = parseTarifrechnerTicketEfa(ticket);

      expect(result.anzeigetext).toBe("VVO Einzelfahrt");
      expect(result.betraginEuro).toMatch(/3,00\s?€/);
      expect(result.preisstufeKennung).toBe("1");
      expect(result.preisstufeText).toBe("Einzonen-Tarif");
      expect(result.raumText).toBe("TZ 10 Dresden");
      expect(result.produktnummer).toBe("1001");
      expect(result.gueltigkeitsraumText).toBe("Tarifzone Dresden");
      expect(result.netzkennung).toBe("VVO");
    });

    it("should handle missing optional fields gracefully", () => {
      const ticket: IEFA_TICKETDATEN = {
        anzeigetext: "VVO Einzelfahrt",
      };

      const result = parseTarifrechnerTicketEfa(ticket);
      expect(result.anzeigetext).toBe("VVO Einzelfahrt");
      expect(result.betraginEuro).toBeUndefined();
      expect(result.preisstufeKennung).toBeUndefined();
    });
  });

  describe("getTariffOverviewFromEfaAntwort", () => {
    it("should return tariff overview when VVO Einzelfahrt ticket is present", () => {
      const efaAntwort = {
        antwortliste: [
          {
            ticketdatenliste: [
              {
                anzeigetext: "VVO Einzelfahrt",
                bezahldatenliste: [{ betrag: 320 }],
                erweiterungsliste: [
                  { nr: "FPAVVO_PREISSTUFE_TEXT", wert: "XPreisstufe 1" },
                ],
              },
            ],
          },
        ],
      } as unknown as IEFA_ANTWORTLISTE;

      const result = getTariffOverviewFromEfaAntwort(efaAntwort);
      expect(result).toBeDefined();
      expect(result?.abPreis).toMatch(/3,20\s?€/);
      expect(result?.preisstufeText).toBe("Preisstufe 1");
    });

    it("should return undefined for empty or invalid responses", () => {
      expect(
        getTariffOverviewFromEfaAntwort({} as unknown as IEFA_ANTWORTLISTE),
      ).toBeUndefined();
      expect(
        getTariffOverviewFromEfaAntwort({
          antwortliste: [],
        } as unknown as IEFA_ANTWORTLISTE),
      ).toBeUndefined();
      expect(
        getTariffOverviewFromEfaAntwort({
          antwortliste: [{ ticketdatenliste: [] }],
        } as unknown as IEFA_ANTWORTLISTE),
      ).toBeUndefined();
    });

    it("should return undefined if VVO Einzelfahrt is not found", () => {
      const efaAntwort = {
        antwortliste: [
          {
            ticketdatenliste: [
              {
                anzeigetext: "Tageskarte",
                bezahldatenliste: [{ betrag: 800 }],
              },
            ],
          },
        ],
      } as unknown as IEFA_ANTWORTLISTE;

      expect(getTariffOverviewFromEfaAntwort(efaAntwort)).toBeUndefined();
    });
  });

  describe("parseTarifrechnerTicketDvb", () => {
    it("should parse DVB ticket data", () => {
      const ticket: ITICKETDATEN = {
        anzeigetext: "Einzelfahrt Normal",
        bezahldatenliste: [{ betrag: 300 }],
      };

      const result = parseTarifrechnerTicketDvb(ticket);
      expect(result.anzeigetext).toBe("Einzelfahrt Normal");
      expect(result.betraginEuro).toMatch(/3,00\s?€/);
    });
  });

  describe("parseTarifrechnerTicketFairtiq", () => {
    it("should parse Fairtiq ticket and format dates", () => {
      const ticket = {
        anzeigetext: "Fairtiq Fahrt",
        reisendenbezug: [1],
        bezahldatenliste: [{ betrag: 250, steuer: 0 }],
        erweiterungsliste: [
          {
            nr: "INOUTVVO_PREISBERUECKSICHTIGUNGSFRIST",
            wert: "X2026-11-09T14:30:00+01:00",
          },
          {
            nr: "INOUTVVO_TICKETDATENERSETZUNGSFRIST",
            wert: "X2026-11-09T15:30:00+01:00",
          },
        ],
      } as unknown as IFAIRTIQ_TICKETDATEN;

      const expectedFrist = moment("2026-11-09T14:30:00+01:00").format(
        "DD.MM.YYYY HH:mm:ss",
      );
      const expectedErsetzungsfrist = moment(
        "2026-11-09T15:30:00+01:00",
      ).format("DD.MM.YYYY HH:mm:ss");

      const result = parseTarifrechnerTicketFairtiq(ticket);
      expect(result.anzeigetext).toBe("Fairtiq Fahrt");
      expect(result.betraginEuro).toMatch(/2,50\s?€/);
      expect(result.reisendenbezug).toEqual([1]);
      expect(result.preisberuecksichtigungsfrist).toBe(expectedFrist);
      expect(result.ticketdatenersetzungsfrist).toBe(expectedErsetzungsfrist);
    });
  });
});
