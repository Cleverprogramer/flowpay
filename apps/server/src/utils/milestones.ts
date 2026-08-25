export const GOAL_MILESTONES = [25, 50, 75, 100] as const;

export function findCrossedMilestone(
  previousPercentage: number,
  newPercentage: number,
): number | null {
  let crossed: number | null = null;
  for (const milestone of GOAL_MILESTONES) {
    if (previousPercentage < milestone && newPercentage >= milestone) {
      crossed = milestone;
    }
  }
  return crossed;
}
