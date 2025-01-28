import React from "react";
import { appRoutes } from "./allRoutes";

const Routes = [
  {
    lazy: async () => {
      const { TopApp} = await import("../App")
      return {
        Component: TopApp
      }
    },
    children: [
      {
        path: appRoutes.Index,
        lazy: async () => {
          const Index = await import("../pages/Index")
          return {
            element: <Index />
          }
        },
      },
      {
        path: appRoutes.About,
        lazy: async () => {
          const About = await import("../pages/About")
          return {
            element: <About />
          }
        },
      },
      {
        path: appRoutes.Contact,
        lazy: async () => {
          const Contact = await import("../pages/Contact")
          return {
            element: <Contact />
          }
        },
      },
      {
        path: appRoutes.Services,
        lazy: async () => {
          const Services = await import("../pages/Services")
          return {
            element: <Services />
          }
        },
      },
      {
        path: appRoutes.CaseStudies,
        lazy: async () => {
          const CaseStudies = await import("../pages/CaseStudies")
          return {
            element: <CaseStudies />
          }
        },
      },

    ]
  }
]

export default Routes;
