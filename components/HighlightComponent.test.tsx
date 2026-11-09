import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import copyTextToClipboard from "@/lib/copyToClipboard";
import HighlightComponent, { isValidJson } from "./HighlightComponent";

vi.mock("@/lib/copyToClipboard", () => ({
  default: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("HighlightComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("isValidJson", () => {
    it("should validate JSON strings correctly", () => {
      expect(isValidJson('{"valid": true}')).toBe(true);
      expect(isValidJson("not json")).toBe(false);
      expect(isValidJson("")).toBe(false);
    });
  });

  describe("Component Rendering and Actions", () => {
    it("should render code and trigger copy function", async () => {
      const user = userEvent.setup();
      render(
        <HighlightComponent
          code='{"key": "value"}'
          language="json"
          filename="test.json"
        />,
      );

      const copyButton = screen.getByTitle("Kopieren");
      await user.click(copyButton);

      expect(copyTextToClipboard).toHaveBeenCalledWith(
        '{"key": "value"}',
        expect.any(Function),
        expect.any(Function),
      );
    });

    it("should trigger download when valid json is saved", async () => {
      const user = userEvent.setup();
      const createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url");
      const revokeObjectURLMock = vi.fn();
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      render(
        <HighlightComponent
          code='{"key": "value"}'
          language="json"
          filename="export"
        />,
      );

      const saveButton = screen.getByTitle("Speichern");
      await user.click(saveButton);

      expect(toast.success).toHaveBeenCalledWith("JSON-Datei heruntergeladen!");
    });

    it("should show error toast when saving invalid json", async () => {
      const user = userEvent.setup();
      render(
        <HighlightComponent
          code="invalid json"
          language="json"
          filename="export"
        />,
      );

      const saveButton = screen.getByTitle("Speichern");
      await user.click(saveButton);

      expect(toast.error).toHaveBeenCalledWith(
        "Der Code ist kein gültiges JSON!",
      );
    });
  });
});
