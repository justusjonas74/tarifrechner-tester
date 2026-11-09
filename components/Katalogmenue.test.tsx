import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Katalogmenue from "./Katalogmenue";

describe("Katalogmenue", () => {
  it("should render initial tariff buttons and advance through selections", async () => {
    const user = userEvent.setup();
    render(<Katalogmenue />);

    expect(screen.getByText("Test Katalogmenü")).toBeInTheDocument();

    const vvoTarifBtn = screen.getByRole("button", { name: "VVO-Tarif" });
    await user.click(vvoTarifBtn);

    expect(screen.getByText("Tarif:")).toBeInTheDocument();
    expect(screen.getByText("VVO")).toBeInTheDocument();
  });
});
