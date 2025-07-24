import { IFAIRTIQ_ANFRAGE_ANTWORT } from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import { Button } from "react-bootstrap";

export interface PreviousRequestComponentProps {
  previousRequests: IFAIRTIQ_ANFRAGE_ANTWORT[];
  handleResetPreviousCiCoRequests: () => void;
}

export default function PreviousRequestComponent(
  props: PreviousRequestComponentProps,
) {
  const { previousRequests, handleResetPreviousCiCoRequests } = props;

  return (
    <div className="col-sm-6">
      <h2 className="my-4">Hinterlegte Fahrten</h2>
      <div className="card shadow-sm rounded">
        <div className="card-header">Vergangene Fahrten</div>

        <ul className="list-group list-group-flush">
          {/* {previousTrips.map((verbindung, index) => {
            return (
                <li className="list-group-item" key={"reisender_li_" + index}>
                    <Badge pill bg="primary" className="mx-1">{index + 1}.</Badge>
                    <span className="fb">{reisender.typ?.name}</span>
                    {istHauptnutzer && <span className="badge mx-1 text-bg-success">Hauptnutzer</span>}


                    <span className="float-end">
                        {!istHauptnutzer && istVollzahler && <button type="button" className="btn btn-secondary btn-sm me-1" onClick={e => handleSetMainReisender(index)}> <FontAwesomeIcon icon={faPen} className="mr-1" /> Als Hauptnutzer festlegen</button>}
                        <button type="button" className="btn btn-danger btn-sm" onClick={e => handleRemoveReisender(index)}> <FontAwesomeIcon icon={faTrash} /></button>
                    </span>
                </li>

            )
        })} */}

          <li className="list-group-item" id="number_of_trips">
            {previousRequests.length} Fahrten vorhanden.
          </li>
          <li className="list-group-item" id="reset_previous_trips_button">
            <Button
              variant="secondary"
              onClick={handleResetPreviousCiCoRequests}
              disabled={previousRequests.length == 0}
            >
              {" "}
              Alle Fahrten zurücksetzen
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
