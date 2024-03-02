import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    //logic to get data from db
    const id = req.url.split("blogs/")[1];
    return NextResponse.json(
      {
        status: "success",
        blog: {
          id: id,
          title: "sample",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error",
        error,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  return Response.json({ status: "success", data });
}
