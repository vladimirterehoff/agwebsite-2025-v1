import React from 'react'
import ReactDomServer from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import routes from './routes/router'


function createFetchRequest(req, res) {
    const origin = `${req.protocol}://${req.get("host")}`;
    const url = new URL(req.originalUrl || req.url, origin);
    
    const controller = new AbortController();
    res.on("close", () => controller.abort());
    
    const headers = new Headers();
    
    for (let [key, values] of Object.entries(req.headers)) {
        if (values) {
            if (Array.isArray(values)) {
                for (let value of values) {
                    headers.append(key, value);
                }
            } else {
                headers.set(key, values);
            }
        }
    }
    
    const init: {
        method: string,
        headers: Headers,
        signal: AbortSignal,
        body?: any
    } = {
        method: req.method,
        headers,
        signal: controller.signal,
    };
    
    if (req.method !== "GET" && req.method !== "HEAD") {
        init.body = req.body;
    }
    
    return new Request(url.href, init);
}


export const Renderer = async (req, res) => {
    try{
        const { query, dataRoutes } = createStaticHandler(routes)
        const fetchRequest = createFetchRequest(req, res)
        const context = await query(fetchRequest)
        if(context instanceof Response){
            throw context
        }
        const router = createStaticRouter(dataRoutes, context)
        const headers = {}
        const { pipe } = ReactDomServer.renderToPipeableStream(<div>
            <StaticRouterProvider router={router} context={context} />
        </div>, {
            bootstrapModules: ['/main.js'],
            onShellReady(){
                res.setHeader('content-type', 'text/html')
                pipe(res)
            }
        })
    } catch(e){
        console.error(e)
    }
}

