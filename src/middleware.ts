import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  return NextResponse.rewrite(req.nextUrl);
}

export const config = {
  matcher: "/api/:path*",
};
