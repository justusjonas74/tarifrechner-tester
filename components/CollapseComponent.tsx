import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
          {/* <FontAwesomeIcon icon={faWrench} fixedWidth/> */}
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            height={15}
            className="mx-2"
          />
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
