"use server";

import { cookies } from "next/headers";

export async function login(email: string, hashedPassword: string) {
  const response = await fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, hashedPassword }),
  });

  if (response.ok) {
    const cookieStore = cookies();
    const authCookie = response.headers.get("set-cookie");
    if (authCookie) {
      cookieStore.set("auth_token", authCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
    return { success: true };
  } else {
    const error = await response.json();
    return { success: false, error: error.error };
  }
}
