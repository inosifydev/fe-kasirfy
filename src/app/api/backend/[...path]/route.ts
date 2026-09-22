
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://be-kasirfy.vercel.app";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function handler(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { path } = await context.params;

    const backendPath = `/api/v1/${path.join("/")}`;
    const backendUrl = `${BACKEND_URL}${backendPath}`;

    console.log(
      `[API PROXY] ${request.method} ${backendUrl}`
    );

    // ==========================================
    // REQUEST HEADERS
    // ==========================================

    const headers = new Headers();

    const contentType =
      request.headers.get("content-type");

    if (contentType) {
      headers.set("content-type", contentType);
    }

    const authorization =
      request.headers.get("authorization");

    if (authorization) {
      headers.set("authorization", authorization);
    }

    // Teruskan cookie browser ke backend
    const cookie = request.headers.get("cookie");

    const hasAccessToken = cookie
      ?.split(";")
      .some((item) =>
        item.trim().startsWith("access_token=")
      );

    console.log("[API PROXY] Cookie tersedia:", Boolean(cookie));
    console.log(
      "[API PROXY] access_token tersedia:",
      Boolean(hasAccessToken)
    );

    if (cookie) {
      headers.set("cookie", cookie);
    }

    headers.set("accept", "application/json");

    // ==========================================
    // REQUEST BODY
    // ==========================================

    let body: BodyInit | undefined;

    if (
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      body = await request.arrayBuffer();
    }

    // ==========================================
    // REQUEST KE BACKEND
    // ==========================================

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    console.log("[API PROXY DEBUG]", {
      method: request.method,
      backendUrl,
      status: response.status,
      statusText: response.statusText,
      allow: response.headers.get("allow"),
      contentType: response.headers.get("content-type"),
      hasCookie: Boolean(cookie),
      hasAccessToken: Boolean(hasAccessToken),
    });

    const responseBody = await response.arrayBuffer();

    if (!response.ok) {
      const errorText = new TextDecoder().decode(
        responseBody
      );

      console.error("[API PROXY BACKEND ERROR]", {
        status: response.status,
        statusText: response.statusText,
        url: backendUrl,
        body: errorText,
      });
    }

    // ==========================================
    // RESPONSE HEADERS
    // ==========================================

    const responseHeaders = new Headers();

    const responseContentType =
      response.headers.get("content-type");

    if (responseContentType) {
      responseHeaders.set(
        "content-type",
        responseContentType
      );
    }

    // Teruskan header Allow jika tersedia
    const allow = response.headers.get("allow");

    if (allow) {
      responseHeaders.set("allow", allow);
    }

    // ==========================================
    // TERUSKAN SET-COOKIE DARI BACKEND
    // ==========================================

    const setCookies = response.headers.getSetCookie();

    for (const originalCookie of setCookies) {
      let forwardedCookie = originalCookie;

      // Hapus domain backend agar cookie menjadi
      // cookie milik host frontend.
      forwardedCookie = forwardedCookie.replace(
        /;\s*Domain=[^;]+/gi,
        ""
      );

      // Atur Path agar cookie dapat digunakan
      // pada route frontend.
      forwardedCookie = forwardedCookie.replace(
        /;\s*Path=[^;]*/gi,
        "; Path=/"
      );

      if (!/;\s*Path=/i.test(forwardedCookie)) {
        forwardedCookie += "; Path=/";
      }

      responseHeaders.append(
        "set-cookie",
        forwardedCookie
      );

      console.log("[API PROXY] Set-Cookie diteruskan");
    }

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[API PROXY ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Gagal menghubungkan ke backend.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// HTTP METHODS
// ==========================================

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  return handler(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  return handler(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  return handler(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return handler(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  return handler(request, context);
}