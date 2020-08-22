import React, { Component } from 'react';
import './FormLoadingSpinner.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class FormLoadingSpinner extends Component {
    render() {
        const isLoading = this.props.isLoading;
        if (isLoading) {
            return (
                // <i className="fa fa-spinner fa-pulse" id="loadingSpinner"></i>
                <FontAwesomeIcon icon={faSpinner} />
            )
        }
        else {
            return null
        }
    }
}

export default FormLoadingSpinner