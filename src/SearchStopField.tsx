import React, { Component, FormEvent, ChangeEvent } from 'react';
// import axios from 'axios';
import * as dvb from 'dvbjs';
import {IPoint} from 'dvbjs';
import Autosuggest, { OnSuggestionSelected, SuggestionSelectedEventData, SuggestionsFetchRequested, SuggestionsFetchRequestedParams, InputProps } from 'react-autosuggest';
import './SearchStopField.css'
import FormLoadingSpinner from './FormLoadingSpinner.js'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSearch } from '@fortawesome/free-solid-svg-icons'


/* ----------------- */
/*    Helper Methods */
/* ----------------- */

function escapeRegexCharacters(str:string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ----------------- */
/*    Suggestions    */
/* ----------------- */

// type renderInputComponentProps = { 
//     placeholder?: string,
//     value:string,
//     className?: string,
//     onChange: (event: ChangeEvent<HTMLInputElement>) => void
// }; 


const getSuggestionValue = (suggestion: IPoint) => suggestion.name;

const renderSuggestion = (suggestion:IPoint) => (
    <div>
    {suggestion.name}<br />
    <small>{suggestion.city}</small>
    </div>
    );
    
    const shouldRenderSuggestions = (value:string) => {
        // console.log("shouldRenderSuggestions")
        return value.trim().length > 2;
    }
    
    /* ----------------- */
    /*    Exports        */
    /* ----------------- */
    
    export interface ISearchStopFieldProps {
        handleNewSelectedStop : (stop_id:IPoint) => void,
        placeholder: string
    }
    interface IState {
        value:string, 
        suggestions: IPoint[],
        isLoading: boolean
    }
    
    export class SearchStopField extends Component<ISearchStopFieldProps, IState> {
        
        // renderInputComponent : RenderInputComponent<IPoint> = (inputProps : InputProps<IPoint>) : ReactNode => (
        //     <div className="input-group">
        //     <div className="input-group-prepend">
        //     <div className="input-group-text">
        //     {/* <i className="fa fa-search"></i> */}
        //     <FontAwesomeIcon icon={faSearch} />
        //     </div>
        //     </div>
        //     {/* onChange={this.handleChange}  */}
        //     <input {...inputProps} />
        //     </div>
            
        //     )
            
            constructor(props: ISearchStopFieldProps) {
                super(props);
                this.state = {
                    value: '',
                    suggestions: [],
                    isLoading: false
                };
                this.handleChange = this.handleChange.bind(this);
            }
            
            onSuggestionSelected : OnSuggestionSelected<IPoint> = (event:React.FormEvent<any>, data: SuggestionSelectedEventData<IPoint>) => {
                return this.props.handleNewSelectedStop(data.suggestion);
            }
            
            //    onChange = (event: React.ChangeEvent<HTMLInputElement>, params: Autosuggest.ChangeEvent)=> {
            //         const newValue = event.target.value;
            //         this.setState({
            //              value: newValue
            //         });
            //     };
            
            getStopArray(term:string) {
                // console.log("getStopArray fired")
                this.setState({
                    isLoading: true
                });
                dvb.findStop(term)
                .then((data) => {
                    this.setState({
                        suggestions: data.slice(0, 15),
                        isLoading: false
                    });
                },
                (error) => {
                    console.error(error);
                }
                );
            }
            
            getSuggestions(value:string) {
                // console.log("getSuggestions")
                const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
                const inputLength = inputValue.length;
                
                if (inputLength === 0) {
                    this.setState({
                        suggestions: []
                    });
                }
                else {
                    this.getStopArray(inputValue);
                }
            };
            
            onSuggestionsFetchRequested : SuggestionsFetchRequested = ( {value}: SuggestionsFetchRequestedParams) => {
                // console.log("onSuggestionsFetchRequested")
                this.getSuggestions(value)
            };
            
            onSuggestionsClearRequested = () => {
                this.setState({
                    suggestions: []
                });
            };
            //TEST
            handleChange (event: ChangeEvent<HTMLInputElement>, ) : void {
            // handleChange(event: React.FormEvent<IPoint>, params: ChangeEvent): void {
            // handleChange {
                // console.log("handleChange")
                // console.log(e.target.value)
                // No longer need to cast to any - hooray for react!
                this.setState({value: event.currentTarget.value});
                // console.log(this.state.value)
            }
            
            render() {
                const { value, suggestions , isLoading } = this.state;
                const inputProps : InputProps<dvb.IPoint>= {
                    placeholder: this.props.placeholder,
                    value,
                    onChange: this.handleChange,
                };
                
                return (
                <div className="SearchStopField">
                    
                        <Autosuggest
                        suggestions= {suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        onSuggestionSelected={this.onSuggestionSelected}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        shouldRenderSuggestions={shouldRenderSuggestions}
                        // renderInputComponent={this.renderInputComponent}
                        />
                        <FormLoadingSpinner isLoading={isLoading} />
                        {/* <FormLoadingSpinner isLoading={true} /> */}
            
                </div>
                    );
                }
            }