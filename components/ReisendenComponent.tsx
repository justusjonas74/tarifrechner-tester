
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash"
import { PencilIcon } from "@phosphor-icons/react/dist/csr/Pencil"
import { UserPlusIcon } from "@phosphor-icons/react/dist/csr/UserPlus"
import { TicketIcon } from "@phosphor-icons/react/dist/csr/Ticket"
import Badge from "react-bootstrap/Badge";
import { IFAIRTIQ_BERECHTIGUNG, IFAIRTIQ_REISENDER } from "pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces";
import Dropdown from "react-bootstrap/Dropdown";
import ZeitkartenModal from "./ZeitkartenModal";
import { useState } from "react";

const REISENDE_ARRAY: IFAIRTIQ_REISENDER[] = [
  {
    typ: {
      nr: "1",
      name: "Erwachsener",
    },
  },
  {
    typ: {
      nr: "2",
      name: "Kind",
    },
  },
  {
    typ: {
      nr: "25",
      name: "Senior",
    },
  },
  {
    typ: {
      nr: "65",
      name: "Fahrrad",
    },
  },
  {
    typ: {
      nr: "66",
      name: "Hund",
    },
  },
];

export interface ReisendenComponentProps {
  reisendenliste: IFAIRTIQ_REISENDER[];
  berechtigungsliste: IFAIRTIQ_BERECHTIGUNG[];
  handleChangedReisendenliste: (reisendenliste: IFAIRTIQ_REISENDER[]) => void;
  handleChangedBerechtigungsliste: (berechtigungsliste: IFAIRTIQ_BERECHTIGUNG[]) => void;
}

function AddPassengerDropdownButton(props: { handleAddReisender: (reisender: IFAIRTIQ_REISENDER) => void }) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
        <UserPlusIcon size="20" /> weitere Reisende hinzufügen
      </Dropdown.Toggle >

      <Dropdown.Menu>
        {REISENDE_ARRAY.map((reisender, index) => (
          <Dropdown.Item
            key={"reisender_dropdown_" + index}
            onClick={() => props.handleAddReisender(reisender)}
          >
            {reisender.typ?.name}
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.ItemText className="text-body-secondary">
          <small>
            <span className="fw-bold">Info:</span> In Phase 1 kann nur mit einem Reisenden angefragt werden.
          </small>
        </Dropdown.ItemText>
      </Dropdown.Menu>
    </Dropdown >
  );
};

export default function ReisendenComponent(props: ReisendenComponentProps) {
  const { reisendenliste, handleChangedReisendenliste } = props;
  const [showZeitkartenModal, setShowZeitkartenModal] = useState(false);

  function handleRemoveReisender(index: number) {
    const newReisendenliste = [...reisendenliste];
    newReisendenliste.splice(index, 1);
    handleChangedReisendenliste(newReisendenliste);
  }
  function handleAddZeitkarte(_index: number) {
    setShowZeitkartenModal(true);
  }

  function handleChangedBerechtigungsliste(berechtigungsliste: IFAIRTIQ_BERECHTIGUNG[]) {
    setShowZeitkartenModal(false);
    props.handleChangedBerechtigungsliste(berechtigungsliste);
  }

  function handleSetMainReisender(index: number) {
    const newReisendenliste = [...reisendenliste];
    // Set all reisenders to not main user
    newReisendenliste.forEach((r) => {
      r.erweiterungsliste = [{ nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "F" }];
    });
    // Set selected reisender as main user
    newReisendenliste[index].erweiterungsliste = [
      { nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "T" },
    ];
    handleChangedReisendenliste(newReisendenliste);
  }
  function getIndexOfHauptreisender() {
    return reisendenliste.findIndex(
      (r) => r.erweiterungsliste?.[0]?.wert === "T"
    );
  }

  // handleAddReisender
  function handleAddReisender(reisender: IFAIRTIQ_REISENDER) {
    // Is reisendenliste empty? If yes, set first reisender as main reisender
    reisender.erweiterungsliste = [
      {
        nr: "INOUTMDM_ISTHAUPTNUTZER",
        wert: reisendenliste.length === 0 ? "T" : "F",
      },
    ];
    const newReisendenliste = [...reisendenliste, reisender];
    handleChangedReisendenliste(newReisendenliste);
  }

  return (
    <div className="col-sm-6">
      <h2 className="my-4">
        {reisendenliste.length > 0
          ? "Ausgewählte Reisende"
          : "Reisende auswählen"}
      </h2>
      <div className="card shadow-sm rounded">
        <div className="card-header">Reisende</div>

        <ul className="list-group list-group-flush">
          {reisendenliste.map((reisender, index) => {
            const istHauptnutzer =
              reisender.erweiterungsliste?.[0]?.wert === "T";
            const istVollzahler =
              reisender.typ?.nr === "1" || reisender.typ?.nr === "25";
            const hatBerechtigungen = props.berechtigungsliste.filter(berechtigung => berechtigung.reisendenbezug.includes(index + 1)).length > 0;

            return (
              <li className="list-group-item" key={"reisender_li_" + index}>
                <Badge pill bg="primary" className="mx-1">
                  {index + 1}.
                </Badge>
                <span className="fb">{reisender.typ?.name}</span>
                {istHauptnutzer && (
                  <span className="badge mx-1 text-bg-success">
                    Hauptnutzer
                  </span>
                )}

                {hatBerechtigungen && (
                  <span className="badge mx-1 text-bg-info">
                    Zeitkarte hinterlegt
                  </span>
                )}
                <span className="float-end">
                  {!istHauptnutzer && istVollzahler && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm me-1"
                      onClick={(_e) => handleSetMainReisender(index)}
                    >
                      {" "}
                      <PencilIcon size="20" className="mr-1" /> Als
                      Hauptnutzer festlegen
                    </button>
                  )}
                  {/* Aktuell kann nur der Haupnutzer eine Zeitkarte hinterlegen. */}
                  {istHauptnutzer && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm mx-1"
                      onClick={(_e) => handleAddZeitkarte(index)}
                    >
                      {" "}
                      <TicketIcon size="20" /> {props.berechtigungsliste.length !== 0 ? "Zeitkarte ändern" : "Zeitkarte hinterlegen"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(_e) => handleRemoveReisender(index)}
                  >
                    {" "}
                    <TrashIcon size="20" />
                  </button>
                </span>
              </li>
            );
          })}
          <li className="list-group-item" id="reisender_add_button">
            <AddPassengerDropdownButton handleAddReisender={handleAddReisender} />
          </li>
        </ul>
      </div>
      <ZeitkartenModal
        showModal={showZeitkartenModal}
        handleCloseModal={() => setShowZeitkartenModal(false)}
        reisenderIndex={getIndexOfHauptreisender()}
        handleUpdateBerechtigungsliste={handleChangedBerechtigungsliste}
        berechtigungsliste={props.berechtigungsliste}
      />
    </div>
  );
}
