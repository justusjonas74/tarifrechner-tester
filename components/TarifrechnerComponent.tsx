import { ITrip } from "dvbjs"

import HighlightComponent from "./HighlightComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import { Button } from "react-bootstrap"


import { IEFA_ANTWORTLISTE } from "pkm-tarifrechner/build/src/tarifrechner/interfaces"
import { useEffect, useState } from "react"
import Tarifangaben from "./Tarifangaben"
import tarifrechnerAnfrage from "@/lib/tarifrechnerAnfrage"
import CollapseComponent from "./CollapseComponent"
import { toast } from "react-toastify"
import { optimizeJSONForPostman } from "@/lib/postman"
import copyTextToClipboard from "@/lib/copyToClipboard"


interface TarifrechnerComponentProps {
    selectedTrip: ITrip
}

export default function TarifrechnerComponent(props: TarifrechnerComponentProps) {

    const [efaAntwort, setEfaAntwort] = useState<IEFA_ANTWORTLISTE | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [jsonRequest, setJSONRequest] = useState<string | undefined>(undefined)
    const trip = props.selectedTrip

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
            copyTextToClipboard(optimizedData)
            toast.success("JSON kopiert")
        } else {
            toast.error("Ein Fehler ist aufgetreten.")
        }
    }

    return (
        <>


            {isLoading && <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            }
            {(!isLoading && efaAntwort) &&
                <>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className=" card shadow-sm rounded border">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        Tarifrechnerantwort
                                    </h5>
                                </div>
                                <Tarifangaben tarifrechnerResponse={efaAntwort} />
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className=" card shadow-sm rounded border">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        JSON-Daten
                                    </h5>
                                </div>
                                {props.selectedTrip && <CollapseComponent chevronText="Verbindungsdaten (JSON)" id="collapse-json-request" textClassName="fw-semibold fs-5">
                                    <HighlightComponent code={JSON.stringify(props.selectedTrip, undefined, 2)} language="json" />
                                </CollapseComponent>}
                                {jsonRequest && <CollapseComponent chevronText="Tarifrechner-Request (JSON)" id="collapse-json-request" textClassName="fw-semibold fs-5">
                                    <HighlightComponent code={jsonRequest} language="json" />
                                </CollapseComponent>}
                                <CollapseComponent chevronText="Tarifrechner-Response (JSON)" id="collapse-json-response" textClassName="fw-semibold fs-5">
                                    <HighlightComponent code={JSON.stringify(efaAntwort, undefined, 2)} language="json" />
                                </CollapseComponent>
                                <div className="d-grid">
                                    <Button onClick={copyPostManJSONToClipboard} variant="light" className="my-1">
                                        <FontAwesomeIcon icon={faClipboard} className="mx-2" />
                                        Kopiere Postman-Testfall
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>


                    </>
            }


                </>
    )
}