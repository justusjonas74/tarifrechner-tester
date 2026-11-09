import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CicoTarifangaben from "./CicoTarifangaben";

describe("CicoTarifangaben", () => {
  it("should format pruefergebnisse warnings and display them", () => {
    const response = {
      antwortliste: [
        {
          pruefergebnisliste: [
            {
              nr: "ANFRAGE_UNGUELTIG",
              entwicklerinfo: "Parameter X fehlt",
            },
          ],
        },
      ],
    } as any;

    render(
      <CicoTarifangaben
        tarifrechnerResponse={response}
        handleSaveCiCoRequest={vi.fn()}
      />,
    );

    expect(screen.getByText(/Die Anfrage ist ungültig\./)).toBeInTheDocument();
    expect(screen.getByText("Parameter X fehlt")).toBeInTheDocument();
  });

  it("should render tickets and trigger save request", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    const response = {
      antwortliste: [
        {
          ticketdatenliste: [
            {
              anzeigetext: "FAIRTIQ Ticket",
              bezahldatenliste: [{ betrag: 250 }],
              reisendenbezug: [1],
            },
          ],
          angebotsdatenliste: [
            {
              ticketdatenbezug: [1],
            },
          ],
        },
      ],
    } as any;

    render(
      <CicoTarifangaben
        tarifrechnerResponse={response}
        handleSaveCiCoRequest={handleSave}
      />,
    );

    expect(screen.getByText("FAIRTIQ Ticket")).toBeInTheDocument();
    expect(screen.getByText(/2,50\s?€/)).toBeInTheDocument();

    const saveBtn = screen.getByRole("button", {
      name: /Fahrt und Ticket speichern/i,
    });
    await user.click(saveBtn);

    expect(handleSave).toHaveBeenCalled();
  });
});
