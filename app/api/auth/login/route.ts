import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("auth/login", body, {
      validateStatus: () => true,
    });

    const setCookie = apiRes.headers["set-cookie"];
    const res = NextResponse.json(apiRes.data, { status: apiRes.status });

    if (!setCookie) return res;

    const store = await cookies();
    const list = Array.isArray(setCookie) ? setCookie : [setCookie];

    for (const raw of list) {
      const parsed = parse(raw);

      // 💡 важливо: локальні куки, щоб Next бачив їх при SSR/middleware
      const opts = {
        httpOnly: true,
        secure: false, // локально тільки http
        sameSite: "lax" as const,
        path: "/",
        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
      };

      if (parsed.accessToken)
        store.set("accessToken", parsed.accessToken, opts);
      if (parsed.refreshToken)
        store.set("refreshToken", parsed.refreshToken, opts);
      if (parsed.sessionId) store.set("sessionId", parsed.sessionId, opts);
    }

    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
