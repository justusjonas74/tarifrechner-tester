import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfoPage from "./page";

describe("InfoPage", () => {
  it("should render info page", () => {
    render(<InfoPage />);
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Angefragter Tarifrechner:")).toBeInTheDocument();
  });
});
