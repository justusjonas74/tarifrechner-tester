import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const targetUrl =
    process.env.NEXT_PUBLIC_URL || "https://webapitest.vvo-online.de/tc";

  const apiKey = process.env.NEXT_PUBLIC_APIKEY;
  const bundleId = process.env.NEXT_PUBLIC_BUNDLEID;

  const headers = new Headers();
  headers.set(
    "Content-Type",
    request.headers.get("Content-Type") || "application/json",
  );
  headers.set(
    "Accept",
    request.headers.get("Accept") ||
      "application/vnd.pkm-tarifrechner-v7+json;charset=UTF-8",
  );

  const forwardedApiKey = request.headers.get("X-Api-Key") || apiKey;
  if (forwardedApiKey) {
    headers.set("X-Api-Key", forwardedApiKey);
  }

  const forwardedBundleId =
    request.headers.get("X-Ios-Bundle-Identifier") || bundleId;
  if (forwardedBundleId) {
    headers.set("X-Ios-Bundle-Identifier", forwardedBundleId);
  }

  try {
    const body = await request.text();
    const upstreamResponse = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
    });

    const data = await upstreamResponse.text();
    return new NextResponse(data, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type":
          upstreamResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Error proxying to tarifrechner:", error);
    return NextResponse.json(
      { error: "Failed to connect to tarifrechner API" },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
