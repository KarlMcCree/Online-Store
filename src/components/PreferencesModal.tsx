import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useShop, UserPreferences } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

const DESTINATIONS = ["United Kingdom", "Canada", "United States", "Australia", "Germany", "Ireland", "UAE"];
const LEVELS = ["Undergraduate", "Postgraduate", "PhD", "Work Visa", "Permanent Residency", "Second Passport"];
const BUDGETS = ["Under $5k", "$5k – $20k", "$20k – $50k", "$50k+"];
const INTERESTS = ["SOP help", "Visa documentation", "Scholarships", "IELTS / TOEFL prep", "University selection", "Job search abroad"];

type Props = { open: boolean; onClose: () => void };

const PreferencesModal = ({ open, onClose }: Props) => {
  const { user } = useAuth();
  const { preferences, savePreferences } = useShop();
  const [draft, setDraft] = useState<UserPreferences>(preferences);

  const toggleInterest = (i: string) =>
    setDraft((d) => ({
      ...d,
      interests: d.interests.includes(i) ? d.interests.filter((x) => x !== i) : [...d.interests, i],
    }));

  const handleSave = () => {
    savePreferences(draft);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center mb-2">
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <DialogTitle className="font-display text-2xl">
            Welcome{user ? `, ${user.name}` : ""}! Let's personalize your journey.
          </DialogTitle>
          <DialogDescription className="font-body">
            A few quick answers help us recommend the right products and resources for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <Field label="Destination country">
            <Chips options={DESTINATIONS} value={draft.destination} onSelect={(v) => setDraft({ ...draft, destination: v })} />
          </Field>

          <Field label="Study level / migration goal">
            <Chips options={LEVELS} value={draft.studyLevel} onSelect={(v) => setDraft({ ...draft, studyLevel: v })} />
          </Field>

          <Field label="Budget tier">
            <Chips options={BUDGETS} value={draft.budget} onSelect={(v) => setDraft({ ...draft, budget: v })} />
          </Field>

          <Field label="Interests (select any)">
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => {
                const active = draft.interests.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={`px-3 py-1.5 rounded-full text-sm font-body border transition-colors ${
                      active
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "bg-background text-foreground border-border hover:border-secondary"
                    }`}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Anything else we should know? (optional)">
            <textarea
              value={draft.other ?? ""}
              onChange={(e) => setDraft({ ...draft, other: e.target.value })}
              rows={2}
              placeholder="E.g. I'm relocating with family, or I need help by August..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-body focus:outline-none focus:border-secondary"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground font-body">
            Skip for now
          </button>
          <button
            onClick={handleSave}
            className="bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-secondary/90 transition-colors font-body text-sm"
          >
            Save preferences
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body mb-2 block">{label}</label>
    {children}
  </div>
);

const Chips = ({ options, value, onSelect }: { options: string[]; value?: string; onSelect: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button
        key={o}
        type="button"
        onClick={() => onSelect(o)}
        className={`px-3 py-1.5 rounded-full text-sm font-body border transition-colors ${
          value === o
            ? "bg-secondary text-secondary-foreground border-secondary"
            : "bg-background text-foreground border-border hover:border-secondary"
        }`}
      >
        {o}
      </button>
    ))}
  </div>
);

export default PreferencesModal;
