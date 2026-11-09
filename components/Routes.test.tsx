import { render, screen, waitFor } from "@testing-library/react";
import { POI_TYPE, route, type Trip } from "dvbjs";
import { describe, expect, it, vi } from "vitest";
import Routes from "./Routes";

vi.mock("dvbjs", async () => {
  const actual = await vi.importActual<any>("dvbjs");
  return {
    ...actual,
    route: vi.fn(),
  };
});

describe("Routes", () => {
  it("should fetch routes when from and to stops are provided", async () => {
    const dummyTrip = {
      departure: {
        time: new Date("2026-11-09T10:00:00Z"),
        name: "Hbf",
        city: "Dresden",
      },
      arrival: {
        time: new Date("2026-11-09T10:20:00Z"),
        name: "Postplatz",
        city: "Dresden",
      },
      duration: 20,
      interchanges: 0,
      nodes: [],
    } as unknown as Trip;

    vi.mocked(route).mockResolvedValue({
      trips: [dummyTrip],
    } as any);

    render(
      <Routes
        fromStop={{
          id: "1",
          name: "Hbf",
          city: "Dresden",
          type: POI_TYPE.Stop,
          coords: [13.73, 51.04],
        }}
        toStop={{
          id: "2",
          name: "Postplatz",
          city: "Dresden",
          type: POI_TYPE.Stop,
          coords: [13.73, 51.05],
        }}
        viaStop={null}
        selectedTrip={null}
        dateTime={new Date()}
        handleSelectedTrip={vi.fn()}
        handleEditTrip={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(route).toHaveBeenCalled();
      expect(screen.getByText(/Dresden - Hbf/)).toBeInTheDocument();
    });
  });
});
