import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash,faPlus } from '@fortawesome/free-solid-svg-icons'

interface IProps {

}

interface IState{

}

class Reisende extends React.Component<IProps> {
    // constructor(props:IProps){
    //     super(props)
    // }

    render(){
        return (
            <div className="row">
               <div className="card col-sm-12 shadow-sm mb-2 rounded">
                  <div className="card-body">
                  <h2 className="card-title">Wähle Reisende:</h2>
                      <b>Reisende:</b><br/>
                  <p>1 Erwachsener   <button type="button" className="btn btn-secondary btn-sm" disabled> <FontAwesomeIcon icon={faPen}  /> Ändern</button> 
                  <button type="button" className="btn btn-danger btn-sm" disabled> <FontAwesomeIcon icon={faTrash}  /> Löschen </button> </p>
                 <p> <button type="button" className="btn btn-success btn-sm" disabled> <FontAwesomeIcon icon={faPlus}  /> weitere Reisende hinzufügen </button></p>
                  </div>
                  
               </div>
               
            </div>
        )
    }

}

export default Reisende 


