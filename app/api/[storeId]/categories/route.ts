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
        const {name, billboardId} = body;
        
        if(!userId)
        {
            return new NextResponse('Unauthenticated', {status: 401});
        }

        if(!name || !billboardId)
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category);
        

    } catch (error) {
        console.log("[POST_CATEGORY]", error)
        return new NextResponse("[POST_CATEGORY]", {status: 400});
        
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

        const category = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(category);
        

    } catch (error) {
        console.log("[GET_CATEGORY]", error)
        return new NextResponse("[GET_CATEGORY]", {status: 400});
        
    }
}GET