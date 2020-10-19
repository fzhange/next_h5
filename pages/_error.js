import React from 'react'
import * as Sentry from '@sentry/node';

function ServerError({ statusCode, err }){
    if (err) {
        console.log('ServerError-----err: ', err);
        Sentry.captureException(err);     // This will work on both client and server sides in production.
    }
    return (
        <>
            <style jsx>{`
                .con{
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                h1{
                    position: absolute;
                    transform: translate(-50%);
                    left: 50%;
                    top: 50%;
                }
            `}
            </style>
           <div className="con">
                <h1>this is custom error page</h1>
           </div>
        </>
    )
}

// ServerError.getInitialProps = async function({ res, err }){
//     console.log('ServerError>>>>>>>>>err: ', err);
// } 

export default ServerError;