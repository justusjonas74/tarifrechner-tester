import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MultiSelect, { type TARIFZONEN } from "./MultiSelect";

describe("MultiSelect", () => {
  const items: TARIFZONEN[] = [
    { nr: "10", name: "Dresden" },
    { nr: "20", name: "Hoyerswerda" },
    { nr: "30", name: "Kamenz" },
  ];

  it("should render all items and trigger toggle when clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiSelect
        items={items}
        selectedItems={[items[0]]}
        onChange={onChange}
      />,
    );

    expect(screen.getByText("TZ 10 - Dresden")).toBeInTheDocument();
    expect(screen.getByText("TZ 20 - Hoyerswerda")).toBeInTheDocument();

    const hoyerswerdaBtn = screen.getByRole("button", {
      name: "TZ 20 - Hoyerswerda",
    });
    await user.click(hoyerswerdaBtn);

    expect(onChange).toHaveBeenCalledWith([items[0], items[1]]);
  });

  it("should select all when 'Alle auswählen' is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiSelect items={items} selectedItems={[]} onChange={onChange} />,
    );

    const selectAllBtn = screen.getByRole("button", { name: "Alle auswählen" });
    await user.click(selectAllBtn);

    expect(onChange).toHaveBeenCalledWith(items);
  });

  it("should select none when 'Keine auswählen' is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiSelect items={items} selectedItems={items} onChange={onChange} />,
    );

    const selectNoneBtn = screen.getByRole("button", {
      name: "Keine auswählen",
    });
    await user.click(selectNoneBtn);

    expect(onChange).toHaveBeenCalledWith([]);
  });
});
