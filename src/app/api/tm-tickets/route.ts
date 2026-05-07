import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status    = searchParams.get("status");
    const page      = parseInt(searchParams.get("page") ?? "1");
    const limit     = parseInt(searchParams.get("limit") ?? "20");

    const { mockTMTickets } = await import("@/lib/mock-data");
    let items = [...mockTMTickets];
    if (projectId) items = items.filter((t) => t.projectId === projectId);
    if (status)    items = items.filter((t) => t.status === status);

    return NextResponse.json({
      tickets: items.slice((page - 1) * limit, page * limit),
      total:   items.length,
      page,
      limit,
    });
  } catch (err) {
    console.error("GET /api/tm-tickets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, projectId, laborEntries, materialEntries, signedBy, location, weatherCondition } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: "Title and projectId are required" }, { status: 400 });
    }

    const laborCost    = (laborEntries    ?? []).reduce((s: number, e: { hours: number; rate: number }) => s + e.hours * e.rate, 0);
    const materialCost = (materialEntries ?? []).reduce((s: number, e: { qty: number; cost: number })   => s + e.qty * e.cost, 0);
    const totalCost    = laborCost + materialCost;

    const ticket = {
      id: `tm-${Date.now()}`,
      number: `TM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      title, description, projectId,
      status:           "SUBMITTED" as const,
      date:             new Date().toISOString(),
      createdById:      "u1",
      laborCost,
      materialCost,
      equipmentCost:    0,
      totalCost,
      signedBy:         signedBy ?? null,
      signedAt:         signedBy ? new Date().toISOString() : null,
      location:         location ?? null,
      weatherCondition: weatherCondition ?? null,
      createdAt:        new Date().toISOString(),
      updatedAt:        new Date().toISOString(),
    };

    return NextResponse.json(ticket, { status: 201 });
  } catch (err) {
    console.error("POST /api/tm-tickets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
