import "dotenv/config";
import { ITrip } from "dvbjs";
import {
  EFA_ANFRAGE,
  DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG,
  DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN,
  INOUTVVO_FAIRTIQ_KAUFANGEBOTE_NACH_VERBINDUNG,
} from "@justusjonas74/pkm-tarifrechner/build/src/main";
import {
  IFAIRTIQ_ANFRAGE_ANTWORT,
  IFAIRTIQ_BERECHTIGUNG,
  IFAIRTIQ_REISENDER,
} from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import { FromITripOptions } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/fairtiq/requests";
import { IEINGABEDATEN } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";
import { TarifrechnerRequestConfig } from "@justusjonas74/pkm-tarifrechner/build/src/tarifrechner/generic/trRequest";

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
  vergangeneAnfragen?: IFAIRTIQ_ANFRAGE_ANTWORT[],
  berechtigungsliste?: IFAIRTIQ_BERECHTIGUNG[],
) {
  const config = getConfig();
  const options: FromITripOptions = {
    reisendenliste,
    berechtigungsliste,
    vergangeneAnfragen,
  };
  return INOUTVVO_FAIRTIQ_KAUFANGEBOTE_NACH_VERBINDUNG.fromITrip(
    trip,
    config,
    options,
  );
}
