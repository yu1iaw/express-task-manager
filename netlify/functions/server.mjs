// const serverless = require('serverless-http');

// let cached;

// exports.handler = async (event, context) => {
//     if (!cached) {
//         const { default: app } = await import('../../src/server.js');
//         cached = serverless(app);
//     }

//     return cached(event, context);
// }

import serverless from "serverless-http";
import app from "../../src/server.js";

export const handler = async (event, context) => {
    console.log({ method: event.httpMethod, body: event.body });

    const serverlessHandler = serverless(app, {
        request: (request) => {
            request.serverless = { event, context };
        }
    });


    const res = await serverlessHandler(event, context);
    return res;
}
