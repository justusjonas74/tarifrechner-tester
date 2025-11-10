import React from "react";

import { IPoint } from "dvbjs";

import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import Button from "react-bootstrap/Button";

// interface IState {}
interface IStopFieldProps {
  stop: IPoint;
  handleResetClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

export default function StopField(props: IStopFieldProps) {
  return (
    <>
      <span>
        {props.stop.city} - {props.stop.name}{" "}
      </span>

      <Button
        type="button"
        className="close"
        variant="light"
        size="sm"
        aria-label="Close"
        onClick={props.handleResetClick}
      >
        <PencilSimpleIcon weight="regular" size="16" />
      </Button>
      <br />
      <span className="small text-secondary">(ID:{props.stop.id}) </span>
    </>
  );
}
