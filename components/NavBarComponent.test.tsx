import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import NavbarComponent from "./NavBarComponent";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("NavbarComponent", () => {
  it("should mark the active link according to pathname", () => {
    vi.mocked(usePathname).mockReturnValue("/cico");

    render(<NavbarComponent />);

    const efaLink = screen.getByRole("link", { name: "EFA/MOBI-App" });
    const cicoLink = screen.getByRole("link", { name: "CICO/FAIRTIQ" });
    const infoLink = screen.getByRole("link", { name: "Info" });

    expect(cicoLink).toHaveClass("active");
    expect(efaLink).not.toHaveClass("active");
    expect(infoLink).not.toHaveClass("active");
  });
});
