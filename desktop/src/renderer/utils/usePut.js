import React, { useState } from 'react';
import server from './server';
import serverErrorHandler from './serverErrorHandler';

function usePut(params) {
    const { endpoint, responseHandler } = params;
    const [islaoding, setIsLoading] = useState(false);
    const [resoponse, setResponse] = useState(null);
    const [error, setError] = useState(null);

    function update(obj) {
        var abortController = new AbortController();
        setIsLoading(true);
        server
            .put(endpoint, { ...obj }, { signal: abortController.signal })
            .then((res) => {
                if (typeof responseHandler === 'function') {
                    setResponse(responseHandler(res.data));
                } else {
                    setResponse(res.data);
                }
            })
            .catch((err) => {
                const errmsg = serverErrorHandler(err);
                setError(errmsg);
            })
            .finally(function () {
                setIsLoading(!1);
            });
    }

    return { error, resoponse, islaoding, update };
}

export default usePut;
