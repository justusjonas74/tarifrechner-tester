import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "./layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("RootLayout", () => {
  it("should render layout with navbar and children", () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Child Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("VVO Tarifrechner Test-Tool")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });
});
