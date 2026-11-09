import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Trip } from "dvbjs";
import { describe, expect, it, vi } from "vitest";
import RouteView from "./RouteView";

describe("RouteView", () => {
  const dummyTrip: Trip = {
    departure: {
      time: new Date("2026-11-09T10:00:00Z"),
      name: "Hauptbahnhof",
      city: "Dresden",
    },
    arrival: {
      time: new Date("2026-11-09T10:30:00Z"),
      name: "Postplatz",
      city: "Dresden",
    },
    duration: 30,
    interchanges: 0,
    nodes: [],
  } as any;

  it("should render route summary and handle select action", async () => {
    const user = userEvent.setup();
    const handleSelectedTrip = vi.fn();
    const handleEditTrip = vi.fn();

    render(
      <RouteView
        trip={dummyTrip}
        selectable={true}
        handleSelectedTrip={handleSelectedTrip}
        handleEditTrip={handleEditTrip}
      />,
    );

    expect(screen.getByText(/Dresden - Hauptbahnhof/)).toBeInTheDocument();
    expect(screen.getByText(/Dresden - Postplatz/)).toBeInTheDocument();

    const selectBtn = screen.getByRole("button", { name: /auswählen/i });
    await user.click(selectBtn);

    expect(handleSelectedTrip).toHaveBeenCalledWith(dummyTrip);
  });
});
