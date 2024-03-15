import { IPoint, findStop } from "dvbjs";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("name");
  if (query) {
    const stops: IPoint[] = await findStop(query);
    return Response.json(stops);
  } else {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
