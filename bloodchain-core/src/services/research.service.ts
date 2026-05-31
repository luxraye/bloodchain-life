/**
 * Helix research API — study registry, participants, research specimens.
 * Operational blood banking remains on BloodAsset / Mars Lab.
 */
import { prisma } from "../config";

export const listStudies = async () => {
  const studies = await prisma.study.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { participants: true, samples: true } },
    },
  });
  return studies.map((s) => ({
    id: s.id,
    code: s.code,
    title: s.title,
    sponsor: s.sponsor,
    principalInvestigator: s.principalInvestigator,
    status: s.status,
    protocolVersion: s.protocolVersion,
    ethicsRef: s.ethicsRef,
    ethicsExpiry: s.ethicsExpiry?.toISOString().slice(0, 10),
    sites: s.sites,
    participants: [],
    samples: [],
  }));
};

export const getStudyDetail = async (id: string) => {
  const study = await prisma.study.findUnique({
    where: { id },
    include: {
      participants: true,
      samples: {
        include: { custody: { orderBy: { createdAt: "asc" } } },
      },
      actionLogs: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!study) return null;

  return {
    id: study.id,
    code: study.code,
    title: study.title,
    sponsor: study.sponsor,
    principalInvestigator: study.principalInvestigator,
    status: study.status,
    protocolVersion: study.protocolVersion,
    ethicsRef: study.ethicsRef,
    ethicsExpiry: study.ethicsExpiry?.toISOString().slice(0, 10),
    sites: study.sites,
    participants: study.participants.map((p) => ({
      id: p.id,
      studyParticipantId: p.studyParticipantId,
      arm: p.arm,
      consent: p.consent,
      consentDate: p.consentDate?.toISOString().slice(0, 10) ?? null,
      site: p.site,
      enrolledAt: p.enrolledAt.toISOString().slice(0, 10),
    })),
    samples: study.samples.map((s) => ({
      id: s.externalSampleId,
      participantId: s.participantId,
      studyParticipantId: study.participants.find((p) => p.id === s.participantId)?.studyParticipantId,
      specimenType: s.specimenType,
      visit: s.visit,
      status: s.status,
      parentSampleId: s.parentSampleId,
      bloodAssetId: s.bloodAssetId,
      site: s.site,
      receiptQC: {
        acceptable: s.receiptAcceptable ?? true,
        tempRange: s.receiptTempRange,
        coldChainPreserved: s.receiptAcceptable ?? true,
        packagingIntact: s.receiptAcceptable ?? true,
      },
      custodyEvents: s.custody.map((c) => ({
        id: c.id,
        sampleId: s.externalSampleId,
        status: c.status,
        actorName: c.actorName,
        actorRole: c.actorRole,
        location: c.location,
        notes: c.notes,
        createdAt: c.createdAt.toISOString(),
      })),
    })),
    worksheets: [],
    deviations: [],
    actionLog: study.actionLogs.map((a) => ({
      action: a.actionPerformed,
      userName: a.userName,
      userRole: a.userRole,
      facility: a.facility,
      field: a.fieldChanged,
      oldValue: a.oldValue,
      newValue: a.newValue,
      reason: a.reason,
      createdAt: a.createdAt.toISOString(),
    })),
  };
};
