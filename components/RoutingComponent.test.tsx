import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RoutingComponent from "./RoutingComponent";

vi.mock("./Routes", () => ({
  default: () => <div data-testid="routes-mock" />,
}));

describe("RoutingComponent", () => {
  it("should render stop boxes and handle swap stops", async () => {
    const user = userEvent.setup();
    render(
      <RoutingComponent handleChangedTrip={vi.fn()} selectedTrip={null} />,
    );

    expect(screen.getByText("Von")).toBeInTheDocument();
    expect(screen.getByText("Nach")).toBeInTheDocument();
    expect(screen.getByText("Abfahrt")).toBeInTheDocument();

    const swapBtn = screen.getByRole("button", {
      name: "Start und Ziel tauschen",
    });
    expect(swapBtn).toBeDisabled();
  });
});
