import React from 'react';
// import {SearchStopField} from './SearchStopField'
import { IPoint, ITrip, POI_TYPE } from 'dvbjs';
// import StopField from './StopField'
import StopBox from './StopBox';
import Routes from './Routes';
import Datetime from 'react-datetime';
// import logo from './logo.svg';
import './App.css';
import './DateTimePicker.css'
import * as moment from 'moment';
import Reisende from './Reisende';
import Tarifangebot from './Tarifangebot';
import { Ticket, Fahrgast, ITestArguments } from 'vvo-testcases';
import {savetoFile} from './saveToFile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

 interface IState {
  fromStop: IPoint | null,
  toStop:  IPoint | null,
  selectedTrip: ITrip | null,
  tripDateTime : Date,
  angebote : Ticket[][], 
  fahrgaeste: Fahrgast[],
}

// type stateKeys = "fromStop" | "toStop"
interface UseTestCaseComponentProps {
  handleExportToFile: (event: React.FormEvent<HTMLButtonElement>) => void
}

const UseTestCaseComponent = ({handleExportToFile}: UseTestCaseComponentProps) => (
  <div className="row">
    <div className="card col-sm-12 shadow-sm mb-2 rounded">
      <div className="card-body">
        <h2 className="card-title">Verwende Testfall</h2>
        <div className="row">
         <div className="col-sm-6 text-center">
              <button className="btn btn-lg btn-primary m-4" onClick={handleExportToFile}>
                  <FontAwesomeIcon icon={faFileDownload} size="lg"/><br/> 
                  Exportiere Testfall<br/>
                  <small>IVI-Format (*.xlsx)</small> 
              </button>
          </div>
          <div className="col-sm-6 text-center">
            <button className="btn btn-lg btn-info m-4" disabled>
              <FontAwesomeIcon icon={faPaperPlane} size="lg"/> <br/>
              Frage Tarifrechner an<br/>
              <small>(JSON-Request)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)


class App extends React.Component<{}, IState> {
  constructor(props:{}){
    super(props);

    // DEBUG
    const start:IPoint = {city: "Radebeul", coords: [13.6741369627676, 51.10381758791261], name: "Schildenstraße", id: "33004218", type: POI_TYPE.Stop}
    const ziel: IPoint = {
      city: "Bad Schandau",
      coords: [14.149447444887771, 50.91775830470602],
      id: "33003621",
      name: "Elbkai",
      type: POI_TYPE.Stop
    }
    // END DEBUG
    this.state = {
        fromStop: start,
        toStop: ziel,
        selectedTrip: null,
        tripDateTime: new Date(),
        angebote: [],
        fahrgaeste: [new Fahrgast(33, {nr: 1, name: "Erwachsener/Vollzahler/jedermann"})]
    };
    this.handleNewSelectedFromStop = this.handleNewSelectedFromStop.bind(this)
    this.handleResetClickForFromStop = this.handleResetClickForFromStop.bind(this)
    this.handleNewSelectedToStop = this.handleNewSelectedToStop.bind(this)
    this.handleResetClickForToStop = this.handleResetClickForToStop.bind(this)
    this.handelNewDate = this.handelNewDate.bind(this)
    this.handleSelectedTrip = this.handleSelectedTrip.bind(this)
    this.handleEditTrip = this.handleEditTrip.bind(this)
    this.handleProductsChange = this.handleProductsChange.bind(this)
    this.handleExportToFile = this.handleExportToFile.bind(this)
  }

  handleExportToFile(event: React.FormEvent<HTMLButtonElement>) {
    const testCase: ITestArguments = {
      nr: 1,
      trip: this.state.selectedTrip!,
      fahrgaeste: this.state.fahrgaeste,
      angebote: this.state.angebote
    }
    
    savetoFile(testCase)
  }

  handleNewSelectedFromStop(stop_id:IPoint) {
    // let obj :{ [key: string]: IPoint } = {};
    // obj[stateProperty] = stop_id;
    // this.setState(obj)
    this.setState({fromStop: stop_id})
  } 
  handleNewSelectedToStop(stop_id:IPoint) {
    this.setState({toStop: stop_id})
    console.log(stop_id)
  } 

  handleResetClickForToStop(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.setState({toStop: null})
  }
  handleResetClickForFromStop(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.setState({fromStop: null})
  }
  handelNewDate(value :string|moment.Moment){
    if (moment.isMoment(value)){
      this.setState({tripDateTime: value.toDate()}) 
    }
  }

  handleProductsChange(tickets: Ticket[]):void {
    
    const arrayOfTickets :Ticket[][] = []
    tickets.forEach(ticket =>{
      arrayOfTickets.push([ticket])
    })
    this.setState({angebote: arrayOfTickets})
    // console.log(tickets)
  }

  handleSelectedTrip(trip: ITrip) {
    // console.log(trip)
    this.setState({selectedTrip: trip})
  }

  handleEditTrip() {
    this.setState({selectedTrip: null})
  }
    render () {

      const isTripSelected = this.state.selectedTrip ? true : false
      
        
        return (      
        <div className="container">
          <h1>Testfallgenerator
        <small className="text-muted"> für VVO-Tarifrechner</small> </h1>
        <h2>1. Wähle eine Verbindung:</h2>
        { !isTripSelected &&
        
        <div className="row">
          
          <div className="col-sm-4">
            <StopBox 
            handleNewSelectedStop={this.handleNewSelectedFromStop}
            handleResetClick={this.handleResetClickForFromStop}
            title="Von"
            placeholder="Start"
            stop={this.state.fromStop} />
          </div>
          <div className="col-sm-4">
            <StopBox 
            handleNewSelectedStop={this.handleNewSelectedToStop}
            handleResetClick={this.handleResetClickForToStop}
            title="Nach"
            placeholder="Ziel"
            stop={this.state.toStop} />
          </div>
          <div className="col-sm-4">
            {/* <Datetime onChange={this.handelNewDate} value={this.state.tripDateTime} />  
             */}
             <div className="card shadow-sm mb-2 bg-white rounded">
                    <div className="card-header">Abfahrt</div>
                    <div className="card-body">
                      <Datetime onChange={this.handelNewDate} dateFormat="DD.MM.YYYY" timeFormat="HH:mm" value={this.state.tripDateTime}/>
                    </div>
                </div>
          </div>
        </div>}
          < Routes 
            fromStop={this.state.fromStop}
            toStop={this.state.toStop}
            selectedTrip={this.state.selectedTrip}
            dateTime={this.state.tripDateTime}
            handleSelectedTrip={this.handleSelectedTrip}
            handleEditTrip={this.handleEditTrip}/>
      
      {isTripSelected && 
      <Reisende/>}
      {isTripSelected &&
      <Tarifangebot handleProductsChange={this.handleProductsChange}/>}
      {isTripSelected &&
      <UseTestCaseComponent handleExportToFile={this.handleExportToFile} />}
      </div>
      )
    }
}

export default App;
