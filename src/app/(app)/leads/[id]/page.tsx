"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const STATUS = [
  "Unqualified(new)",
  "Hot - Awaiting Follow-up",
  "Warm Lead",
  "Cold Lead",
  "SDR Review",
  "Followed-up",
  "Failed to Contact",
  "Archived",
]

const SCORES = ["Hot", "Warm", "Cold"]

type Lead = {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  status?: string
  score?: string
  scoringReason?: string
  voicemailSummary?: string
  recordingUrl?: string
  manualReview?: boolean
  crmSynced?: boolean
  followupStatus?: string
  escalationStatus?: string
}

export default function LeadDetail() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((r) => r.json())
      .then(setLead)
  }, [id])

  if (!lead) return <div>Loading...</div>

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    })
    setSaving(false)
    if (!res.ok) return alert("Save failed")
    router.push("/leads")
  }

  return (
    <Card className="p-6 space-y-5">
      <h2 className="text-xl font-semibold mb-4">
        Lead Details – {lead.firstName} {lead.lastName}
      </h2>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            value={lead.firstName || ""}
            onChange={(e) => setLead({ ...lead, firstName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            value={lead.lastName || ""}
            onChange={(e) => setLead({ ...lead, lastName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={lead.email || ""}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            value={lead.phone || ""}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Status and Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={lead.status}
            onChange={(e) => setLead({ ...lead, status: e.target.value })}
            className="border rounded p-2 w-full"
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="score">Lead Score</Label>
          <select
            id="score"
            value={lead.score || ""}
            onChange={(e) =>
              setLead({ ...lead, score: e.target.value || undefined })
            }
            className="border rounded p-2 w-full"
          >
            <option value="">(none)</option>
            {SCORES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scoring Section */}
      <div>
        <Label htmlFor="scoringReason">Scoring Reason</Label>
        <Textarea
          id="scoringReason"
          placeholder="Enter reason for lead scoring decision"
          value={lead.scoringReason || ""}
          onChange={(e) =>
            setLead({ ...lead, scoringReason: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="voicemailSummary">Voicemail Summary</Label>
        <Textarea
          id="voicemailSummary"
          placeholder="Summarize the voicemail content"
          value={lead.voicemailSummary || ""}
          onChange={(e) =>
            setLead({ ...lead, voicemailSummary: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="recordingUrl">Recording URL</Label>
        <Input
          id="recordingUrl"
          placeholder="https://recording-link.com"
          value={lead.recordingUrl || ""}
          onChange={(e) =>
            setLead({ ...lead, recordingUrl: e.target.value })
          }
        />
      </div>

      {/* Flags */}
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!lead.manualReview}
            onChange={(e) =>
              setLead({ ...lead, manualReview: e.target.checked })
            }
          />
          Manual Review
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!lead.crmSynced}
            onChange={(e) =>
              setLead({ ...lead, crmSynced: e.target.checked })
            }
          />
          CRM Synced
        </label>
      </div>

      {/* Follow-up & Escalation */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="followupStatus">Follow-up Status</Label>
          <select
            id="followupStatus"
            value={lead.followupStatus || "Not Started"}
            onChange={(e) =>
              setLead({ ...lead, followupStatus: e.target.value })
            }
            className="border rounded p-2 w-full"
          >
            <option>Complete</option>
            <option>Not Started</option>
          </select>
        </div>

        <div>
          <Label htmlFor="escalationStatus">Escalation Status</Label>
          <select
            id="escalationStatus"
            value={lead.escalationStatus || "Pending"}
            onChange={(e) =>
              setLead({ ...lead, escalationStatus: e.target.value })
            }
            className="border rounded p-2 w-full"
          >
            <option>Pending</option>
            <option>Escalated</option>
            <option>Manual</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </Card>
  )
}
