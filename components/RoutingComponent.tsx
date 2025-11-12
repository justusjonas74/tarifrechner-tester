import dynamic from 'next/dynamic'

const Datetime = dynamic(() => import('react-datetime'), { ssr: false })

import { IPoint, ITrip } from "dvbjs";
import moment from "moment";
import { useState } from "react";
// import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import CollapseComponent from "./CollapseComponent";
import StopBox from "./StopBox";
import Routes from "./Routes";

interface RoutingComponentProps {
  handleChangedTrip: (trip: ITrip | null) => void;
  selectedTrip: ITrip | null;
}

export default function RoutingComponent(props: RoutingComponentProps) {
  const [fromStop, setFromStop] = useState<IPoint | null>(null);
  const [toStop, setToStop] = useState<IPoint | null>(null);
  const [viaStop, setViaStop] = useState<IPoint | null>(null);
  const [tripDateTime, setTripDateTime] = useState<Date>(new Date());

  const handleSelectedTrip = (trip: ITrip) => {
    props.handleChangedTrip(trip);
  };

  const handleEditTrip = () => {
    props.handleChangedTrip(null);
  };

  const handleNewSelectedFromStop = (stop_id: IPoint) => {
    setFromStop(stop_id);
  };
  const handleNewSelectedToStop = (stop_id: IPoint) => {
    setToStop(stop_id);
  };
  const handleNewSelectedViaStop = (stop_id: IPoint) => {
    setViaStop(stop_id);
  };

  const handleResetClickForToStop = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setToStop(null);
  };
  const handleResetClickForFromStop = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setFromStop(null);
  };
  const handleResetClickForViaStop = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setToStop(null);
  };

  const handelNewDate = (value: string | moment.Moment) => {
    if (moment.isMoment(value)) {
      setTripDateTime(value.toDate());
    }
  };
  return (
    <>
      {!props.selectedTrip && (
        <>
          <div className="row">
            <div className="col-sm-4">
              <StopBox
                handleNewSelectedStop={handleNewSelectedFromStop}
                handleResetClick={handleResetClickForFromStop}
                title="Von"
                placeholder="Start"
                stop={fromStop}
              />
            </div>
            <div className="col-sm-4">
              <StopBox
                handleNewSelectedStop={handleNewSelectedToStop}
                handleResetClick={handleResetClickForToStop}
                title="Nach"
                placeholder="Ziel"
                stop={toStop}
              />
            </div>
            <div className="col-sm-4">
              <div className="card shadow-sm mb-2 bg-white rounded">
                <div className="card-header">Abfahrt</div>
                <div className="card-body">
                  <Datetime
                    onChange={handelNewDate}
                    dateFormat="DD.MM.YYYY"
                    timeFormat="HH:mm"
                    value={tripDateTime}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <CollapseComponent
              chevronText="Erweiterte Verbindungseinstellungen"
              id="collapse-erweit-verb"
            >
              <div className="col-sm-4">
                <StopBox
                  handleNewSelectedStop={handleNewSelectedViaStop}
                  handleResetClick={handleResetClickForViaStop}
                  title="Via"
                  placeholder="Zwischenstop"
                  stop={viaStop}
                />
              </div>
            </CollapseComponent>
          </div>
        </>
      )}
      <Routes
        fromStop={fromStop}
        toStop={toStop}
        viaStop={viaStop}
        selectedTrip={props.selectedTrip}
        dateTime={tripDateTime}
        handleSelectedTrip={handleSelectedTrip}
        handleEditTrip={handleEditTrip}
      />
    </>
  );
}
