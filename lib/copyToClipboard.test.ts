import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import copyTextToClipboard from "./copyToClipboard";

describe("copyTextToClipboard", () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  it("should use navigator.clipboard.writeText and call onSuccess", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();

    copyTextToClipboard("Hello World", onError, onSuccess);

    expect(writeTextMock).toHaveBeenCalledWith("Hello World");
    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Async: Copying to clipboard was successful!",
      );
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it("should use navigator.clipboard.writeText and call onError when writeText rejects", async () => {
    const error = new Error("Clipboard write failed");
    const writeTextMock = vi.fn().mockRejectedValue(error);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();

    copyTextToClipboard("Test Error", onError, onSuccess);

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("should use fallback when navigator.clipboard is undefined (execCommand succeeds)", () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const execCommandMock = vi.fn().mockReturnValue(true);
    document.execCommand = execCommandMock;

    const onSuccess = vi.fn();
    const onError = vi.fn();

    copyTextToClipboard("Fallback Text", onError, onSuccess);

    expect(execCommandMock).toHaveBeenCalledWith("copy");
    expect(onSuccess).toHaveBeenCalledWith(
      "Fallback: Copying text command was successful",
    );
    expect(onError).not.toHaveBeenCalled();
  });

  it("should handle fallback error when execCommand throws", () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const execCommandMock = vi.fn().mockImplementation(() => {
      throw new Error("execCommand denied");
    });
    document.execCommand = execCommandMock;

    const onSuccess = vi.fn();
    const onError = vi.fn();

    copyTextToClipboard("Fallback Error", onError, onSuccess);

    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
