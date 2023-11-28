
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'



export default function Reisende() {



    return (
        <div className="row">
            <div className="card col-sm-12 shadow-sm mb-2 rounded">
                <div className="card-body">
                    <h2 className="card-title">Wähle Reisende:</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    Reisende
                                </th>
                                <th>
                                    Fahrgasttyp
                                </th>
                                <th>
                                    Aktionen
                                </th>
                            </tr>
                        </thead>
                        <tr>
                            <td>Reisender 1</td>
                            <td>Erwachsener/Vollzahler</td>
                            <td><button type="button" className="btn btn-secondary btn-sm" disabled> <FontAwesomeIcon icon={faPen} /> Ändern</button>
                                <button type="button" className="btn btn-danger btn-sm" disabled> <FontAwesomeIcon icon={faTrash} /> Löschen </button></td>
                        </tr>
                        <tr>
                            <td><button type="button" className="btn btn-success btn-sm" disabled> <FontAwesomeIcon icon={faPlus} /> weitere Reisende hinzufügen </button></td>
                            <td></td>
                            <td></td>
                        </tr>

                    </table>
                </div>

            </div>

        </div>
    )
}




