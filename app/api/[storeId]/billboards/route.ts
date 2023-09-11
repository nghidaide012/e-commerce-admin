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
        const {label, imageUrl} = body;
        
        if(!userId)
        {
            return new NextResponse('Unauthenticated', {status: 401});
        }

        if(!label || !imageUrl)
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard);
        

    } catch (error) {
        console.log("[POST_BILLBOARD]", error)
        return new NextResponse("[POST_BILLBOARD]", {status: 400});
        
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

        const billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard);
        

    } catch (error) {
        console.log("[GET_BILLBOARD]", error)
        return new NextResponse("[GET_BILLBOARD]", {status: 400});
        
    }
}GET