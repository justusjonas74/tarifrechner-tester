import "dotenv/config";
import { ITrip } from "dvbjs";
import {
  EFA_ANFRAGE,
  DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG,
  DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN,
  INOUTVVO_FAIRTIQ_KAUFANGEBOTE_NACH_VERBINDUNG,
} from "pkm-tarifrechner";
import {
  IFAIRTIQ_ANFRAGELISTE_ANTWORTLISTE,
  IFAIRTIQ_REISENDER,
} from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import { FromITripOptions } from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/requests";
import { IEINGABEDATEN } from "pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";
import { TarifrechnerRequestConfig } from "pkm-tarifrechner/build/src/tarifrechner/generic/trRequest";

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
  eingabedaten: IEINGABEDATEN,
) {
  const config = getConfig();
  return DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN.fromEingabedaten(
    eingabedaten,
    config,
  );
}

export function tarifrechnerFairtiqAnfrage(
  trip: ITrip,
  reisendenliste: IFAIRTIQ_REISENDER[],
  vergangeneAnfragen?: IFAIRTIQ_ANFRAGELISTE_ANTWORTLISTE[],
) {
  const config = getConfig();
  const options: FromITripOptions = {
    reisendenliste,
    vergangeneAnfragen,
  };
  return INOUTVVO_FAIRTIQ_KAUFANGEBOTE_NACH_VERBINDUNG.fromITrip(
    trip,
    config,
    options,
  );
}
