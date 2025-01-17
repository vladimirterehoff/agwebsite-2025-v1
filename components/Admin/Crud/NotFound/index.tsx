// Libs
import React from 'react';

interface Props {
  loading?: boolean;
  data?: any;
  id?: any;
}

/**
 * CRUD Not Found Component
 * @param props
 * @constructor
 */
const Index = (props: Props) => {
  return (
    <>
      {
        (!props.loading && !props.data && props.id ) && (
          <p>Not found</p>
        )
      }
    </>
  );
};

export default Index;
