import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    {params} : {params: { colorId: string}}
) {
    try {

        
        if(!params.colorId)
        {
            return new NextResponse("ColorId is required", {status: 400})
            
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        })
        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_GET]: ', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    {params} : {params: {colorId: string, storeId: string}}
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name, value} = body;

        if(!userId)
        {
            return new NextResponse("Unauthenticated", {status: 401})
        }


        if(!name || !value)
        {
            return new NextResponse("fill in the required fields", {status: 400})
        }

        if(!params.storeId)
        {
            return new NextResponse("storeId is required", {status: 400})
            
        }
        if(!params.colorId)
        {
            return new NextResponse("ColorId is required", {status: 400})
            
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        })
        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_PATCH]: ', error);
        return new NextResponse("Internal error", {status: 500});
    }

}

export async function DELETE(
    req: Request,
    {params} : {params: {storeId: string, colorId: string}}
) {
    try {
        const {userId} = auth();

        
        if(!userId)
        {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.colorId)
        {
            return new NextResponse("billboardId is required", {status: 400})
            
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId
            }
        })
        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_DELETE]: ', error);
        return new NextResponse("Internal error", {status: 500});
    }
}