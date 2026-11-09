import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { findStop, POI_TYPE, type Point } from "dvbjs";
import { describe, expect, it, vi } from "vitest";
import SearchStopField from "./SearchStopField";

vi.mock("dvbjs", async () => {
  const actual = await vi.importActual<any>("dvbjs");
  return {
    ...actual,
    findStop: vi.fn(),
  };
});

describe("SearchStopField", () => {
  it("should trigger findStop when 3 or more chars are typed", async () => {
    const user = userEvent.setup();
    const handleNewSelectedStop = vi.fn();
    const stopsMock: Point[] = [
      {
        id: "33000028",
        name: "Hauptbahnhof",
        city: "Dresden",
        type: POI_TYPE.Stop,
        coords: [13.733, 51.04],
      },
    ];
    vi.mocked(findStop).mockResolvedValue(stopsMock);

    render(<SearchStopField handleNewSelectedStop={handleNewSelectedStop} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Hbf");

    await waitFor(() => {
      expect(findStop).toHaveBeenCalledWith("Hbf");
    });
  });
});
