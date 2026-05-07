import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status  = searchParams.get("status");
    const search  = searchParams.get("search");
    const page    = parseInt(searchParams.get("page") ?? "1");
    const limit   = parseInt(searchParams.get("limit") ?? "20");

    // In production, replace with:
    // const { prisma } = await import("@/lib/prisma");
    // const where = { ...(status && { status }), ...(search && { name: { contains: search, mode: "insensitive" } }) };
    // const [projects, total] = await Promise.all([
    //   prisma.project.findMany({ where, skip: (page-1)*limit, take: limit, include: { _count: true, company: true } }),
    //   prisma.project.count({ where }),
    // ]);

    const { mockProjects } = await import("@/lib/mock-data");
    const projects = mockProjects;
    const total    = projects.length;

    return NextResponse.json({ projects, total, page, limit });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, address, budget, startDate, endDate } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // In production:
    // const project = await prisma.project.create({ data: { name, description, address, budget, startDate, endDate, companyId: session.user.companyId } });

    const project = {
      id: `p-${Date.now()}`, name, description, address,
      budget: budget ? parseFloat(budget) : null,
      startDate, endDate, status: "ACTIVE" as const,
      companyId: "c1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
