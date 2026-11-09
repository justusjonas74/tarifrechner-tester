import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import KaufangeboteModal from "./KaufangeboteModal";

const mockSendRequest = vi.fn();
const mockDataToJSON = vi.fn().mockReturnValue('{"request": true}');

vi.mock("@/lib/tarifrechnerAnfrage", () => ({
  tarifrechnerDvbKaufangeboteNachEingabedaten: () => ({
    sendRequest: mockSendRequest,
    dataToJSON: mockDataToJSON,
  }),
}));

describe("KaufangeboteModal", () => {
  it("should send request and display content when eingabedaten is passed", async () => {
    mockSendRequest.mockResolvedValue({
      antwortliste: [
        {
          ticketdatenliste: [],
        },
      ],
    });

    render(
      <KaufangeboteModal
        eingabedaten={{ dummy: true } as any}
        handleCloseFn={vi.fn()}
      />,
    );

    expect(screen.getByText("Kaufangebote")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalled();
      expect(
        screen.getByText("Anfragedaten an Tarifrechner"),
      ).toBeInTheDocument();
    });
  });
});
