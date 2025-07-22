
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import Badge from 'react-bootstrap/Badge';
import { IFAIRTIQ_REISENDER } from 'pkm-tarifrechner/build/src/tarifrechner/fairtiq/interfaces';
import Dropdown from 'react-bootstrap/Dropdown';


const REISENDE_ARRAY: IFAIRTIQ_REISENDER[] = [
    {
        typ: {
            nr: "1",
            name: "Erwachsener"
        },
    },
    {
        typ: {
            nr: "2",
            name: "Kind"
        }
    },
    {
        typ: {
            nr: "25",
            name: "Senior"
        }
    },
    {
        typ: {
            nr: "65",
            name: "Fahrrad"
        }
    },
    {
        typ: {
            nr: "66",
            name: "Hund"
        }
    }
];



export interface ReisendenComponentProps {
    reisendenliste: IFAIRTIQ_REISENDER[];
    handleChangedReisendenliste: (reisendenliste: IFAIRTIQ_REISENDER[]) => void;
}

export default function ReisendenComponent(props: ReisendenComponentProps) {
    const { reisendenliste, handleChangedReisendenliste } = props;

    // ToDo handleRemoveReisender
    function handleRemoveReisender(index: number) {
        const newReisendenliste = [...reisendenliste];
        newReisendenliste.splice(index, 1);
        handleChangedReisendenliste(newReisendenliste);
    }

    // ToDo handleSetMainReisender
    function handleSetMainReisender(index: number) {
        const newReisendenliste = [...reisendenliste];
        // Set all reisenders to not main user
        newReisendenliste.forEach((r, i) => {
            r.erweiterungsliste = [{ nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "F" }];
        });
        // Set selected reisender as main user
        newReisendenliste[index].erweiterungsliste = [{ nr: "INOUTMDM_ISTHAUPTNUTZER", wert: "T" }];
        handleChangedReisendenliste(newReisendenliste);
    }

    // handleAddReisender
    function handleAddReisender(reisender: IFAIRTIQ_REISENDER) {
        // Is reisendenliste empty? If yes, set first reisender as main reisender
        reisender.erweiterungsliste = [
            {
                nr: "INOUTMDM_ISTHAUPTNUTZER",
                wert: (reisendenliste.length === 0) ? "T" : "F"
            }
        ]
        const newReisendenliste = [...reisendenliste, reisender];
        handleChangedReisendenliste(newReisendenliste);
    }

    const AddPassengerDropdownButton = () => {
        return <Dropdown >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                <FontAwesomeIcon icon={faUserPlus} /> weitere Reisende hinzufügen
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {REISENDE_ARRAY.map((reisender, index) => (
                    <Dropdown.Item
                        key={"reisender_dropdown_" + index}
                        onClick={() => handleAddReisender(reisender)}
                    >
                        {reisender.typ?.name}
                    </Dropdown.Item>
                ))}

            </Dropdown.Menu>
        </Dropdown>
    }





    return (

        <div className="col-sm-6">
            <h2 className="my-4">
                {reisendenliste.length > 0 ? "Ausgewählte Reisende" : "Reisende auswählen"}
            </h2>
            <div className="card shadow-sm rounded">
                <div className="card-header">Reisende</div>

                <ul className="list-group list-group-flush">
                    {reisendenliste.map((reisender, index) => {
                        const istHauptnutzer = reisender.erweiterungsliste?.[0]?.wert === 'T';
                        const istVollzahler = reisender.typ?.nr === "1" || reisender.typ?.nr === "25";

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
                    })}
                    <li className="list-group-item" id="reisender_add_button">
                        <AddPassengerDropdownButton />
                    </li>
                </ul>

            </div>
        </div>

    )
}







