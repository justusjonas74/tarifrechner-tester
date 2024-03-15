import { IRoute, route } from "dvbjs";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const dateParam = searchParams.get("date") || undefined;
  const date = dateParam ? new Date(dateParam) : new Date();
  const via = searchParams.get("via") || undefined;

  if (to && from) {
    const routes: IRoute = await route(from, to, date, false, undefined, via);
    return Response.json(routes);
  } else {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
