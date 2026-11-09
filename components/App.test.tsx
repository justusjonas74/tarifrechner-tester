import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("should render application header and routing section", () => {
    render(<App />);

    expect(screen.getByText("Testfallgenerator")).toBeInTheDocument();
    expect(screen.getByText("Verbindungsauswahl")).toBeInTheDocument();
  });
});
