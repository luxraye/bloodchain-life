import { z } from 'zod'

export const viralMarkerSchema = z.enum(['NEGATIVE', 'POSITIVE', 'PENDING'])

export const viralScreeningSchema = z.object({
  hiv: viralMarkerSchema,
  hepB: viralMarkerSchema,
  hepC: viralMarkerSchema,
  syphilis: viralMarkerSchema,
})

export const labAssetStatusSchema = z.enum([
  'INCOMING',
  'TESTING',
  'RELEASED',
  'QUARANTINE',
  'BIOHAZARD',
  'DISCARDED',
])

export const custodyEventSchema = z.object({
  actor: z.string(),
  action: z.string(),
  time: z.string(),
})

export const labAssetSchema = z.object({
  id: z.string(),
  donorId: z.string(),
  collectionTimestamp: z.string(),
  expirationDate: z.string(),
  bloodType: z.string(),
  componentType: z.enum(['Whole Blood', 'Plasma', 'Platelets', 'RBC']),
  viralScreening: viralScreeningSchema,
  status: labAssetStatusSchema,
  chainOfCustody: z.array(custodyEventSchema),
})

export type ViralMarker = z.infer<typeof viralMarkerSchema>
export type ViralScreening = z.infer<typeof viralScreeningSchema>
export type LabAssetStatus = z.infer<typeof labAssetStatusSchema>
export type CustodyEvent = z.infer<typeof custodyEventSchema>
export type LabAsset = z.infer<typeof labAssetSchema>

