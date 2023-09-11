import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name, value} = body;
        
        if(!userId)
        {
            return new NextResponse('Unauthenticated', {status: 401});
        }

        if(!name || !value)
        {
            return new NextResponse("fill the required field", {status: 400});
        }

        if(!params.storeId)
        {
            return new NextResponse("storeId is required field", {status: 400});

        }
        const storeByuserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if(!storeByuserId)
        {
            return new NextResponse("Unauthorized", {status: 403});

        }

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(size);
        

    } catch (error) {
        console.log("[POST_SIZE]", error)
        return new NextResponse("[POST_SIZE]", {status: 400});
        
    }
}

export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
){
    try {
        
        if(!params.storeId)
        {
            return new NextResponse("storeId is required field", {status: 400});

        }

        const size = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(size);
        

    } catch (error) {
        console.log("[GET_SIZE]", error)
        return new NextResponse("[GET_SIZE]", {status: 400});
        
    }
}GET