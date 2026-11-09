import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { POI_TYPE, type Point } from "dvbjs";
import { describe, expect, it, vi } from "vitest";
import StopBox from "./StopBox";
import StopField from "./StopField";

describe("StopField and StopBox", () => {
  const dummyStop: Point = {
    id: "33000028",
    name: "Hauptbahnhof",
    city: "Dresden",
    type: POI_TYPE.Stop,
    coords: [13.733, 51.04],
  };

  it("should render stop details and trigger reset in StopField", async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    render(<StopField stop={dummyStop} handleResetClick={handleReset} />);

    expect(screen.getByText(/Dresden - Hauptbahnhof/)).toBeInTheDocument();
    expect(screen.getByText(/\(ID:33000028\)/)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);

    expect(handleReset).toHaveBeenCalled();
  });

  it("should render StopField when stop is provided in StopBox", () => {
    render(
      <StopBox
        title="Von"
        stop={dummyStop}
        placeholder="Start"
        handleNewSelectedStop={vi.fn()}
        handleResetClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Von")).toBeInTheDocument();
    expect(screen.getByText(/Dresden - Hauptbahnhof/)).toBeInTheDocument();
  });

  it("should render SearchStopField when stop is null in StopBox", () => {
    render(
      <StopBox
        title="Nach"
        stop={null}
        placeholder="Ziel"
        handleNewSelectedStop={vi.fn()}
        handleResetClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Nach")).toBeInTheDocument();
    expect(
      screen.getByText("Haltstelle suchen...", { exact: false }),
    ).toBeInTheDocument();
  });
});
