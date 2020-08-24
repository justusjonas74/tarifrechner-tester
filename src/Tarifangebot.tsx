import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPen, faTrash,faPlus } from '@fortawesome/free-solid-svg-icons'
import Select, { ValueType, ActionMeta, OptionsType } from 'react-select'
import {Ticket, ITicketItems} from 'vvo-testcases'
// import { Preisstufe, Produkt } from 'vvo-testcases/build/src/tickets'

interface IProps {
    handleProductsChange: (tickets: Ticket[]) => void
}

interface IState{

}


class Tarifangebot extends React.Component<IProps> {
    // constructor(props:IProps){
    //     super(props)
    // }


    tickets = Ticket.getAllProducts()
    
    handleNewSelectedProducts(value: OptionsType<ITicketItems>, actionMeta: ActionMeta<ITicketItems>): void{
        if (value) {
            const angebot = value.map((item) => {
                return new Ticket(item.produkt, item.preisstufe)
            })
            this.props.handleProductsChange(angebot)
        }
        
    }

    render(){
        const options = this.tickets 
        return (
            <div>


            <div>
                
            </div>
            <div className="row">
               <div className="card col-sm-12 shadow-sm mb-2 rounded">
                  <div className="card-body">
                    <h2 className="card-title">SOLL-Tarifangebot</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{width: "15%"}}>
                                    Reisende
                                </th>
                                <th style={{width: "85%"}}>
                                    Tarifangebot
                                </th>
                            </tr>
                        </thead>
                        <tr>
                            <td>Reisender 1</td>
                            <td><Select options={options} isMulti onChange={(selectedOption: ValueType<ITicketItems>, e: ActionMeta<ITicketItems>) => this.handleNewSelectedProducts((selectedOption as ITicketItems[]), e)}/></td>
                        </tr> 

                    </table>
                  </div>
                  
               </div>
               
            </div>
            </div>
        )
    }

}

export default Tarifangebot 


