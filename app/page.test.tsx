import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("should render home page", () => {
    render(<HomePage />);
    expect(screen.getByText("Testfallgenerator")).toBeInTheDocument();
  });
});
