import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  isValidProjectUuid,
  reassignUnownedProjectIds,
  rowToSavedProject,
  savedProjectToRow,
} from "@/lib/projects/sync";
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
    activeProjectId?: string | null;
    project?: {
      id?: string;
      name: string;
      config: PlotConfig;
      location?: LocationInfo | null;
    };
  };

  if (body.projects?.length) {
    const validProjects = body.projects.filter((p) => isValidProjectUuid(p.id));
    if (validProjects.length === 0) {
      return NextResponse.json(
        { error: "Aucun projet valide à synchroniser" },
        { status: 400 }
      );
    }

    const { data: ownedRows, error: ownedError } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id);

    if (ownedError) {
      return NextResponse.json({ error: ownedError.message }, { status: 500 });
    }

    const ownedIds = new Set((ownedRows ?? []).map((row) => row.id));

    const { projects: safeProjects, idRemap } = reassignUnownedProjectIds(
      validProjects,
      ownedIds
    );

    const rows = safeProjects.map((p) => savedProjectToRow(p, user.id));
    const updateRows = rows.filter((row) => ownedIds.has(row.id));
    const insertRows = rows.filter((row) => !ownedIds.has(row.id));

    if (updateRows.length > 0) {
      const { error: updateError } = await supabase
        .from("projects")
        .upsert(updateRows, { onConflict: "id" });

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    if (insertRows.length > 0) {
      const { error: insertError } = await supabase
        .from("projects")
        .insert(insertRows);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const projects = (data ?? []).map(rowToSavedProject);
    const remappedActive =
      body.activeProjectId && idRemap[body.activeProjectId]
        ? idRemap[body.activeProjectId]
        : body.activeProjectId;

    return NextResponse.json({
      projects,
      idRemap,
      activeProjectId:
        remappedActive &&
        projects.some((project) => project.id === remappedActive)
          ? remappedActive
          : (projects[0]?.id ?? null),
    });
  }

  if (!body.project?.name || !body.project.config) {
    return NextResponse.json({ error: "Projet invalide" }, { status: 400 });
  }

  let projectId = body.project.id ?? crypto.randomUUID();
  if (isValidProjectUuid(projectId)) {
    const { data: owned } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("id", projectId)
      .maybeSingle();
    if (!owned) {
      projectId = crypto.randomUUID();
    }
  }

  const draft: SavedProject = {
    id: projectId,
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
