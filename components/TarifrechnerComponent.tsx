import { ITrip } from "dvbjs"

import HighlightComponent from "./HighlightComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import { Button } from "react-bootstrap"


import { IEFA_ANTWORTLISTE } from "pkm-tarifrechner/build/src/tarifrechner/interfaces"
import { use, useEffect, useState } from "react"
import Tarifangaben from "./Tarifangaben"
import tarifrechnerAnfrage from "@/lib/tarifrechnerAnfrage"
import CollapseComponent from "./CollapseComponent"
import { toast } from "react-toastify"
import { optimizeJSONForPostman } from "@/lib/postman"


interface TarifrechnerComponentProps {
    selectedTrip: ITrip
}

export default function TarifrechnerComponent(props: TarifrechnerComponentProps) {

    const [efaAntwort, setEfaAntwort] = useState<IEFA_ANTWORTLISTE | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [jsonRequest, setJSONRequest] = useState<string|undefined>(undefined)
    const trip = props.selectedTrip
    
    const copyToClipboard = (text:string) => {navigator.clipboard.writeText(text)}


    
    useEffect(() => {
        const sendRequest = async () => {
            console.log("Fired sendRequest")
            try {
                const efaAnfrage = tarifrechnerAnfrage(trip)
                setJSONRequest(efaAnfrage.dataToJSON())
                setIsLoading(true)
                const response = await efaAnfrage.sendRequest()
                if (response) { setEfaAntwort(response) }
                setIsLoading(false)
            } catch (error) {
                let message
                if (error instanceof Error) message = error.message
                else message = String(error)
                toast.error(message)
            }
        }
        sendRequest()

    }, [trip])

    const copyPostManJSONToClipboard = () => {
        const data = jsonRequest
        if (data) {
            const optimizedData = optimizeJSONForPostman(data)
            copyToClipboard(optimizedData)
            toast.success("JSON kopiert")
        } else {
            toast.error("Ein Fehler ist aufgetreten.")
        }
    }

    return (
        <>

            <h3 className="my-4">Tarifrechnerantwort</h3>
            {isLoading && <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            }
            {(!isLoading && efaAntwort) &&
                <>
                    <div className="row">
                        <div className="col-sm-4">
                            <Tarifangaben tarifrechnerResponse={efaAntwort} />
                            <Button onClick={copyPostManJSONToClipboard}  variant="outline-primary" className="my-4">
                            <FontAwesomeIcon icon={faClipboard} className="mx-2" />
                            Kopiere Postman-Testfall
                            </Button>
                        </div>
                        <div className="col-sm-8">
                            { jsonRequest && <CollapseComponent chevronText="JSON-Request" id="collapse-json-request" textClassName="fw-semibold fs-5">
                                <HighlightComponent code={jsonRequest} language="json" />
                            </CollapseComponent>}
                            <CollapseComponent chevronText="JSON-Response" id="collapse-json-response" textClassName="fw-semibold fs-5">
                                <HighlightComponent code={JSON.stringify(efaAntwort, undefined, 2)} language="json" />
                            </CollapseComponent>
                        </div>
                    </div>


                </>
            }


        </>
    )
}