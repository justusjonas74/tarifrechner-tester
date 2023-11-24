import React, { FormEvent, useState } from 'react';
// import axios from 'axios';
import * as dvb from 'dvbjs';
import { IPoint } from 'dvbjs';
import Autosuggest, { OnSuggestionSelected, SuggestionSelectedEventData, SuggestionsFetchRequested, InputProps } from 'react-autosuggest';
import './SearchStopField.css'
// import FormLoadingSpinner from './FormLoadingSpinner.js'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSearch } from '@fortawesome/free-solid-svg-icons'

function escapeRegexCharacters(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

interface SearchStopFieldProps {
    handleNewSelectedStop: (stop: IPoint) => void;
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.

const getSuggestionValue = (suggestion: IPoint) => suggestion.name;

// Use your imagination to render suggestions.

const renderSuggestion = (suggestion: IPoint) => (
    <div>
        {suggestion.name}<br />
        <small>{suggestion.city}</small>
    </div>
);

export default function SearchStopField(props: SearchStopFieldProps) {
    const [suggestions, setSuggestions] = useState<IPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const onChange = (
        event: FormEvent<HTMLElement>,
        params: Autosuggest.ChangeEvent
    ) => {
        const { newValue } = params;
        setInputValue(newValue);
    };

    const getStopArray = async (searchterm: string) => {
        setIsLoading(true);
        const stops: IPoint[] = await dvb.findStop(searchterm)
        setSuggestions(stops.slice(0, 20));
        setIsLoading(false);
    };


    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = (value: string) => {
        const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
        const inputLength = inputValue.length;
        if (inputLength < 2) {
            setSuggestions([]);
        } else {
            getStopArray(inputValue);
        }
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested: SuggestionsFetchRequested = ({
        value,
    }: {
        value: string;
    }) => {
        getSuggestions(value);
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    // const defaultHandlerOnSuggestionSelected = (stop: IPoint) => {
    //     // const url = `/chipcard/${card.id.toString()}`;
    //     // Router.push(url);
    //     alert(stop)
    // };

    const onSuggestionSelected: OnSuggestionSelected<IPoint> = (
        event: React.FormEvent<any>,
        data: SuggestionSelectedEventData<IPoint>
    ) => {
        const handler =
            // props.handleNewSelectedCard || defaultHandlerOnSuggestionSelected;
            props.handleNewSelectedStop
        handler(data.suggestion);
        setInputValue("");
    };


    const value = inputValue;

    // Autosuggest will pass through all these props to the input.
    const inputProps: InputProps<IPoint> = {
        placeholder: "Suche Karte",
        value,
        onChange,
        className: "form-control me-2 form-control-sm",
    };

    return (
        <>
                <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            // theme={theme}
        />
        {isLoading && "Loading..."}
        </>

    );
}





// // ###########################################################################

// const shouldRenderSuggestions = (value: string) => {
//     // console.log("shouldRenderSuggestions")
//     return value.trim().length > 2;
// }

// /* ----------------- */
// /*    Exports        */
// /* ----------------- */

// export interface ISearchStopFieldProps {
//     handleNewSelectedStop: (stop_id: IPoint) => void,
//     placeholder: string
// }
// interface IState {
//     value: string,
//     suggestions: IPoint[],
//     isLoading: boolean
// }

// export class SearchStopField extends Component<ISearchStopFieldProps, IState> {



//     constructor(props: ISearchStopFieldProps) {
//         super(props);
//         this.state = {
//             value: '',
//             suggestions: [],
//             isLoading: false
//         };
//         this.handleChange = this.handleChange.bind(this);
//     }

//     onSuggestionSelected: OnSuggestionSelected<IPoint> = (event: React.FormEvent<any>, data: SuggestionSelectedEventData<IPoint>) => {
//         return this.props.handleNewSelectedStop(data.suggestion);
//     }

//     //    onChange = (event: React.ChangeEvent<HTMLInputElement>, params: Autosuggest.ChangeEvent)=> {
//     //         const newValue = event.target.value;
//     //         this.setState({
//     //              value: newValue
//     //         });
//     //     };

//     getStopArray(term: string) {
//         // console.log("getStopArray fired")
//         this.setState({
//             isLoading: true
//         });
//         dvb.findStop(term)
//             .then((data) => {
//                 this.setState({
//                     suggestions: data.slice(0, 15),
//                     isLoading: false
//                 });
//             },
//                 (error) => {
//                     console.error(error);
//                 }
//             );
//     }

//     getSuggestions(value: string) {
//         // console.log("getSuggestions")
//         const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
//         const inputLength = inputValue.length;

//         if (inputLength === 0) {
//             this.setState({
//                 suggestions: []
//             });
//         }
//         else {
//             this.getStopArray(inputValue);
//         }
//     };

//     onSuggestionsFetchRequested: SuggestionsFetchRequested = ({ value }: SuggestionsFetchRequestedParams) => {
//         // console.log("onSuggestionsFetchRequested")
//         this.getSuggestions(value)
//     };

//     onSuggestionsClearRequested = () => {
//         this.setState({
//             suggestions: []
//         });
//     };
//     //TEST
//     // handleChange(event: React.FormEvent<HTMLElement>, params: ChangeEvent<>) {
//     // // handleChange (event: ChangeEvent<HTMLInputElement>, ) : void {
//     // // handleChange(event: React.FormEvent<IPoint>, params: ChangeEvent): void {
//     // // handleChange {
//     //     // console.log("handleChange")
//     //     // console.log(e.target.value)
//     //     // No longer need to cast to any - hooray for react!
//     //     this.setState({value: event.currentTarget.value});
//     //     // console.log(this.state.value)
//     // }

//     const onChange = (
//         event: FormEvent<HTMLElement>,
//         params: Autosuggest.ChangeEvent
//     ) => {
//         const { newValue } = params;
//         setInputValue(newValue);
//     };


//     render() {
//         const { value, suggestions, isLoading } = this.state;
//         const inputProps: InputProps<dvb.IPoint> = {
//             placeholder: this.props.placeholder,
//             value,
//             onChange: this.handleChange,
//         };

//         return (
//             <div className="SearchStopField">

//                 <Autosuggest
//                     suggestions={suggestions}
//                     onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//                     onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//                     onSuggestionSelected={this.onSuggestionSelected}
//                     getSuggestionValue={getSuggestionValue}
//                     renderSuggestion={renderSuggestion}
//                     inputProps={inputProps}
//                     shouldRenderSuggestions={shouldRenderSuggestions}
//                 // renderInputComponent={this.renderInputComponent}
//                 />
//                 <FormLoadingSpinner isLoading={isLoading} />
//                 {/* <FormLoadingSpinner isLoading={true} /> */}

//             </div>
//         );
//     }
// }