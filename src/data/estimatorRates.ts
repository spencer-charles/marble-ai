import { EstimatorRates } from '@/types/marble';

/**
 * Placeholder estimator figures — clearly marked in the UI as awaiting the Owner/GM's
 * real historical production rates and pricing numbers. Editable inside Owner mode.
 */
export const DEFAULT_ESTIMATOR_RATES: EstimatorRates = {
  sqFtPerHour: {
    marble: 65,
    travertine: 55,
    terrazzo: 70,
    granite: 35,
    limestone: 60
  },
  hourlyRate: 145,
  lippageCutSqFtPerHour: 40,
  sealerSqFtPerGallon: 600,
  polishLbPer100SqFt: 1.5,
  commercialNightMultiplier: 1.25,
  fragileStoneRiskPct: 15
};
