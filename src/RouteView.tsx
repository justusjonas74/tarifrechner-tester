import React, { FunctionComponent } from 'react'
import { ITrip, IStopLocation, INode } from 'dvbjs'
import moment from 'moment';
import './RouteView.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

moment.locale('de');

// interface IState{
// }
interface IProps{
    trip: ITrip,
    handleSelectedTrip: (trip:ITrip) => void,
    handleEditTrip: ()=> void
    selectable: boolean
}
// interface LineItemProps {
//     node: INode
// }

const NodeItem : FunctionComponent<{node:INode}> = ({node}) => {
    let modeImage : JSX.Element
    if (node.mode && node.mode!.iconUrl) {
       modeImage = <img src ={node.mode!.iconUrl} alt={node.mode.title} className="nodeItemImage"/>
    }  else {
        modeImage = <></>;
    }
    const lineName = node.line
    return (
        <span>
            {modeImage}{lineName}
        </span>
    )
}

const LineItems : FunctionComponent<{trip:ITrip}> = ({trip}) => {
    let lines : JSX.Element[] = []
    trip.nodes.forEach((node, index) =>{
        if ((node.mode !== undefined) && 
            (node.mode!.name !== "Footpath") && 
            (node.mode!.name !== "StairsUp") &&
            (node.mode!.name !== "StairsDown")
            ) {
            lines.push(<NodeItem node={node} key={index} />)
            if (index < trip.nodes.length - 1 ) {
                lines.push(<span> &#10095; </span>)
            }
        }
    })
    return (
        <React.Fragment>
            {lines}
        </React.Fragment>)
}

const StopItem : FunctionComponent<{stopLocation: IStopLocation|undefined}> = ({stopLocation}) =>  {
    if (stopLocation) {
        return ( 
            <span>{stopLocation!.city} - {stopLocation!.name} </span> 
        )
    } else {
        return (<span>unknown</span>)
    }
} 


class RouteView extends React.Component<IProps> {
    // constructor(props:IProps){
    //     super(props)
    // }
    constructor(props:IProps){
        super(props)
        this.handleSelectRoute = this.handleSelectRoute.bind(this)
        this.handleEditTrip = this.handleEditTrip.bind(this)
    }
    
    formatDate(stopLocation?: IStopLocation) : string {
        if (stopLocation) {
            const format = "HH:mm"
            const dateString = moment(stopLocation!.time).format(format)
            return dateString
        } else {
            return "Keine Zeitangabe"
        }
    } 
    

    handleSelectRoute(event: React.FormEvent<HTMLButtonElement>) :void {
        this.props.handleSelectedTrip(this.props.trip)
    }
    handleEditTrip(event: React.FormEvent<HTMLButtonElement>) :void {
        this.props.handleEditTrip()
    }
    

    render(){
        const trip = this.props.trip
        const departure = this.formatDate(trip.departure)
        const arrival = this.formatDate(trip.arrival)
        const dauer =  moment(new Date(0,0,0,0,trip.duration)).format("HH:mm")
        const umstiege = trip.interchanges 
        const isSelectable = this.props.selectable
        
        return (
            <div className="row">
                
                <div className="card col-sm-12 shadow-sm mb-2 rounded">
                    {/* <h4 className="card-header">{this.props.title}</h4> */}
                    <div className="card-body">
                       <table className="routeViewTable">
                           <thead>
                               <tr>
                                    <th className="bhf">Bahnhof/Haltestelle</th>
                                    <th className="zeit">Zeit</th>
                                    <th className="dauer">Dauer	</th>
                                    <th className="umst">Umstiege</th>
                                    <th className="prod">Produkte</th>
                                    <th className="select"></th>
                               </tr>

                           </thead>
                          <tbody>
                          <tr>
                               <td>
                               <StopItem stopLocation={trip.departure}/><br/>
                               <StopItem stopLocation={trip.arrival}/>
                               </td>
                               <td>
                                   {departure}<br/>
                                   {arrival}
                               </td>
                               <td>
                                   {/* DAUER */}
                                   {dauer}
                               </td>
                               <td>
                                   {/* Umstiege */}
                                   {umstiege}
                               </td>
                               <td>
                                   {/* Linien */}
                                   <LineItems trip={trip} />
                               </td>
                               <td> 
                                   {/* Preis */}
                                   { isSelectable 
                                   ? <button type="button" className="stretched-link btn btn-primary" value="" onClick={this.handleSelectRoute}> auswählen</button> : 
                                   <button type="button" className="btn btn-secondary btn-sm" value="" onClick={this.handleEditTrip}> <FontAwesomeIcon icon={faPen}  /> Ändern </button> }

                               </td>
                           </tr>
                          </tbody>
                         
                       </table>
                    </div>
                </div>
               
            </div>
            )
        }
        
    }
    
    export default RouteView 
    
    
    