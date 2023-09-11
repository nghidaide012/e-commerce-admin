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
        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;
        
        if(!userId)
        {
            return new NextResponse('Unauthenticated', {status: 401});
        }

        if(!name || !price || !categoryId || !colorId || !sizeId || !images || !images.length)
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
        

    } catch (error) {
        console.log("[PRODUCT]", error)
        return new NextResponse("[POST_PRODUCT]", {status: 400});
        
    }
}

export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
){
    try {

        const { searchParams} = new URL(req.url)

        const categoryId = searchParams.get('categoryId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        
        if(!params.storeId)
        {
            return new NextResponse("storeId is required field", {status: 400});

        }

        const product = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(product);
        

    } catch (error) {
        console.log("[GET_PRODUCT]", error)
        return new NextResponse("[GET_PRODUCT]", {status: 400});
        
    }
}GET