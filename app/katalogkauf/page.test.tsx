import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KatalogkaufPage from "./page";

describe("KatalogkaufPage", () => {
  it("should render katalogkauf page", () => {
    render(<KatalogkaufPage />);
    expect(screen.getByText("Test Katalogmenü")).toBeInTheDocument();
  });
});
