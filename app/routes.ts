import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("groups", "./routes/groups.tsx"),
  route("guests/:id", "./routes/guest-profile.tsx"),
  route("campaigns", "./routes/campaigns.tsx"),
  route("results", "./routes/results.tsx"),
  route("readiness", "./routes/readiness.tsx"),
  route("connect", "./routes/connect.tsx"),
  route("costs", "./routes/costs.tsx"),
  route("privacy", "./routes/privacy.tsx"),
  route("guide", "./routes/guide.tsx"),
] satisfies RouteConfig;
