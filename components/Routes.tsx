import React from "react";
import { IPoint, IRoute,route, ITrip } from 'dvbjs';
import RouteView from "./RouteView";
// import moment from "moment";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'



interface IState {
    fetchedRoutes: IRoute | null
    isLoading: boolean
}

interface IProps {
    fromStop: IPoint | null,
    toStop: IPoint| null,
    viaStop: IPoint| null,
    selectedTrip: ITrip | null
    dateTime: Date
    handleSelectedTrip: (trip:ITrip) => void
    handleEditTrip: ()=>void
}

class Routes extends React.Component<IProps, IState> {
    constructor(props:IProps){
        super(props)
        this.state = {
            fetchedRoutes: null,
            isLoading:false
        }
    }
    fetchRoutes(){
         
        const from = this.props.fromStop
        const to = this.props.toStop 
        const via = this.props.viaStop ? this.props.viaStop!.id : undefined
        const date = this.props.dateTime
        //DEBUG
        console.log(this.props.viaStop)
        // console.log(via)
        //END DEBUG
        // const timezoneOffset = datetimeLocale.getTimezoneOffset()
        // const isoDate = moment(datetimeLocale).add(-timezoneOffset, 'm').toDate()
        // const isoDate = datetimeLocale
        
        // console.log(date.toISOString())
        if (from && to) {    
            this.setState({isLoading: true})        
            route(from!.id,to!.id, date, false, undefined , via)
            .then(route => {
                this.setState({fetchedRoutes: route,
                isLoading:false})
                // console.log(route)
            })
            .catch(err=>console.log)
        }        
    }
    componentDidUpdate(prevProps:IProps){
        if (
            this.props.toStop !== prevProps.toStop || 
            this.props.fromStop !== prevProps.fromStop || 
            this.props.dateTime !== prevProps.dateTime ||
            this.props.viaStop !== prevProps.viaStop) {
            this.fetchRoutes()
        }
    }

    componentDidMount(){
        if (this.props.toStop && this.props.fromStop) {
            this.fetchRoutes()
        }

    }

    render(){
        const fetchedRoutes = this.state.fetchedRoutes; 
        
        

        let content;
        if (this.props.selectedTrip) {
            const trip = this.props.selectedTrip
            content = <RouteView trip={trip} handleSelectedTrip={(e)=>{}} selectable={false} handleEditTrip={this.props.handleEditTrip}/>
        } else {
            if (this.props.dateTime && this.props.fromStop && this.props.toStop) {
                if (this.state.isLoading) {
                  const spinner = <div className="LoadingSpinner text-center"><span className="align-middle"><FontAwesomeIcon icon={faSpinner} size="3x" pulse={true}/></span></div>
                    content = spinner
                } else {
                  const routeItems = fetchedRoutes?.trips.map((trip, index) =>
                  <RouteView selectable={true} trip={trip} key={index} handleSelectedTrip={this.props.handleSelectedTrip} handleEditTrip={()=>{}} />
                  );
                  content = routeItems
                }
              } else {
                content = <></>
              }
        }
        

        return (
            <div>
                {content}
            </div>
          
        )
    }
}

export default Routes