import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

const publicPaths = ["/login", "/register", "/api/login", "/api/register"];
export function middleware(request: NextRequest) {
  // const authToken = request.cookies.get("auth_token");
  // const token = request.cookies.get("token");
  // const response = NextResponse.next();

  // if (!authToken && !request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (authToken && request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // // Ensure both auth_token and token are set in the response
  // if (authToken) {
  //   response.cookies.set("auth_token", authToken.value, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  //     path: "/",
  //   });
  // }

  // return response;
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for auth token
  const authToken = request.cookies.get("auth_token");

  if (!authToken) {
    // Redirect to login if accessing protected route
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify JWT token
    verify(authToken.value, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (error) {
    // Token is invalid
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
