import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CicoTestComponent from "./CicoTestComponent";

describe("CicoTestComponent", () => {
  it("should render CICO test tool sections", () => {
    render(<CicoTestComponent />);

    expect(
      screen.getByText("Testfallgenerator", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText("Check-In/Check-Out-Tests")).toBeInTheDocument();
    expect(screen.getByText("Hinterlegte Fahrten")).toBeInTheDocument();
  });
});
