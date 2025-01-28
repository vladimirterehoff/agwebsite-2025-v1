import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "./App";
import { StrictMode } from "react";
import {Renderer} from "./renderer"

interface IRenderProps {
  path: string;
}

export { Renderer  as render }
// export const render = (url: string) => {
//   const html = renderToString(
//     <StrictMode>
//       <StaticRouter location={url}>
//         <App url={url} />
//       </StaticRouter>
//     </StrictMode>
//   );

//   return { html };
// };
