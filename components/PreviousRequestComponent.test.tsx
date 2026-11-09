import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PreviousRequestComponent from "./PreviousRequestComponent";

describe("PreviousRequestComponent", () => {
  it("should disable reset button when no trips are present", () => {
    render(
      <PreviousRequestComponent
        previousRequests={[]}
        handleResetPreviousCiCoRequests={vi.fn()}
      />,
    );

    expect(screen.getByText("0 Fahrten vorhanden.")).toBeInTheDocument();
    const btn = screen.getByRole("button", {
      name: "Alle Fahrten zurücksetzen",
    });
    expect(btn).toBeDisabled();
  });

  it("should enable reset button and call handler on click when trips exist", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <PreviousRequestComponent
        previousRequests={[{ anfrage: {}, antwort: {} } as any]}
        handleResetPreviousCiCoRequests={onReset}
      />,
    );

    expect(screen.getByText("1 Fahrten vorhanden.")).toBeInTheDocument();
    const btn = screen.getByRole("button", {
      name: "Alle Fahrten zurücksetzen",
    });
    expect(btn).not.toBeDisabled();

    await user.click(btn);
    expect(onReset).toHaveBeenCalled();
  });
});
