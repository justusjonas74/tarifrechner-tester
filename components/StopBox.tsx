import React from "react";
import SearchStopField from "./SearchStopField";
import StopField from "./StopField";
import { IPoint } from 'dvbjs';




interface IStopBoxProps {
    title: string,
    stop: IPoint | null,
    placeholder: string,
    handleNewSelectedStop: (stop_id: IPoint) => void,
    handleResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function StopBox(props: IStopBoxProps) {

    const stopField = props.stop ? <StopField stop={props.stop} handleResetClick={props.handleResetClick} /> : <SearchStopField handleNewSelectedStop={props.handleNewSelectedStop} />

    return (
        <div>
            <div className="card shadow-sm mb-2 bg-white rounded">
                <div className="card-header">{props.title}</div>
                <div className="card-body">
                    {stopField}
                </div>
            </div>
        </div>
    )
}

