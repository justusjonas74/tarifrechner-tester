import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CollapseComponent from "./CollapseComponent";

describe("CollapseComponent", () => {
  it("should render collapsed by default", () => {
    render(
      <CollapseComponent chevronText="Mehr Infos" id="test-collapse">
        <div>Inhalt</div>
      </CollapseComponent>,
    );

    const button = screen.getByRole("button", { name: /Mehr Infos/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should toggle open/closed on click", async () => {
    const user = userEvent.setup();
    render(
      <CollapseComponent
        chevronText="Aufklappbar"
        id="test-collapse"
        isOpen={false}
      >
        <div>Geheimer Text</div>
      </CollapseComponent>,
    );

    const button = screen.getByRole("button", { name: /Aufklappbar/i });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
