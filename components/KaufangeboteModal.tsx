import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG,
  IEINGABEDATEN,
} from "pkm-tarifrechner/build/src/tarifrechner/interfaces";
import CollapseComponent from "./CollapseComponent";
import HighlightComponent from "./HighlightComponent";
import { DVBMOB_KAUFANGEBOTE_NACH_EINGABEDATEN } from "pkm-tarifrechner";
import { tarifrechnerDvbKaufangeboteNachEingabedaten } from "@/lib/tarifrechnerAnfrage";

interface IKaufangeboteModalProps {
  handleCloseFn: () => void;
  eingabedaten: IEINGABEDATEN | undefined;
}
function KaufangeboteModal(props: IKaufangeboteModalProps) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { eingabedaten } = props;
  const [anfrageJSON, setAnfrageJSON] = useState<string | undefined>(undefined);
  const [antwortJSON, setAntwortJSON] = useState<
    IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG | undefined
  >(undefined);

  useEffect(() => {
    const sendRequest = async (data: IEINGABEDATEN) => {
      setIsLoading(true);
      const anfrage = tarifrechnerDvbKaufangeboteNachEingabedaten(data!);
      setAnfrageJSON(anfrage.dataToJSON());
      const response = await anfrage.sendRequest();
      setAntwortJSON(response);
      setIsLoading(false);
    };

    if (eingabedaten) {
      setShow(true);
      sendRequest(eingabedaten);
    } else {
      setShow(false);
    }
  }, [eingabedaten]);

  const handleClose = () => props.handleCloseFn();

  return (
    <>
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Kaufangebote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && (
            <div className="LoadingSpinner text-center">
              <span className="align-middle">
                <FontAwesomeIcon icon={faSpinner} size="3x" pulse={true} />
              </span>
            </div>
          )}
          {!isLoading && (
            <>
              <CollapseComponent
                chevronText="Anfragedaten an Tarifrechner"
                id="collapse-json-request-anfragedatenAnTarifrechner"
                textClassName="fw-semibold fs-5"
              >
                <HighlightComponent
                  code={JSON.stringify(anfrageJSON, undefined, 2)}
                  language="json"
                />
              </CollapseComponent>
              <CollapseComponent
                chevronText="Antwortdaten an Tarifrechner"
                id="collapse-json-request-antwortdatenAnTarifrechner"
                textClassName="fw-semibold fs-5"
              >
                <HighlightComponent
                  code={JSON.stringify(antwortJSON, undefined, 2)}
                  language="json"
                />
              </CollapseComponent>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Schließen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KaufangeboteModal;
