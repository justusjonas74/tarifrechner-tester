import { ITrip } from "dvbjs";

import HighlightComponent from "./HighlightComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

import { useEffect, useState } from "react";
// import Tarifangaben from "./Tarifangaben";
import {
  tarifrechnerFairtiqAnfrage
} from "@/lib/tarifrechnerAnfrage";
import CollapseComponent from "./CollapseComponent";
import { toast } from "react-toastify";
import { optimizeJSONForPostman } from "@/lib/postman";
import copyTextToClipboard from "@/lib/copyToClipboard";
import { IFAIRTIQ_ANTWORTLISTE } from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import CicoTarifangaben from "./CicoTarifangaben";

interface TarifrechnerComponentProps {
  selectedTrip: ITrip;
}

export default function TarifrechnerCiCoComponent(
  props: TarifrechnerComponentProps
) {
  const [fairtiqAntwort, setFairtiqAntwort] = useState<IFAIRTIQ_ANTWORTLISTE | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [fairtiqJsonRequestData, setFairtiqJsonRequestData] = useState<
    string | undefined
  >(undefined);
  const trip = props.selectedTrip;

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);
        const fairtiqAnfrage = tarifrechnerFairtiqAnfrage(trip);
        setFairtiqJsonRequestData(fairtiqAnfrage.dataToJSON());
        const response = await fairtiqAnfrage.sendRequest();
        if (response) {
          setFairtiqAntwort(response);
        }

        setIsLoading(false);
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        toast.error(message);
      }
    };
    sendRequest();
  }, [trip]);

  const copyPostManJSONToClipboard = (data: string | undefined) => {
    // const data = efaJsonRequestData;
    if (data) {
      const optimizedData = optimizeJSONForPostman(data);
      copyTextToClipboard(optimizedData);
      toast.success("JSON kopiert");
    } else {
      toast.error("Ein Fehler ist aufgetreten.");
    }
  };


  const copyFairtiqPostManJSONToClipboard = () => {
    copyPostManJSONToClipboard(fairtiqJsonRequestData);
  };

  return (
    <>
      {isLoading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!isLoading && fairtiqAntwort && (
        <>
          <CollapseComponent
            chevronText="Fairtiq Angebotsinfo"
            id="collapse-tarifrechner-fairtiq-angebotsinfo"
            textClassName="fw-bold fs-4"
            isOpen
          >
            <div className="row">
              <div className="col-sm-4">
                <div className=" card shadow-sm rounded border">
                  <div className="card-header">
                    <h5 className="card-title">
                      Tarifrechner Angebotsinfo (FAIRTIQ)
                    </h5>
                  </div>
                  <CicoTarifangaben tarifrechnerResponse={fairtiqAntwort} />
                </div>
              </div>
              <div className="col-sm-8">
                <div className=" card shadow-sm rounded border">
                  <div className="card-header">
                    <h5 className="card-title">JSON-Daten</h5>
                  </div>
                  {props.selectedTrip && (
                    <CollapseComponent
                      chevronText="Verbindungsdaten (JSON)"
                      id="collapse-json-request"
                      textClassName="fw-semibold fs-5"
                    >
                      <HighlightComponent
                        code={JSON.stringify(props.selectedTrip, undefined, 2)}
                        language="json"
                      />
                    </CollapseComponent>
                  )}
                  {fairtiqJsonRequestData && (
                    <CollapseComponent
                      chevronText="Tarifrechner-Request (JSON)"
                      id="collapse-json-request"
                      textClassName="fw-semibold fs-5"
                    >
                      <HighlightComponent
                        code={fairtiqJsonRequestData}
                        language="json"
                      />
                    </CollapseComponent>
                  )}
                  <CollapseComponent
                    chevronText="Tarifrechner-Response (JSON)"
                    id="collapse-json-response"
                    textClassName="fw-semibold fs-5"
                  >
                    <HighlightComponent
                      code={JSON.stringify(fairtiqAntwort, undefined, 2)}
                      language="json"
                    />
                  </CollapseComponent>
                  <div className="d-grid">
                    <Button
                      onClick={copyFairtiqPostManJSONToClipboard}
                      variant="light"
                      className="my-1"
                    >
                      <FontAwesomeIcon icon={faClipboard} className="mx-2" />
                      Kopiere Postman-Testfall
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CollapseComponent>

        </>
      )}
    </>
  );
}
