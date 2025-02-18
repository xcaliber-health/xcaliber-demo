import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    console.log("REDIRECT URI CALLED")
  const {searchParams} = new URL(request.url);
  
  console.log(searchParams.toString());
  const data = '<p>Hello, World!</p>';
  return new NextResponse(data, {status: 200, headers: { 'Content-Type': 'text/html' }});
}
