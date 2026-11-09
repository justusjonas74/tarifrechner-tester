import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VdvEinheitslayout from "./VdvEinheitslayout";

describe("VdvEinheitslayout", () => {
  it("should show message when no layout data is present", () => {
    render(<VdvEinheitslayout daten={undefined} />);
    expect(
      screen.getByText("Keine (Layout-)Daten verfügbar"),
    ).toBeInTheDocument();
  });

  it("should render layout contents when valid data is present", () => {
    const daten = {
      antwortliste: [
        {
          ticketdatenliste: [
            {
              ausgabedaten: {
                vdveinheitslayout: {
                  fkvpname: "DVB AG",
                  fkvplogo: "6013",
                  gueltigkeitszeittext: "ab Entwertung",
                  tarifprodukttext: "Einzelfahrt",
                  gueltigkeitskurztext: "1 Zone",
                  nutzerinfotext: "<span>Gute Fahrt</span>",
                  gueltigkeitslangtext: "<span>Gültig in Zone 10</span>",
                  konditionstext: "<span>Nicht übertragbar</span>",
                  preistext: "3,00 €",
                },
              },
            },
          ],
        },
      ],
    } as any;

    render(<VdvEinheitslayout daten={daten} />);
    expect(screen.getByText("Einheitslayout")).toBeInTheDocument();
  });
});
