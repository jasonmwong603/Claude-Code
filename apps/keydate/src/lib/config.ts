/* Illustrative financial constants, centralised so they are easy to review and
   update as federal programs / rates change. These are estimates used to build
   a plan, NOT financial advice. Update LAST_REVIEWED whenever a value changes.

   Sources to check on review: CMHC (down-payment tiers, mortgage insurance),
   Department of Finance (FHSA $8K/yr, $40K lifetime; HBP $60K), and the
   qualifying-rate "stress test" rules. */

export const LAST_REVIEWED = '2026-07-15'

/** Illustrative fixed mortgage rate used for payment + affordability math. */
export const RATE = 0.045

/** Amortisation length in months (25 years). */
export const AMORT_MONTHS = 300

/** Gross Debt Service share of gross monthly income allotted to housing. */
export const GDS_SHARE = 0.32

/** Closing costs as a share of purchase price (land transfer, legal, etc.). */
export const CLOSING_RATE = 0.035

/** FHSA annual contribution room. */
export const FHSA_ANNUAL_CAP = 8000

/** Illustrative marginal tax rate used to estimate the FHSA refund. */
export const ILLUSTRATIVE_REFUND_RATE = 0.3

export const STORAGE_KEY = 'keydate-state-v1'
