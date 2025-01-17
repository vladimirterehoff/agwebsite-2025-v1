// Libs
import React, { useState} from "react";
// Components
import Timer from "@/components/Common/Timer";

interface Props {
  onResend: () => void;
}

/**
 * Recovery Password Success screen
 * @param props
 * @constructor
 */
const Success = (props: Props) => {
  const onClickResend = () => {
    props.onResend();
  };

  return (
    <>
      <h1>Success</h1>

      <p className="text-left form-control">A message will be sent to that address containing a link to unlock your account.</p>

      <p className="text-left form-control">If you do not receive your email within five minutes check your spam folder.</p>

      <Timer handleCallback={onClickResend}/>
    </>
  );
};

export default Success;
