import "dotenv/config";
import { ITrip } from "dvbjs";
import { EFA_ANFRAGE } from "pkm-tarifrechner";
import { TarifrechnerRequestConfig } from "pkm-tarifrechner/build/src/trRequest";

export default function tarifrechnerAnfrage(trip: ITrip) {
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
  console.log(config);
  return EFA_ANFRAGE.fromITrip(trip, config);
}
