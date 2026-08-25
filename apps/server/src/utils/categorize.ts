export type RuleMatchType = "contains" | "starts_with" | "exact";

export interface CategoryRule {
  keyword: string;
  matchType: RuleMatchType;
  priority: number;
  categoryId: string;
}

export function matchCategory(
  description: string,
  rules: CategoryRule[],
): string | null {
  const normalized = description.trim().toLowerCase();
  if (!normalized) return null;

  const ordered = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of ordered) {
    const keyword = rule.keyword.trim().toLowerCase();
    if (!keyword) continue;

    if (
      rule.matchType === "contains" &&
      normalized.includes(keyword)
    )
      return rule.categoryId;
    if (
      rule.matchType === "starts_with" &&
      normalized.startsWith(keyword)
    )
      return rule.categoryId;
    if (rule.matchType === "exact" && normalized === keyword)
      return rule.categoryId;
  }

  return null;
}
