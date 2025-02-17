import { initializeFHIR } from '@/lib/fhir-client';
import { EHRType } from '@/utils/constants';
import { useSearchParams } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';


const launchFhirApp = async (searchParams: URLSearchParams): Promise<any> => {
    if (searchParams.toString().includes("athena")) {
        return await initializeFHIR(searchParams, EHRType.ATHENA);
      } else { // default EHR Type is Athena
        return await initializeFHIR(searchParams, EHRType.ATHENA);
      }
};

export async function GET(request: NextRequest) {
    console.log("here 1")
  const {searchParams} = new URL(request.url);
  const data = await launchFhirApp(searchParams);
  return new NextResponse(data, {status: 200, headers: { 'Content-Type': 'text/html' }});
}
