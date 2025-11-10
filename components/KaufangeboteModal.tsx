import { useState, useEffect } from "react";

import { SpinnerIcon } from "@phosphor-icons/react/dist/csr/Spinner"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import CollapseComponent from "./CollapseComponent";
import HighlightComponent from "./HighlightComponent";

import { tarifrechnerDvbKaufangeboteNachEingabedaten } from "@/lib/tarifrechnerAnfrage";
import VdvEinheitslayout from "./VdvEinheitslayout";
import { IEINGABEDATEN } from "pkm-tarifrechner/build/src/tarifrechner/generic/interfaces";
import { IANTWORTLISTE_DVBMOB_ANGEBOTSINFO_NACH_VERBINDUNG } from "pkm-tarifrechner/build/src/tarifrechner/dvb-mobi/interfaces";

interface IKaufangeboteModalProps {
  handleCloseFn: () => void;
  eingabedaten: IEINGABEDATEN | undefined;
}
function KaufangeboteModal(props: IKaufangeboteModalProps) {
  // const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      // setShow(true);
      sendRequest(eingabedaten);
    } else {
      // setShow(false);
    }
  }, [eingabedaten]);

  const handleClose = () => props.handleCloseFn();

  return (
    <>
      <Modal show={!!eingabedaten} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Kaufangebote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading &&
            antwortJSON?.antwortliste?.[0] &&
            Object.keys(antwortJSON.antwortliste[0]).length === 0 && (
              <div className="alert alert-warning text-center">
                <strong>Keine Kaufangebote verfügbar.</strong>
              </div>
            )}
          {isLoading && (
            <div className="LoadingSpinner text-center">
              <span className="align-middle">
                <SpinnerIcon size={48} className="spin" />
              </span>
            </div>
          )}
          <div className="row">
            {antwortJSON?.antwortliste?.[0]?.ticketdatenliste?.[0]?.ausgabedaten
              ?.vdveinheitslayout && (
                <div className="col-md-3 ">
                  <VdvEinheitslayout daten={antwortJSON} />
                </div>
              )}
            <div className="col-md-9">
              {!isLoading && anfrageJSON && (
                <>
                  <CollapseComponent
                    chevronText="Anfragedaten an Tarifrechner"
                    id="collapse-json-request-anfragedatenAnTarifrechner"
                    textClassName="fw-semibold fs-5"
                  >
                    <HighlightComponent
                      // code={JSON.stringify(anfrageJSON, undefined, 2)}
                      code={anfrageJSON}
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
            </div>
          </div>
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
