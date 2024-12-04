import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Popover, OverlayTrigger, Image } from 'react-bootstrap';
import { IoMdInformationCircleOutline } from "react-icons/io";

function Instruction({ message }) {
  const popover = (
    <Popover className="popover">
      <Popover.Body>
        {message}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="bottom"
      overlay={popover}
    >
      <Image
        className="QuestionPopover w-5 h-5 ml-5 translate-y-0.5"
        src="../img/information.png"
        alt="question"
      />
    </OverlayTrigger>
  );
}

export default Instruction;
