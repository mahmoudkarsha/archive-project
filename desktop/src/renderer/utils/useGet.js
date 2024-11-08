import React, { useState, useEffect } from 'react';
import server from './server';

function useGet(params) {
  const {
    endpoint,
    query,
    responseHandler,
    setCount,
    defaultResponse,
    noFetch,
  } = params;

  let queryString = '?';
  if (typeof query === 'object' && query != null) {
    Object.keys(query)
      .sort((a, b) => a)
      .forEach((key) => {
        let value = query[key];
        if (typeof value === 'object' && value != null) {
          value = JSON.stringify(value);
        }
        queryString =
          queryString === '?'
            ? queryString + `${key}=${value}`
            : queryString + `&${key}=${value}`;
      });
  }

  const [islaoding, setIsLoading] = useState(true);
  const [resoponse, setResponse] = useState(defaultResponse);
  const [error, setError] = useState(null);

  useEffect(() => {
    var abortController = new AbortController();
    if (!noFetch) {
      setIsLoading(true);
      server
        .get(endpoint + queryString, { signal: abortController.signal })
        .then((res) => {
          if (typeof responseHandler === 'function') {
            setResponse(responseHandler(res.data));

            console.log('no error occured');
          } else {
            setResponse(res.data);
          }
          if (typeof setCount === 'function') {
            setCount(res.data.reportsCount);
          }
        })
        .catch(function (error) {
          if (error.response) {
            setError('Error', error.message);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            setError('Error', error.message);
            console.log(error.request);
          } else {
            setError('Error', error.message);
            console.log('Error', error.message);
          }
          console.log(error.config);
        })
        .finally(function () {
          setIsLoading(!1);
        });
    }
    return () => {
      abortController.abort('Compoenet Unmounted');
    };
  }, [endpoint, queryString, noFetch]);

  return { error, resoponse, islaoding };
}

export default useGet;
