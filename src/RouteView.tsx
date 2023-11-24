import React, { FunctionComponent } from 'react'
import { ITrip, IStopLocation, INode, IStop, IMode } from 'dvbjs';
import moment from 'moment';
import './RouteView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faChevronDown, faChevronUp, faCheckSquare } from '@fortawesome/free-solid-svg-icons'

moment.locale('de');

interface IState{
    showDetails: boolean
}

interface IProps{
    trip: ITrip,
    handleSelectedTrip: (trip:ITrip) => void,
    handleEditTrip: ()=> void
    selectable: boolean
}
// interface LineItemProps {
//     node: INode
// }

interface INodeTableRowsItemsProps {
    stop: IStopLocation | IStop | undefined
    stopType: "DEPARTURE" | "ARRIVAL" | "STOPS",
    mode?: IMode,
    line: string,
    direction?: string,

} 

const NodeTableRowsItems = ({stop,stopType, mode, line, direction} : INodeTableRowsItemsProps) => {
    if (!stop) {
        return (<></>)
    } else {
        const stopName = `${stop!.city} - ${stop!.name}`
        let abfahrt: string = ""
        // if ('time' in stop) {
        //     abfahrt = stop.time.toLocaleTimeString()
        // }
        if (('time' in stop) && (stopType === "ARRIVAL")){
            abfahrt = RouteView.formatDate(stop.time) 
        }
        if (('time' in stop) && (stopType === "DEPARTURE")){
            abfahrt = RouteView.formatDate(stop.time) 
        }
        if (('departure' in stop) && (stopType === "STOPS")){
            abfahrt = RouteView.formatDate(stop.departure)
        }
        
        const gleis = stop.platform && stopType !== "STOPS" ? stop.platform!.name : "-"

        const richtung = direction ? direction! : ""
        const linie = <NodeItem mode={mode} line={line}/>

        return (
            <tr>
               
                <td>
                    {(stopType === "STOPS") ? abfahrt : <b>{abfahrt}</b> }
                </td>
                <td>
                    {(stopType === "STOPS") ? stopName : <b>{stopName}</b> }
                </td>
                <td>
                    {gleis}
                </td>
                <td>
                    {(stopType === "DEPARTURE") ? linie : ""}
                </td>
                <td>
                    {(stopType === "DEPARTURE") && richtung}
                </td>
            </tr>
        )
    }

    
}

interface INodeTableRowsProps {
    node: INode
}

const NodeTableRows = ({node}:INodeTableRowsProps) => {
    const departureRow = <NodeTableRowsItems stop={node.departure} stopType="DEPARTURE" line={node.line} mode={node.mode} direction={node.direction}/>
    const arrivalRow =  <NodeTableRowsItems stop={node.arrival} line={node.line} stopType="ARRIVAL"/>
    const stopRows = node.stops.map((stop,index) => {
        if ((index !== 0) && (index !== node.stops.length - 1)) {
        return <NodeTableRowsItems line={node.line} stop={stop} stopType="STOPS"/>
        } else {
            return <></>
        }
        
    })  
    const rows = [departureRow, stopRows, arrivalRow]
    return (
        <>
        {rows}
        </>
    )
}

interface IRouteDetailsProps {
    RouteNodes: INode[]
}
class RouteDetails extends React.Component<IRouteDetailsProps> {

    render(){
        const nodeViews = this.props.RouteNodes.map((node, index) => {
            return <NodeTableRows node={node} key={index}/>
        })
        return (
           <div className="table-responsive">
 <table className="table table-sm">
               
               <thead>
               <tr>
                   <th>Zeit</th>
                   <th>Haltestelle</th>
                   <th>Gleis</th>
                   <th>Linie</th>
                   <th>Richtung</th>
                   
                   </tr>  
               </thead>
          
           <tbody>{nodeViews}</tbody>
           
       </table>
   
           </div>
           )

    }

}

const NodeItem : FunctionComponent<{mode?: IMode, line: string }> = ({mode,line}) => {
    let modeImage : JSX.Element
    if (mode && mode!.iconUrl) {
       modeImage = <img src ={mode!.iconUrl} alt={mode.title} className="nodeItemImage"/>
    }  else {
        modeImage = <></>;
    }
    const lineName = line
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
            lines.push(<NodeItem mode={node.mode} line={node.line} key={index} />)
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


class RouteView extends React.Component<IProps, IState> {
    // constructor(props:IProps){
    //     super(props)
    // }
    constructor(props:IProps){
        super(props)
        this.state = {
            showDetails: false
        }
        this.handleSelectRoute = this.handleSelectRoute.bind(this)
        this.handleEditTrip = this.handleEditTrip.bind(this)
        this.toggleShowDetails = this.toggleShowDetails.bind(this)
    }
    
    static formatDate(date: Date) : string {
        // if (stopLocation) {
            const format = "HH:mm"
            const dateString = moment(date).format(format)
            return dateString
        // } else {
        //     return "Keine Zeitangabe"
        // }
    } 
    toggleShowDetails(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        this.setState({showDetails: !this.state.showDetails})
    }
    

    handleSelectRoute(event: React.FormEvent<HTMLButtonElement>) :void {
        this.props.handleSelectedTrip(this.props.trip)
    }
    handleEditTrip(event: React.FormEvent<HTMLButtonElement>) :void {
        this.props.handleEditTrip()
    }
    

    render(){
        const showDetails = this.state.showDetails
        const trip = this.props.trip

        const departure = trip.departure ? RouteView.formatDate(trip.departure!.time) : "Keine Zeitangabe"
        const arrival = trip.arrival ? RouteView.formatDate(trip.arrival!.time) : "Keine Zeitangabe"
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
                               <StopItem stopLocation={trip.arrival}/><br/>
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
                                   {/* Buttons */}
                                   
                                   { isSelectable 
                                   ? <button type="button" className="m-1 btn btn-primary" value="" onClick={this.handleSelectRoute}> <FontAwesomeIcon icon={faCheckSquare} /> auswählen</button> : 
                                   <button type="button" className="m-1 btn btn-secondary btn-sm" value="" onClick={this.handleEditTrip}> <FontAwesomeIcon icon={faPen}  /> Ändern </button> }
                                   <button type="button" className="m-1 btn btn-sm btn-secondary" onClick={this.toggleShowDetails}>
                                   <FontAwesomeIcon  icon={showDetails ? faChevronUp : faChevronDown }  />
                                    Zwischenhalte
                                   </button>

                               </td>
                           </tr>
                          </tbody>
                         
                       </table>
                        {showDetails && 
                        <RouteDetails RouteNodes={trip.nodes} />}
                    </div>
                </div>
               
            </div>
            )
        }
        
    }
    
    export default RouteView 
    
    
    