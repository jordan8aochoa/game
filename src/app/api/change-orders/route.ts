import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status    = searchParams.get("status");
    const page      = parseInt(searchParams.get("page") ?? "1");
    const limit     = parseInt(searchParams.get("limit") ?? "20");

    const { mockChangeOrders } = await import("@/lib/mock-data");
    let items = [...mockChangeOrders];
    if (projectId) items = items.filter((co) => co.projectId === projectId);
    if (status)    items = items.filter((co) => co.status === status);

    return NextResponse.json({
      changeOrders: items.slice((page - 1) * limit, page * limit),
      total:        items.length,
      page,
      limit,
    });
  } catch (err) {
    console.error("GET /api/change-orders error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, projectId, priority, laborCost, materialCost, equipmentCost, markupPercent } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: "Title and projectId are required" }, { status: 400 });
    }

    const subtotal  = (laborCost ?? 0) + (materialCost ?? 0) + (equipmentCost ?? 0);
    const totalCost = subtotal * (1 + (markupPercent ?? 0) / 100);

    const changeOrder = {
      id: `co-${Date.now()}`,
      number: `CO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      title, description, projectId,
      status:        "DRAFT" as const,
      priority:      priority ?? "MEDIUM",
      version:       1,
      createdById:   "u1",
      laborCost:     laborCost ?? 0,
      materialCost:  materialCost ?? 0,
      equipmentCost: equipmentCost ?? 0,
      markupPercent: markupPercent ?? 0,
      totalCost,
      createdAt:     new Date().toISOString(),
      updatedAt:     new Date().toISOString(),
    };

    return NextResponse.json(changeOrder, { status: 201 });
  } catch (err) {
    console.error("POST /api/change-orders error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
