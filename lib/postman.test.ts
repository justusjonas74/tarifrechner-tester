import { describe, expect, it } from "vitest";
import { optimizeJSONForPostman } from "./postman";

describe("optimizeJSONForPostman", () => {
  it("should replace YYYY-MM-DD dates with {{testDatum}}", () => {
    const input = JSON.stringify({
      datum: "2024-05-15",
      text: "Fahrt am 2026-11-09 um 12:00",
    });
    const result = optimizeJSONForPostman(input);
    expect(result).toBe(
      JSON.stringify({
        datum: "{{testDatum}}",
        text: "Fahrt am {{testDatum}} um 12:00",
      }),
    );
  });

  it("should return the exact same string if no dates match", () => {
    const input = JSON.stringify({ name: "Max Mustermann", count: 42 });
    expect(optimizeJSONForPostman(input)).toBe(input);
  });
});
