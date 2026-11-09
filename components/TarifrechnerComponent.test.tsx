import { render, screen, waitFor } from "@testing-library/react";
import type { Trip } from "dvbjs";
import { describe, expect, it, vi } from "vitest";
import TarifrechnerComponent from "./TarifrechnerComponent";

const mockEfaSend = vi.fn();
const mockDvbSend = vi.fn();

vi.mock("@/lib/tarifrechnerAnfrage", () => ({
  tarifrechnerEfaAnfrage: () => ({
    sendRequest: mockEfaSend,
    dataToJSON: () => "{}",
  }),
  tarifrechnerDvbAngebotsinfoAnfrage: () => ({
    sendRequest: mockDvbSend,
    dataToJSON: () => "{}",
  }),
}));

describe("TarifrechnerComponent", () => {
  it("should query EFA and DVB and display results", async () => {
    mockEfaSend.mockResolvedValue({
      antwortliste: [{ ticketdatenliste: [] }],
    });
    mockDvbSend.mockResolvedValue({
      antwortliste: [{ ticketdatenliste: [] }],
    });

    render(<TarifrechnerComponent selectedTrip={{} as Trip} />);

    await waitFor(() => {
      expect(screen.getByText("EFA")).toBeInTheDocument();
      expect(screen.getByText("DVB MOBI-Plattform")).toBeInTheDocument();
    });
  });
});
