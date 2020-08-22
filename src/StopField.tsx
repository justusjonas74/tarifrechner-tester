import React from 'react';

import {IPoint} from 'dvbjs';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPen } from '@fortawesome/free-solid-svg-icons'

// interface IState {}
interface IProps {
    stop: IPoint,
    handleResetClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
}

class StopField extends React.Component<IProps> {
    // constructor(props:IProps){
    //     super(props);
    // }
    render(){
        return (
            <>
                   <span>{this.props.stop.city} - {this.props.stop.name} </span>
                   <button type="button" className="close" aria-label="Close" onClick={this.props.handleResetClick}>
                    <span aria-hidden="true">&times;</span>
                    {/* <FontAwesomeIcon size="xs" icon={faPen} /> */}
                    </button>
<br/>
                   <span className="small text-secondary">(ID:{this.props.stop.id}) </span>
                        
            </>
        )
    }
}

export default StopField;