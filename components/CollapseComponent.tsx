import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretUpIcon } from "@phosphor-icons/react/dist/csr/CaretUp";
import { useState } from "react";
import { Button, Collapse } from "react-bootstrap";

interface CollapseComponentProps {
  chevronText: string;
  id: string;
  textClassName?: string;
  isOpen?: boolean;
}

export default function CollapseComponent(
  props: React.PropsWithChildren<CollapseComponentProps>,
) {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen || false);
  return (
    <>
      <div className="d-grid ">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          aria-controls={props.id}
          aria-expanded={isOpen}
          // size="sm"
          className="m-1"
          variant="light"
        >
          {isOpen ? (
            <CaretUpIcon size={16} className="mx-2" />
          ) : (
            <CaretDownIcon size={16} className="mx-2" />
          )}

          <span className={props.textClassName}>{props.chevronText}</span>
        </Button>
        <Collapse in={isOpen} timeout={50}>
          <div id={props.id} className="">
            {props.children}
          </div>
        </Collapse>
      </div>
    </>
  );
}
