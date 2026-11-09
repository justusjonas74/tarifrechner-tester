import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import ZeitkartenModal from "./ZeitkartenModal";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("ZeitkartenModal", () => {
  it("should save zeitkarte when tariff zones are selected", async () => {
    const user = userEvent.setup();
    const handleUpdate = vi.fn();

    render(
      <ZeitkartenModal
        showModal={true}
        berechtigungsliste={[]}
        reisenderIndex={0}
        handleCloseModal={vi.fn()}
        handleUpdateBerechtigungsliste={handleUpdate}
      />,
    );

    const dresdenBtn = screen.getByRole("button", {
      name: "TZ 10 - Dresden",
    });
    await user.click(dresdenBtn);

    const saveBtn = screen.getByRole("button", { name: "Speichern" });
    await user.click(saveBtn);

    expect(toast.success).toHaveBeenCalledWith(
      "Die Zeitkarte wurde gespeichert.",
    );
    expect(handleUpdate).toHaveBeenCalledWith([
      expect.objectContaining({
        reisendenbezug: [1],
        eingabedaten: expect.objectContaining({
          version: "INOUTVVO_PHASE_1",
        }),
      }),
    ]);
  });
});
