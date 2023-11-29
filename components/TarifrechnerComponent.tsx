import { ITrip } from "dvbjs"
import { EFA_ANFRAGE } from "pkm-tarifrechner"
import { TarifrechnerRequestConfig } from "pkm-tarifrechner/build/src/trRequest"
import HighlightComponent from "./HighlightComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { Button } from "react-bootstrap"

import 'dotenv/config'


interface TarifrechnerComponentProps {
    selectedTrip: ITrip
}

export default function TarifrechnerComponent(props: TarifrechnerComponentProps) {
    const api_key = process.env.NEXT_PUBLIC_APIKEY
    const api_key_header = api_key ? {'X-Api-Key': process.env.NEXT_PUBLIC_APIKEY} : {}
    const config: TarifrechnerRequestConfig = {
        // url: "https://pkm-tarifrechner-test.vvo.ivi.fraunhofer.de/vvo",
        url: process.env.NEXT_PUBLIC_URL || "",
        axiosConfig: {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/vnd.pkm-tarifrechner-v7+json;charset=UTF-8',
                ...api_key_header
            }
        }
        
    }
    const efaAnfrage = EFA_ANFRAGE.fromITrip(props.selectedTrip, config)
    const sendRequest = async () =>{
        console.log(process.env.NEXT_PUBLIC_APIKEY)
        console.log(process.env.NEXT_PUBLIC_APIKEY)
        const response = await efaAnfrage.sendRequest()
        console.log(response)
    }
    const handleButtonClicked = ()=>{
        sendRequest()
    }
    return (
        <>

            <h3>Trip</h3>

            <Button className="btn" onClick={handleButtonClicked}>
                <FontAwesomeIcon icon={faPaperPlane} /> <br />
                Frage Tarifrechner an<br />
                <small>(JSON-Request)</small>
            </Button>
            <HighlightComponent code={efaAnfrage.dataToJSON()} language="json" />

        </>
    )
}