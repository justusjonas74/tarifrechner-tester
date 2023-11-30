import 'dotenv/config'
import { ITrip } from 'dvbjs'
import { EFA_ANFRAGE } from 'pkm-tarifrechner'
import { TarifrechnerRequestConfig } from 'pkm-tarifrechner/build/src/trRequest'

export default function tarifrechnerAnfrage(trip: ITrip) {
    const api_key = process.env.NEXT_PUBLIC_APIKEY
    const api_key_header = api_key ? { 'X-Api-Key': process.env.NEXT_PUBLIC_APIKEY } : {}

    const config: TarifrechnerRequestConfig = {
        url: "tarifrechner/",
        axiosConfig: {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/vnd.pkm-tarifrechner-v7+json;charset=UTF-8',
                ...api_key_header
            }
        }
    }
    return EFA_ANFRAGE.fromITrip(trip, config)
}