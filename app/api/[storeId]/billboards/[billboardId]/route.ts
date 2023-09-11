import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    {params} : {params: { billboardId: string}}
) {
    try {

        
        if(!params.billboardId)
        {
            return new NextResponse("billboardId is required", {status: 400})
            
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        })
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_GET]: ', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    {params} : {params: {billboardId: string, storeId: string}}
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {label, imageUrl} = body;

        if(!userId)
        {
            return new NextResponse("Unauthenticated", {status: 401})
        }


        if(!label || !imageUrl)
        {
            return new NextResponse("fill in the required fields", {status: 400})
        }

        if(!params.storeId)
        {
            return new NextResponse("storeId is required", {status: 400})
            
        }
        if(!params.billboardId)
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId
            },
            data: {
                label,
                imageUrl
            }
        })
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_PATCH]: ', error);
        return new NextResponse("Internal error", {status: 500});
    }

}

export async function DELETE(
    req: Request,
    {params} : {params: {storeId: string, billboardId: string}}
) {
    try {
        const {userId} = auth();

        
        if(!userId)
        {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.billboardId)
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId
            }
        })
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_DELETE]: ', error);
        return new NextResponse("Internal error", {status: 500});
    }
}