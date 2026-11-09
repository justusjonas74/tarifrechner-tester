import type { IEFA_TICKETDATEN } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/efa/interfaces";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Tarifangaben from "./Tarifangaben";
import { TicketDetailsEfa } from "./TicketDetailsEfa";

describe("Tarifangaben & TicketDetailsEfa", () => {
  const dummyTicket: IEFA_TICKETDATEN = {
    anzeigetext: "VVO Einzelfahrt",
    bezahldatenliste: [{ betrag: 300 }],
    erweiterungsliste: [
      { nr: "FPAVVO_PREISSTUFE_TEXT", wert: "XEinzonen-Tarif" },
      { nr: "FPAVVO_RAUM_TEXT", wert: "XTZ 10 Dresden" },
      { nr: "FPAVVO_PRODUKTNUMMER", wert: "X1001" },
      { nr: "FPAVVO_GUELTIGKEITSRAUM_TEXT", wert: "XTarifzone Dresden" },
      { nr: "FPAVVO_NETZKENNUNG", wert: "XVVO" },
    ],
  };

  it("should render TicketDetailsEfa correctly", () => {
    render(<TicketDetailsEfa ticket={dummyTicket} />);

    expect(screen.getByText("VVO Einzelfahrt")).toBeInTheDocument();
    expect(screen.getByText("Einzonen-Tarif")).toBeInTheDocument();
    expect(screen.getByText("TZ 10 Dresden")).toBeInTheDocument();
    expect(screen.getByText(/3,00\s?€/)).toBeInTheDocument();
  });

  it("should render Tarifangaben with list of tickets", () => {
    const efaResponse = {
      antwortliste: [
        {
          ticketdatenliste: [dummyTicket],
        },
      ],
    } as any;

    render(<Tarifangaben tarifrechnerResponse={efaResponse} />);
    expect(screen.getByText("VVO Einzelfahrt")).toBeInTheDocument();
  });

  it("should show empty state message if no tickets", () => {
    const efaResponse = {
      antwortliste: [
        {
          ticketdatenliste: [],
        },
      ],
    } as any;

    render(<Tarifangaben tarifrechnerResponse={efaResponse} />);
    expect(
      screen.getByText(
        "Die Anwort des Tarifrechners enthält keine Tarifangaben",
      ),
    ).toBeInTheDocument();
  });
});
