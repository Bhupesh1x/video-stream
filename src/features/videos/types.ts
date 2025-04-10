import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type VideoWithUserInfo =
  inferRouterOutputs<AppRouter>["video"]["getOne"];
