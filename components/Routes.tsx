import React from "react";
import { IPoint, IRoute, route, ITrip } from "dvbjs";
import RouteView from "./RouteView";
// import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/lib/apiFetch";

interface IState {
  fetchedRoutes: IRoute | null;
  isLoading: boolean;
}

interface IProps {
  fromStop: IPoint | null;
  toStop: IPoint | null;
  viaStop: IPoint | null;
  selectedTrip: ITrip | null;
  dateTime: Date;
  handleSelectedTrip: (trip: ITrip) => void;
  handleEditTrip: () => void;
}

class Routes extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      fetchedRoutes: null,
      isLoading: false,
    };
  }
  async fetchRoutes() {
    const from = this.props.fromStop;
    const to = this.props.toStop;
    const via = this.props.viaStop ? this.props.viaStop!.id : undefined;
    const date = this.props.dateTime;
    if (from && to) {
      this.setState({ isLoading: true });
      // route(from!.id,to!.id, date, false, undefined , via)
      try {
        const searchParams = new URLSearchParams({
          from: from!.id,
          to: to!.id,
          date: date.toISOString(),
        });
        if (via) {
          searchParams.append("via", via);
        }

        const route = await api<IRoute>("api/route?" + searchParams);
        this.setState({ fetchedRoutes: route, isLoading: false });
      } catch (err) {
        console.log(err);
      }
    }
  }
  componentDidUpdate(prevProps: IProps) {
    if (
      this.props.toStop !== prevProps.toStop ||
      this.props.fromStop !== prevProps.fromStop ||
      this.props.dateTime !== prevProps.dateTime ||
      this.props.viaStop !== prevProps.viaStop
    ) {
      this.fetchRoutes();
    }
  }

  componentDidMount() {
    if (this.props.toStop && this.props.fromStop) {
      this.fetchRoutes();
    }
  }

  render() {
    const fetchedRoutes = this.state.fetchedRoutes;

    let content;
    if (this.props.selectedTrip) {
      const trip = this.props.selectedTrip;
      content = (
        <RouteView
          trip={trip}
          handleSelectedTrip={(e) => {}}
          selectable={false}
          handleEditTrip={this.props.handleEditTrip}
        />
      );
    } else {
      if (this.props.dateTime && this.props.fromStop && this.props.toStop) {
        if (this.state.isLoading) {
          const spinner = (
            <div className="LoadingSpinner text-center">
              <span className="align-middle">
                <FontAwesomeIcon icon={faSpinner} size="3x" pulse={true} />
              </span>
            </div>
          );
          content = spinner;
        } else {
          const routeItems = fetchedRoutes?.trips.map((trip, index) => (
            <RouteView
              selectable={true}
              trip={trip}
              key={index}
              handleSelectedTrip={this.props.handleSelectedTrip}
              handleEditTrip={() => {}}
            />
          ));
          content = routeItems;
        }
      } else {
        content = <></>;
      }
    }

    return <div>{content}</div>;
  }
}

export default Routes;
