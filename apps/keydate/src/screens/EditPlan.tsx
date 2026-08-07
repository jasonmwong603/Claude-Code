import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { PlanForm, type PlanFormValues } from '../components/PlanForm'
import type { Plan } from '../types'

/** Edit an existing plan's inputs. Only the plan changes — saved progress
 *  (deposits, XP, badges, lessons) is untouched. */
export function EditPlan({
  plan,
  onSave,
  onCancel,
}: {
  plan: Plan
  onSave: (v: PlanFormValues) => void
  onCancel: () => void
}) {
  const source = plan.targetSource ?? 'area'
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        style={{
          background: 'none',
          border: 'none',
          color: C.sub,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          padding: '10px 0',
          fontFamily: BODY_FONT,
        }}
      >
        ← Back
      </button>
      <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 28, fontWeight: 700, margin: '4px 0 6px' }}>
        Edit your plan
      </h1>
      <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, margin: '0 0 22px' }}>
        Update anything below. Your saved deposits, XP, badges, and lessons stay exactly as they are.
      </p>

      <PlanForm
        initial={{
          locationText: plan.location,
          resolved: { name: plan.location, base: plan.base, source: 'current plan' },
          homeType: plan.homeType,
          income: plan.income,
          savings: plan.startingSavings,
          monthly: plan.monthly,
          targetSource: source,
          customPrice: source === 'custom' ? plan.target : '',
          targetLabel: plan.targetLabel ?? '',
          listingUrl: plan.listingUrl ?? '',
        }}
        submitLabel="Save changes"
        onSubmit={onSave}
        onCancel={onCancel}
      />
    </>
  )
}
