import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { authenticated: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      userId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during authentication check" },
      { status: 500 }
    );
  }
}
