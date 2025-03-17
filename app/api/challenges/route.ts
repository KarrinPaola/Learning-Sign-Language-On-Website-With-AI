import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { ne } from "drizzle-orm/sql";

export const GET = async () => {
    if (!getIsAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const data = await db.query.challenges.findMany(
        {
            // where: ne(challenges.type, "ACTION"),
        }
    );
    return NextResponse.json(data);
};

export const POST = async (req: Request) => {
    if (!getIsAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    // Validation cơ bản
    if (!body.lessonId || typeof body.lessonId !== "number") {
        return new NextResponse("Missing or invalid lessonId", { status: 400 });
    }
    if (!body.type || !["SELECT", "ASSIST", "ACTION"].includes(body.type)) {
        return new NextResponse("Missing or invalid type", { status: 400 });
    }
    if (!body.order || typeof body.order !== "number") {
        return new NextResponse("Missing or invalid order", { status: 400 });
    }
    if (body.type === "ACTION" && !body.expectedActionResult) {
        return new NextResponse("Missing expectedActionResult for ACTION type", { status: 400 });
    }

    const data = await db.insert(challenges).values({
        lessonId: body.lessonId,
        type: body.type,
        question: body.question || null,
        imageSrc: body.imageSrc || null,
        order: body.order,
        expectedActionResult: body.expectedActionResult || null,
    }).returning();

    return NextResponse.json(data[0]);
};