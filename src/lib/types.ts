type LooseUnion<T extends string> = T | (string & {})

export type LeadSource = LooseUnion<"Form" | "Chatbot" | "FB Ads" | "Voicemail" | "CSV Import" | "Standard">
export type LeadStatus = LooseUnion<
  | "Unqualified(new)"
  | "Hot - Awaiting Follow-up"
  | "Warm Lead"
  | "Cold Lead"
  | "SDR Review"
  | "Followed-up"
  | "Failed to Contact"
  | "Archived"
>
export type LeadScore = LooseUnion<"Hot" | "Warm" | "Cold">
export type FollowupStatus = LooseUnion<"Complete" | "Not Started">
export type EscalationStatus = LooseUnion<"Pending" | "Escalated" | "Manual">

export type UserRecord = {
  id: string
  name: string
  email: string
  passwordHash: string
  clientId: string
  clientName?: string
}

export type ClientRecord = {
  id: string
  name: string
  contact?: string
  email?: string
}

export type LeadRecord = {
  id: string
  clientId: string
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
  source: LeadSource
  status: LeadStatus
  score?: LeadScore
  scoringReason?: string
  voicemailSummary?: string
  recordingUrl?: string
  manualReview?: boolean
  followupStatus?: FollowupStatus
  escalationStatus?: EscalationStatus
  crmSynced?: boolean
  createdTime?: string
}
