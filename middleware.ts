import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    const isAuthPage = currentPath === "/auth/signup" || currentPath === "/auth/login" || currentPath === "/access-account"
    const isPublicPages = ["/", "/about-us", "/contact-us", "/access-account", "/auth/login", "/auth/signup", "/faq", "/h-services", "/privacy-policies", "/subscription-plans", "/termsa-conditions"].includes(currentPath)
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL(`/${token.role}/dashboard`, request.url))
    }

    if (!token && !isPublicPages) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (token && !isPublicPages && !currentPath.startsWith(`/${token.role}`)) {
        return NextResponse.redirect(new URL(`/${token.role}/dashboard`, request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/", "/about-us", "/contact-us", "/access-account", "/auth/login",
         "/auth/signup", "/faq", "/h-services", "/privacy-policies", "/subscription-plans",
          "/termsa-conditions","/patient/:path*","/patient","/doctor/:path*","/doctor","/pharmasist/:path*",
          "/pharmasist","/admin/:path*","/admin","/accountant/:path*","/accountant","/nurse/:path*","/nurse" ,"/branchadmin/:patj*","/branchadmin"]
}