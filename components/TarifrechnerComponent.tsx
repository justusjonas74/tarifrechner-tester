import { ITrip } from "dvbjs";

import HighlightComponent from "./HighlightComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

import {
  IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG,
  IEFA_ANTWORTLISTE,
} from "pkm-tarifrechner/build/src/tarifrechner/interfaces";
import { useEffect, useState } from "react";
import Tarifangaben from "./Tarifangaben";
import {
  tarifrechnerEfaAnfrage,
  tarifrechnerDvbAngebotsinfoAnfrage,
} from "@/lib/tarifrechnerAnfrage";
import CollapseComponent from "./CollapseComponent";
import { toast } from "react-toastify";
import { optimizeJSONForPostman } from "@/lib/postman";
import copyTextToClipboard from "@/lib/copyToClipboard";
import TarifangabenDVBMOB from "./TarifangabenDVBMOB";

interface TarifrechnerComponentProps {
  selectedTrip: ITrip;
}

export default function TarifrechnerComponent(
  props: TarifrechnerComponentProps
) {
  const [efaAntwort, setEfaAntwort] = useState<IEFA_ANTWORTLISTE | undefined>(
    undefined
  );
  const [dvbAngebotsinfoAntwort, setDvbAngebotsinfoAntwort] = useState<
    IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    dvbAngebotsAnfrageJsonRequestData,
    setdvbAngebotsAnfrageJsonRequestData,
  ] = useState<string | undefined>(undefined);
  const [efaJsonRequestData, setEfaJsonRequestData] = useState<
    string | undefined
  >(undefined);
  const trip = props.selectedTrip;

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);
        const efaAnfrage = tarifrechnerEfaAnfrage(trip);
        setEfaJsonRequestData(efaAnfrage.dataToJSON());
        const response = await efaAnfrage.sendRequest();
        if (response) {
          setEfaAntwort(response);
        }
        const dvbAngebotsAnfrage = tarifrechnerDvbAngebotsinfoAnfrage(trip);
        setdvbAngebotsAnfrageJsonRequestData(dvbAngebotsAnfrage.dataToJSON());
        const dvbAngebotsAnfrageResponse =
          await dvbAngebotsAnfrage.sendRequest();
        if (dvbAngebotsAnfrageResponse) {
          setDvbAngebotsinfoAntwort(dvbAngebotsAnfrageResponse);
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

  const copyDVBPostManJSONToClipboard = () => {
    copyPostManJSONToClipboard(dvbAngebotsAnfrageJsonRequestData);
  };

  const copyEFAPostManJSONToClipboard = () => {
    copyPostManJSONToClipboard(efaJsonRequestData);
  };

  return (
    <>
      {isLoading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!isLoading && efaAntwort && dvbAngebotsinfoAntwort && (
        <>
          <CollapseComponent
            chevronText="EFA"
            id="collapse-tarifrechner-efa-angebotsinfo"
            textClassName="fw-bold fs-4"
            isOpen
          >
            <div className="row">
              <div className="col-sm-4">
                <div className=" card shadow-sm rounded border">
                  <div className="card-header">
                    <h5 className="card-title">
                      Tarifrechner Angebotsinfo (EFA)
                    </h5>
                  </div>
                  <Tarifangaben tarifrechnerResponse={efaAntwort} />
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
                  {efaJsonRequestData && (
                    <CollapseComponent
                      chevronText="Tarifrechner-Request (JSON)"
                      id="collapse-json-request"
                      textClassName="fw-semibold fs-5"
                    >
                      <HighlightComponent
                        code={efaJsonRequestData}
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
                      code={JSON.stringify(efaAntwort, undefined, 2)}
                      language="json"
                    />
                  </CollapseComponent>
                  <div className="d-grid">
                    <Button
                      onClick={copyEFAPostManJSONToClipboard}
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
          <CollapseComponent
            chevronText="DVB MOBI-Plattform"
            id="collapse-tarifrechner-dvb-mobi-angebotsinfo"
            textClassName="fw-bold fs-4"
          >
            <div className="row">
              <div className="col-sm-4">
                <div className=" card shadow-sm rounded border">
                  <div className="card-header">
                    <h5 className="card-title">Tarifrechner Angebotsinfo</h5>
                  </div>
                  <TarifangabenDVBMOB
                    tarifrechnerResponse={dvbAngebotsinfoAntwort}
                  />
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
                  {dvbAngebotsAnfrageJsonRequestData && (
                    <CollapseComponent
                      chevronText="Tarifrechner-Request (JSON)"
                      id="collapse-json-request"
                      textClassName="fw-semibold fs-5"
                    >
                      <HighlightComponent
                        code={dvbAngebotsAnfrageJsonRequestData}
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
                      code={JSON.stringify(
                        dvbAngebotsinfoAntwort,
                        undefined,
                        2
                      )}
                      language="json"
                    />
                  </CollapseComponent>
                  <div className="d-grid">
                    <Button
                      onClick={copyDVBPostManJSONToClipboard}
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
