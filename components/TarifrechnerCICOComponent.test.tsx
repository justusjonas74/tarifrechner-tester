import { render, screen, waitFor } from "@testing-library/react";
import type { Trip } from "dvbjs";
import { describe, expect, it, vi } from "vitest";
import TarifrechnerCICOComponent from "./TarifrechnerCICOComponent";

const mockSendRequest = vi.fn();
const mockDataToJSON = vi.fn().mockReturnValue('{"request": "fairtiq"}');

vi.mock("@/lib/tarifrechnerAnfrage", () => ({
  tarifrechnerFairtiqAnfrage: () => ({
    sendRequest: mockSendRequest,
    dataToJSON: mockDataToJSON,
    data: {
      anfrageliste: [{}],
    },
  }),
}));

describe("TarifrechnerCICOComponent", () => {
  it("should render and display FAIRTIQ results", async () => {
    mockSendRequest.mockResolvedValue({
      antwortliste: [
        {
          ticketdatenliste: [],
        },
      ],
    });

    render(
      <TarifrechnerCICOComponent
        selectedTrip={{} as Trip}
        berechtigungsliste={[]}
        reisendenliste={[{ typ: { nr: "1" } } as any]}
        handleSaveCiCoRequest={vi.fn()}
        previousCiCoRequests={[]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Fairtiq Angebotsinfo")).toBeInTheDocument();
      expect(
        screen.getByText("Tarifrechner Angebotsinfo (FAIRTIQ)"),
      ).toBeInTheDocument();
    });
  });
});
