import type { Route } from "./+types/home";
import Home from "../../src/components/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vibeloop" },
    { name: "description", content: "Your mood and music journal." },
  ];
}

export default function HomeRoute() {
  return <Home />;
}
