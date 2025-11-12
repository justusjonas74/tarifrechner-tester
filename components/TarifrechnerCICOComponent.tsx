import { ITrip } from "dvbjs";

import { ClipboardIcon } from "@phosphor-icons/react/dist/csr/Clipboard";
import HighlightComponent from "./HighlightComponent";
import { Button } from "react-bootstrap";

import { useEffect, useState } from "react";
import { tarifrechnerFairtiqAnfrage } from "@/lib/tarifrechnerAnfrage";
import CollapseComponent from "./CollapseComponent";
import { toast } from "react-toastify";
import { optimizeJSONForPostman } from "@/lib/postman";
import copyTextToClipboard from "@/lib/copyToClipboard";
import {
  IFAIRTIQ_ANFRAGE_ANTWORT,
  IFAIRTIQ_ANFRAGELISTE,
  IFAIRTIQ_ANTWORTLISTE,
  IFAIRTIQ_BERECHTIGUNG,
  IFAIRTIQ_REISENDER,
} from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import CicoTarifangaben from "./CicoTarifangaben";

interface TarifrechnerComponentProps {
  selectedTrip: ITrip;
  berechtigungsliste: IFAIRTIQ_BERECHTIGUNG[];
  reisendenliste: IFAIRTIQ_REISENDER[];
  handleSaveCiCoRequest: (request: IFAIRTIQ_ANFRAGE_ANTWORT) => void;
  previousCiCoRequests: IFAIRTIQ_ANFRAGE_ANTWORT[];
}

export default function TarifrechnerCiCoComponent(
  props: TarifrechnerComponentProps,
) {
  const trip = props.selectedTrip;
  const berechtigungsliste = props.berechtigungsliste;
  const reisendenliste = props.reisendenliste;
  const previousCiCoRequests = props.previousCiCoRequests;
  const [fairtiqAntwort, setFairtiqAntwort] = useState<
    IFAIRTIQ_ANTWORTLISTE | undefined
  >(undefined);

  const [fairtiqAnfrage, setFairtiqAnfrage] = useState<
    IFAIRTIQ_ANFRAGELISTE | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [fairtiqJsonRequestData, setFairtiqJsonRequestData] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);
        const fairtiqAnfrage = tarifrechnerFairtiqAnfrage(
          trip,
          reisendenliste,
          previousCiCoRequests,
          berechtigungsliste
        );
        // toast.info(`${previousCiCoRequests.length} Verbindungen übergeben.`);
        // toast.info(`${fairtiqAnfrage.data.anfrageliste[0].verbindungsliste.length} Verbindungen in Anfrage.`);
        setFairtiqAnfrage(fairtiqAnfrage.data);
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
        setIsLoading(false);
      }
    };
    sendRequest();
  }, [trip, reisendenliste, berechtigungsliste, previousCiCoRequests]);

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

  const saveCiCoRequest = () => {
    if (fairtiqAntwort && fairtiqAnfrage) {
      const fairtiqAntwortData: IFAIRTIQ_ANFRAGE_ANTWORT = {
        anfrage: fairtiqAnfrage.anfrageliste[0],
        antwort: fairtiqAntwort.antwortliste[0],
      };
      props.handleSaveCiCoRequest(fairtiqAntwortData);
    } else if (!fairtiqAntwort) {
      toast.error("Keine FAIRTIQ-Antwort zum Speichern vorhanden.");
    } else if (!fairtiqAnfrage) {
      toast.error("Keine FAIRTIQ-Anfrage zum Speichern vorhanden.");
    } else {
      toast.error(
        "Keine FAIRTIQ-Antwort oder Anfrage zum Speichern vorhanden.",
      );
    }
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
                  <CicoTarifangaben
                    tarifrechnerResponse={fairtiqAntwort}
                    handleSaveCiCoRequest={saveCiCoRequest}
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
                      <ClipboardIcon className="mx-2" />
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
