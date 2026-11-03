import { createFileRoute, redirect } from "@tanstack/react-router";
import { homePath } from '@/data/site-paths';
export const Route = createFileRoute("/")({
 beforeLoad: ({ location }) => {
   throw redirect({ to: homePath, hash: location.hash, search: true, statusCode: 301 });
 },
});
