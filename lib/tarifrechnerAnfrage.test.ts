import {
  DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG,
  DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN,
  EFA_ANFRAGE,
  INOUTVVO_FAIRTIQ_KAUFANGEBOTE_NACH_VERBINDUNG,
} from "@justusjonas74/pkm-tarifrechner/build/src/main";
import type { Trip } from "dvbjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  tarifrechnerDvbAngebotsinfoAnfrage,
  tarifrechnerDvbKaufangeboteNachEingabedaten,
  tarifrechnerEfaAnfrage,
  tarifrechnerFairtiqAnfrage,
} from "./tarifrechnerAnfrage";

vi.mock("@justusjonas74/pkm-tarifrechner/build/src/main", () => ({
  EFA_ANFRAGE: {
    fromITrip: vi.fn(),
  },
  DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG: {
    fromITrip: vi.fn(),
  },
  DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN: {
    fromEingabedaten: vi.fn(),
  },
  INOUTVVO_FAIRTIQ_KAUFANGEBOTE_NACH_VERBINDUNG: {
    fromITrip: vi.fn(),
  },
}));

describe("tarifrechnerAnfrage", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const dummyTrip = {
    arrival: { time: new Date("2026-11-09T14:00:00Z") },
  } as unknown as Trip;

  it("should configure headers with api key and bundle id if present in env", () => {
    process.env.NEXT_PUBLIC_APIKEY = "test-api-key";
    process.env.NEXT_PUBLIC_BUNDLEID = "test-bundle-id";

    tarifrechnerEfaAnfrage(dummyTrip);

    expect(EFA_ANFRAGE.fromITrip).toHaveBeenCalledWith(
      dummyTrip,
      expect.objectContaining({
        url: "/tarifrechner",
        axiosConfig: expect.objectContaining({
          headers: expect.objectContaining({
            "X-Api-Key": "test-api-key",
            "X-Ios-Bundle-Identifier": "test-bundle-id",
          }),
        }),
      }),
    );
  });

  it("should delegate tarifrechnerDvbAngebotsinfoAnfrage correctly", () => {
    tarifrechnerDvbAngebotsinfoAnfrage(dummyTrip);
    expect(DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG.fromITrip).toHaveBeenCalledWith(
      dummyTrip,
      expect.any(Object),
    );
  });

  it("should delegate tarifrechnerDvbKaufangeboteNachEingabedaten correctly", () => {
    const eingabedaten = { dummy: true } as any;
    tarifrechnerDvbKaufangeboteNachEingabedaten(eingabedaten);
    expect(
      DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN.fromEingabedaten,
    ).toHaveBeenCalledWith(eingabedaten, expect.any(Object));
  });

  it("should delegate tarifrechnerFairtiqAnfrage and pass options with arrival date", () => {
    const reisendenliste: any = [{ typ: { nr: "1" } }];
    tarifrechnerFairtiqAnfrage(dummyTrip, reisendenliste);

    expect(
      INOUTVVO_FAIRTIQ_KAUFANGEBOTE_NACH_VERBINDUNG.fromITrip,
    ).toHaveBeenCalledWith(
      dummyTrip,
      expect.any(Object),
      expect.objectContaining({
        anfragezeitpunkt: new Date("2026-11-09T14:00:00Z"),
        reisendenliste,
      }),
    );
  });
});
