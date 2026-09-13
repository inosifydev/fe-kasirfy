import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://be-kasirfy.vercel.app";

async function handler(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  try {
    const { path } = await context.params;

    const backendPath = `/api/v1/${path.join("/")}`;
    const backendUrl = `${BACKEND_URL}${backendPath}`;

    console.log(
      `[API PROXY] ${request.method} ${backendUrl}`
    );

    const headers = new Headers();

    // Content-Type
    const contentType = request.headers.get("content-type");

    if (contentType) {
      headers.set("content-type", contentType);
    }

    // Authorization
    const authorization =
      request.headers.get("authorization");

    if (authorization) {
      headers.set("authorization", authorization);
    }

    // Cookie dari browser → backend
    const cookie = request.headers.get("cookie");

    if (cookie) {
      headers.set("cookie", cookie);
      console.log("[API PROXY] Cookie diteruskan");
    } else {
      console.log("[API PROXY] Tidak ada cookie");
    }

    headers.set("accept", "application/json");

    // Body
    let body: BodyInit | undefined;

    if (
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      body = await request.arrayBuffer();
    }

    // Request ke backend
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    console.log(
      `[API PROXY] Response ${response.status}`
    );

    const responseBody = await response.arrayBuffer();

        if (!response.ok) {
        const errorText = new TextDecoder().decode(
            responseBody
        );

        console.error(
            "[API PROXY BACKEND ERROR]",
            {
            status: response.status,
            url: backendUrl,
            body: errorText,
            }
        );
        }

    const responseHeaders = new Headers();

    // Content-Type response
    const responseContentType =
      response.headers.get("content-type");

    if (responseContentType) {
      responseHeaders.set(
        "content-type",
        responseContentType
      );
    }

    // =====================================================
    // TERUSKAN SET-COOKIE DARI BACKEND
    // =====================================================

    const setCookies = response.headers.getSetCookie();

    if (setCookies.length > 0) {
      for (const originalCookie of setCookies) {
        let cookie = originalCookie;

        // Cookie backend tidak boleh tetap memakai
        // Domain=be-kasirfy.vercel.app
        //
        // Kita hapus Domain agar cookie menjadi
        // cookie milik localhost.
        cookie = cookie.replace(
          /;\s*Domain=[^;]+/gi,
          ""
        );

        // Cookie backend mungkin menggunakan:
        // Path=/api/v1
        //
        // Sedangkan frontend kita menggunakan:
        // /api/backend
        //
        // Jadi Path harus dibuat /
        cookie = cookie.replace(
          /;\s*Path=[^;]*/gi,
          "; Path=/"
        );

        // Pastikan Path=/ kalau backend tidak
        // memberikan Path sama sekali.
        if (!/;\s*Path=/i.test(cookie)) {
          cookie += "; Path=/";
        }

        responseHeaders.append(
          "set-cookie",
          cookie
        );

        console.log(
          "[API PROXY] Set-Cookie diteruskan"
        );
      }
    }

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(
      "[API PROXY ERROR]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        status: 500,
        message:
          "Gagal menghubungkan ke backend.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return handler(request, context);
}