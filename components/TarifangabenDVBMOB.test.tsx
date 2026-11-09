import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import TarifangabenDVBMOB from "./TarifangabenDVBMOB";
import { TicketDetailsDvb } from "./TicketDetailsDvb";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("./KaufangeboteModal", () => ({
  default: () => <div data-testid="kaufangebote-modal" />,
}));

describe("TarifangabenDVBMOB & TicketDetailsDvb", () => {
  it("should render TicketDetailsDvb", () => {
    const ticket = {
      anzeigetext: "Einzelfahrt",
      bezahldatenliste: [{ betrag: 300 }],
    } as any;

    render(<TicketDetailsDvb ticket={ticket} />);
    expect(
      screen.getByText("Einzelfahrt", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3,00\s?€/)).toBeInTheDocument();
  });

  it("should toast error if clicking ticket without eingabedaten", async () => {
    const user = userEvent.setup();
    const dvbResponse = {
      antwortliste: [
        {
          ticketdatenliste: [
            {
              anzeigetext: "Ticket ohne Eingabedaten",
              bezahldatenliste: [{ betrag: 250 }],
            },
          ],
        },
      ],
    } as any;

    render(<TarifangabenDVBMOB tarifrechnerResponse={dvbResponse} />);
    const link = screen.getByText("Ticket ohne Eingabedaten", { exact: false });
    await user.click(link);

    expect(toast.error).toHaveBeenCalledWith(
      "Das Ticket hat keine Eingabedaten",
    );
  });
});
