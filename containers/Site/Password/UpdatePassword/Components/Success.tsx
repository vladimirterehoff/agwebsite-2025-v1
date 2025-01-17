// Libs
import React from 'react';
import Link from 'next/link';
// Constants
import {SITE_PATH} from "@/utils/routers/site";

/**
 * Update Password Success screen
 * @constructor
 */
const Success = () => {

  return (
    <>
      <h1>Success</h1>

      <Link href={SITE_PATH.SIGN_IN} legacyBehavior>
        <a>
          Back to Sign IN page
        </a>
      </Link>
    </>
  );
};

export default Success;
