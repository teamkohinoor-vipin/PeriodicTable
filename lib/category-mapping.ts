// This file provides mapping between UI category names and actual data category names

export const categoryMapping: Record<string, string[]> = {
  nonmetal: ["diatomic nonmetal", "polyatomic nonmetal"],
  halogen: ["halogen"],
  "noble gas": ["noble gas"],
  "alkali metal": ["alkali metal"],
  "alkaline earth metal": ["alkaline earth metal"],
  "transition metal": ["transition metal", "probably transition metal"],
  "post-transition metal": ["post-transition metal", "probably post-transition metal"],
  metalloid: ["metalloid"],
  lanthanide: ["lanthanide"],
  actinide: ["actinide"],
}

// Function to get all elements of a specific UI category
export function getElementsByCategory(allElements: any[], categoryName: string): any[] {
  const categoryVariants = categoryMapping[categoryName.toLowerCase()] || [categoryName]

  return allElements.filter((element) => element.category && categoryVariants.includes(element.category.toLowerCase()))
}

