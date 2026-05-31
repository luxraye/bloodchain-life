import { prisma } from "../config";

function mapPatient(p: {
  id: string;
  registryId: string;
  displayName: string;
  condition: string;
  bloodType: string | null;
  severity: string | null;
  site: string | null;
  enrolledAt: Date;
  nextReview: Date | null;
  notes: string | null;
  sdohFlags: string[];
  carePlanJson: unknown;
  careGaps: { id: string; gapType: string; severity: string; status: string; summary: string }[];
  transfusions: { eventDate: Date; product: string; units: string | null; site: string | null }[];
}) {
  const carePlan = (p.carePlanJson as Record<string, unknown>) || {
    custodian: p.site,
    prophylaxis: "",
    target: "",
    goals: [],
  };
  return {
    id: p.id,
    registryId: p.registryId,
    name: p.displayName,
    condition: p.condition,
    bloodType: p.bloodType,
    severity: p.severity,
    site: p.site,
    enrolledAt: p.enrolledAt.toISOString().slice(0, 10),
    nextReview: p.nextReview?.toISOString().slice(0, 10) ?? null,
    notes: p.notes,
    sdohFlags: p.sdohFlags,
    carePlan,
    careGaps: p.careGaps.map((g) => ({
      id: g.id,
      type: g.gapType,
      severity: g.severity,
      status: g.status,
      summary: g.summary,
    })),
    transfusions: p.transfusions.map((t) => ({
      date: t.eventDate.toISOString().slice(0, 10),
      product: t.product,
      units: t.units,
      site: t.site,
    })),
    auditLog: [],
  };
}

export const listPatients = async () => {
  const rows = await prisma.chronicPatient.findMany({
    include: { careGaps: true, transfusions: { orderBy: { eventDate: "desc" } } },
    orderBy: { registryId: "asc" },
  });
  return rows.map(mapPatient);
};

export const listExceptions = async () => {
  const rows = await prisma.registryException.findMany({
    include: { patient: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((e) => ({
    id: e.id,
    patientId: e.patientId,
    patientName: e.patient.displayName,
    registryId: e.patient.registryId,
    type: e.exType,
    severity: e.severity,
    status: e.status,
    assignee: e.assignee,
    summary: e.summary,
    createdAt: e.createdAt.toISOString(),
  }));
};

export const patchException = async (id: string, data: { status?: string; assignee?: string }) => {
  const row = await prisma.registryException.update({
    where: { id },
    data: {
      status: data.status as never,
      assignee: data.assignee,
    },
    include: { patient: true },
  });
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patient.displayName,
    registryId: row.patient.registryId,
    type: row.exType,
    severity: row.severity,
    status: row.status,
    assignee: row.assignee,
    summary: row.summary,
    createdAt: row.createdAt.toISOString(),
  };
};
