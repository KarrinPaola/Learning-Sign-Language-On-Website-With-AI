import { eq } from 'drizzle-orm';
import db from '@/db/drizzle';
import { NextResponse } from 'next/server';
import { getIsAdmin } from '@/lib/admin';
import { challenges } from '@/db/schema';

export const GET = async (
    req: Request,
    { params }: { params: { challengeId: number } }
) => {
    if (!getIsAdmin()) return new NextResponse("Unauthorized", { status: 403 });
    const data = await db.query.challenges.findFirst({
        where: eq(challenges.id, params.challengeId),
    });
    if (!data) return new NextResponse("Challenge not found", { status: 404 });
    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: { challengeId: number } }
) => {
    if (!getIsAdmin()) return new NextResponse("Unauthorized", { status: 403 });
    const body = await req.json();

    // Validation cơ bản
    if (body.lessonId && typeof body.lessonId !== "number") {
        return new NextResponse("Invalid lessonId", { status: 400 });
    }
    if (body.type && !["SELECT", "ASSIST", "ACTION"].includes(body.type)) {
        return new NextResponse("Invalid type", { status: 400 });
    }
    if (body.order && typeof body.order !== "number") {
        return new NextResponse("Invalid order", { status: 400 });
    }
    if (body.type === "ACTION" && !body.expectedActionResult) {
        return new NextResponse("Missing expectedActionResult for ACTION type", { status: 400 });
    }

    const data = await db.update(challenges)
        .set({
            lessonId: body.lessonId,
            type: body.type,
            question: body.question !== undefined ? body.question : null,
            imageSrc: body.imageSrc !== undefined ? body.imageSrc : null,
            order: body.order,
            expectedActionResult: body.expectedActionResult !== undefined ? body.expectedActionResult : null,
        })
        .where(eq(challenges.id, params.challengeId))
        .returning();

    if (!data.length) return new NextResponse("Challenge not found", { status: 404 });
    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: { challengeId: number } }
) => {
    if (!getIsAdmin()) return new NextResponse("Unauthorized", { status: 403 });
    const data = await db.delete(challenges)
        .where(eq(challenges.id, params.challengeId))
        .returning();
    if (!data.length) return new NextResponse("Challenge not found", { status: 404 });
    return NextResponse.json(data[0]);
};