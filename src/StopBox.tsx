import React from "react";
import { SearchStopField } from "./SearchStopField";
import StopField from "./StopField";
import { IPoint } from "dvbjs";


interface IState{
    
}

interface IProps{
    title:string,
    stop: IPoint | null,
    placeholder: string,
    handleNewSelectedStop:( stop_id: IPoint) => void,
    handleResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

class StopBox extends React.Component<IProps> {    
    render() {
        const stopField = this.props.stop ? <StopField stop={this.props.stop} handleResetClick={this.props.handleResetClick}/>: <SearchStopField placeholder={this.props.placeholder} handleNewSelectedStop={this.props.handleNewSelectedStop}/>
        return (
            <div>
                <div className="card shadow-sm mb-2 bg-white rounded">
                    <div className="card-header">{this.props.title}</div>
                    <div className="card-body">
                        {stopField}
                    </div>
                </div>
            </div>
            )
        }
        
    }
    
    export default StopBox