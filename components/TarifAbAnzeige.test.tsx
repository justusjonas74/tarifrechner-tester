import { render, screen, waitFor } from "@testing-library/react";
import type { Trip } from "dvbjs";
import { describe, expect, it, vi } from "vitest";
import TarifAbAnzeige from "./TarifAbAnzeige";

const mockSendRequest = vi.fn();
vi.mock("@/lib/tarifrechnerAnfrage", () => ({
  tarifrechnerEfaAnfrage: () => ({
    sendRequest: mockSendRequest,
  }),
}));

describe("TarifAbAnzeige", () => {
  const dummyTrip = {} as Trip;

  it("should show loading spinner and then price overview", async () => {
    mockSendRequest.mockResolvedValue({
      antwortliste: [
        {
          ticketdatenliste: [
            {
              anzeigetext: "VVO Einzelfahrt",
              bezahldatenliste: [{ betrag: 300 }],
              erweiterungsliste: [
                { nr: "FPAVVO_PREISSTUFE_TEXT", wert: "XPreisstufe 1" },
              ],
            },
          ],
        },
      ],
    });

    render(<TarifAbAnzeige trip={dummyTrip} />);

    await waitFor(() => {
      expect(screen.getByText(/ab 3,00\s?€/)).toBeInTheDocument();
      expect(screen.getByText("Preisstufe 1")).toBeInTheDocument();
    });
  });

  it("should show 'Keine Preisauskunft' if no ticket is available", async () => {
    mockSendRequest.mockResolvedValue({
      antwortliste: [],
    });

    render(<TarifAbAnzeige trip={dummyTrip} />);

    await waitFor(() => {
      expect(screen.getByText("Keine Preisauskunft")).toBeInTheDocument();
    });
  });
});
