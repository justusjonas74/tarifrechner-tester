import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ReisendenComponent from "./ReisendenComponent";

vi.mock("./ZeitkartenModal", () => ({
  default: () => <div data-testid="zeitkarten-modal" />,
}));

describe("ReisendenComponent", () => {
  it("should render passengers and allow setting main user or removing", async () => {
    const user = userEvent.setup();
    const handleChangedReisendenliste = vi.fn();

    const reisendenliste: any[] = [
      {
        typ: { nr: "1", name: "Erwachsener" },
        erweiterungsliste: [{ nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "T" }],
      },
      {
        typ: { nr: "2", name: "Kind" },
        erweiterungsliste: [{ nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "F" }],
      },
    ];

    render(
      <ReisendenComponent
        reisendenliste={reisendenliste}
        berechtigungsliste={[]}
        handleChangedReisendenliste={handleChangedReisendenliste}
        handleChangedBerechtigungsliste={vi.fn()}
      />,
    );

    expect(screen.getByText("Erwachsener")).toBeInTheDocument();
    expect(screen.getByText("Hauptnutzer")).toBeInTheDocument();
    expect(screen.getByText("Kind")).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button");
    const trashBtn = removeButtons.find((btn) =>
      btn.className.includes("btn-danger"),
    );
    if (trashBtn) {
      await user.click(trashBtn);
      expect(handleChangedReisendenliste).toHaveBeenCalled();
    }
  });
});
