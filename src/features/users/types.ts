import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type UserType = inferRouterOutputs<AppRouter>["user"]["getOne"];
