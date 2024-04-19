import "dotenv/config";
import { ITrip } from "dvbjs";
import {
  EFA_ANFRAGE,
  DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG,
  DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN,
} from "pkm-tarifrechner";
import { IEINGABEDATEN } from "pkm-tarifrechner/build/src/tarifrechner/interfaces";
import { TarifrechnerRequestConfig } from "pkm-tarifrechner/build/src/trRequest";

const getConfig = () => {
  const api_key = process.env.NEXT_PUBLIC_APIKEY;
  const api_key_header = api_key ? { "X-Api-Key": api_key } : {};
  const bundleId = process.env.NEXT_PUBLIC_BUNDLEID;
  const bundleId_header = bundleId
    ? { "X-Ios-Bundle-Identifier": bundleId }
    : {};
  const config: TarifrechnerRequestConfig = {
    url: "tarifrechner/",
    axiosConfig: {
      headers: {
        "Content-Type": "application/json",
        accept: "application/vnd.pkm-tarifrechner-v7+json;charset=UTF-8",
        ...api_key_header,
        ...bundleId_header,
      },
    },
  };
  return config;
};

export function tarifrechnerEfaAnfrage(trip: ITrip) {
  const config = getConfig();
  return EFA_ANFRAGE.fromITrip(trip, config);
}

export function tarifrechnerDvbAngebotsinfoAnfrage(trip: ITrip) {
  const config = getConfig();
  return DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG.fromITrip(trip, config);
}

export function tarifrechnerDvbKaufangeboteNachEingabedaten(
  eingabedaten: IEINGABEDATEN
) {
  const config = getConfig();
  return DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN.fromEingabedaten(
    eingabedaten,
    config
  );
}
