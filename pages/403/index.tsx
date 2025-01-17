// Libs
import React from 'react';
import { NextPage } from 'next';
// Containers
import ErrorPage from "@/containers/ErrorPage";

const Index: NextPage = () => {
  return (
    <>
      <ErrorPage  statusCode={403}/>
    </>
  );
};

export default Index;
