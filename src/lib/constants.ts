import type { components } from '../api/schema';

// The two contract slot labels (docs/contracts.md → Delivery slots). Typed against
// the generated CreateSlotDto union, so if the backend ever changes the allowed
// labels this array fails to compile until it's updated to match.
type SlotLabel = components['schemas']['CreateSlotDto']['label'];

export const SLOT_LABELS: SlotLabel[] = ['09:00–11:00', '11:00–13:00'];
