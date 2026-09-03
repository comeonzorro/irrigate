import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rowToSavedProject, savedProjectToRow } from "@/lib/projects/sync";
import type { SavedProject } from "@/lib/projects/types";
import type { LocationInfo, PlotConfig } from "@/lib/types";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ projects: [], configured: false });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: authError?.message ?? "Non authentifié" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    projects: (data ?? []).map(rowToSavedProject),
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: authError?.message ?? "Non authentifié" },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    projects?: SavedProject[];
    project?: {
      id?: string;
      name: string;
      config: PlotConfig;
      location?: LocationInfo | null;
    };
  };

  if (body.projects?.length) {
    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const validProjects = body.projects.filter((p) => uuidRe.test(p.id));
    if (validProjects.length === 0) {
      return NextResponse.json(
        { error: "Aucun projet valide à synchroniser" },
        { status: 400 }
      );
    }
    const rows = validProjects.map((p) => savedProjectToRow(p, user.id));
    const { data, error } = await supabase
      .from("projects")
      .upsert(rows, { onConflict: "id" })
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({
      projects: (data ?? []).map(rowToSavedProject),
    });
  }

  if (!body.project?.name || !body.project.config) {
    return NextResponse.json({ error: "Projet invalide" }, { status: 400 });
  }

  const draft: SavedProject = {
    id: body.project.id ?? crypto.randomUUID(),
    name: body.project.name,
    config: body.project.config,
    location: body.project.location ?? null,
    updatedAt: new Date().toISOString(),
    localOnly: false,
  };

  const { data, error } = await supabase
    .from("projects")
    .upsert(savedProjectToRow(draft, user.id))
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: rowToSavedProject(data) });
}
