import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { GetInferenceHelpers } from "@trpc/server";
import type { NextPageContext } from "next";
import superjson from "superjson";
import type { AppRouter } from "../server/routers";

export interface SSRContext extends NextPageContext {
  status?: number;
}

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  return "http://localhost:3000";
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          /**
           * Set custom request headers on every request from tRPC
           * @link https://trpc.io/docs/ssr
           */
          headers() {
            if (ctx?.req) {
              // To use SSR properly, you need to forward the client's headers to the server
              // This is so you can pass through things like cookies when we're server-side rendering

              // If you're using Node 18, omit the "connection" header
              const { connection: _connection, ...headers } = ctx.req.headers;
              return {
                ...headers,
                // Optional: inform server that it's an SSR request
                "x-ssr": "1",
              };
            }
            return {};
          },
        }),
      ],
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: true,
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;
    if (ctx.status) {
      // If HTTP status set, propagate that
      return {
        status: ctx.status,
      };
    }
    const error = opts.clientErrors[0];
    // error?data?.httpStatus
    if (error) {
      return {
        status: 500,
      };
    }
    return {};
  },
});

export type AppRouterTypes = GetInferenceHelpers<AppRouter>;
