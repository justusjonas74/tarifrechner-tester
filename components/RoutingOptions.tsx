import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Collapse } from "react-bootstrap";

interface RoutingOptionsProps {
}

export default function RoutingOptions(props: React.PropsWithChildren<RoutingOptionsProps>) {
    // const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // const content = props.content
    return (
        <>
            <Collapse in={isOpen} timeout={50} >
                <div id="example-collapse-text" className="row">
                    {props.children}
                </div>
            </Collapse>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                aria-controls="example-collapse-text"
                aria-expanded={isOpen}
                size="sm"
                className="m-1"
                variant="light"
            // block
            >
                {/* <FontAwesomeIcon icon={faWrench} fixedWidth/> */}
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} height={15} className='p-2' />
                Erweiterte Verbindungseinstellungen

            </Button>

        </>
    );
}