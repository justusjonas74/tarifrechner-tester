import React, { FormEvent, useState } from "react";
import * as dvb from "dvbjs";
import { IPoint } from "dvbjs";
import Autosuggest, {
  OnSuggestionSelected,
  SuggestionSelectedEventData,
  SuggestionsFetchRequested,
  InputProps,
} from "react-autosuggest";
import styles from "./SearchStopField.module.css";
import { api } from "@/lib/apiFetch";

function escapeRegexCharacters(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ----------------- */
/*    Suggestions    */
/* ----------------- */

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
    {suggestion.name}
    <br />
    <small>{suggestion.city}</small>
  </div>
);

export default function SearchStopField(props: SearchStopFieldProps) {
  const [suggestions, setSuggestions] = useState<IPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onChange = (
    event: FormEvent<HTMLElement>,
    params: Autosuggest.ChangeEvent,
  ) => {
    const { newValue } = params;
    setInputValue(newValue);
  };

  const getStopArray = async (searchterm: string) => {
    setIsLoading(true);

    const data = await api<IPoint[]>(
      "api/stops?" +
        new URLSearchParams({
          name: searchterm,
        }),
    );
    if (data) {
      const stops = data;
      setSuggestions(stops.slice(0, 20));
    }

    setIsLoading(false);
  };

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value: string) => {
    const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
    const inputLength = inputValue.length;
    if (inputLength < 3) {
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
    data: SuggestionSelectedEventData<IPoint>,
  ) => {
    const handler =
      // props.handleNewSelectedCard || defaultHandlerOnSuggestionSelected;
      props.handleNewSelectedStop;
    handler(data.suggestion);
    setInputValue("");
  };

  const value = inputValue;

  // Autosuggest will pass through all these props to the input.
  const inputProps: InputProps<IPoint> = {
    placeholder: "",
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
        theme={styles}
      />
      {isLoading && "Loading..."}
    </>
  );
}
