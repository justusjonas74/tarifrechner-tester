import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CicoPage from "./page";

describe("CicoPage", () => {
  it("should render CICO page", () => {
    render(<CicoPage />);
    expect(screen.getByText("Check-In/Check-Out-Tests")).toBeInTheDocument();
  });
});
