import React, {useEffect} from "react";
import PropTypes from 'prop-types';
import Error from "next/error";
import {useRouter} from "next/router";

const CustomError = ({ statusCode }) => {
  const router = useRouter();

  useEffect(() => {
    if (statusCode === 404) {
      router.push('/');
    }
  }, [statusCode]);

  return <Error statusCode={statusCode} />;
};

CustomError.propTypes = {
  statusCode: PropTypes.number.isRequired
};

const getInitialProps = ({ res, err }) => {
  let statusCode;

  if (res) {
    statusCode = res.statusCode;
  } else if (err) {
    statusCode = err.statusCode;
  } else {
    statusCode = null;
  }
  return { statusCode };
};

CustomError.getInitialProps = getInitialProps;

export default CustomError;
