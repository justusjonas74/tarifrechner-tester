import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

describe("/app/tarifrechner/route", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("GET", () => {
    it("should return status ok", async () => {
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toEqual({ status: "ok" });
    });
  });

  describe("POST", () => {
    it("should forward POST request and return upstream response", async () => {
      process.env.NEXT_PUBLIC_URL = "https://mock-tarifrechner.local/tc";
      process.env.NEXT_PUBLIC_APIKEY = "server-api-key";

      const mockUpstreamResponse = new Response(
        JSON.stringify({ result: "success" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
      global.fetch = vi.fn().mockResolvedValue(mockUpstreamResponse);

      const request = new NextRequest(
        "http://localhost:3000/app/tarifrechner",
        {
          method: "POST",
          body: JSON.stringify({ query: "ticket" }),
          headers: {
            "Content-Type": "application/json",
            "X-Ios-Bundle-Identifier": "de.vvo-online.app",
          },
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toBe(JSON.stringify({ result: "success" }));

      expect(global.fetch).toHaveBeenCalledWith(
        "https://mock-tarifrechner.local/tc",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ query: "ticket" }),
        }),
      );
    });

    it("should return 502 when fetch fails", async () => {
      process.env.NEXT_PUBLIC_URL = "https://mock-tarifrechner.local/tc";
      global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

      const request = new NextRequest(
        "http://localhost:3000/app/tarifrechner",
        {
          method: "POST",
          body: "test",
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(502);
      const json = await response.json();
      expect(json).toEqual({ error: "Failed to connect to tarifrechner API" });
    });
  });
});
