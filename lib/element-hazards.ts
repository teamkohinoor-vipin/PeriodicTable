import type { Element, Hazard } from "@/types/element"

export function getHazardData(element: Element | null): Hazard[] {
  if (!element) return []

  const hazards: Hazard[] = []
  const symbol = element.symbol

  // Radioactive elements
  if (
    [
      "U",
      "Pu",
      "Ra",
      "Th",
      "Rn",
      "Po",
      "Tc",
      "Sr",
      "Am",
      "Cf",
      "Cm",
      "Np",
      "Pa",
      "Ac",
      "Pm",
      "Fr",
      "At",
      "Bi",
      "Es",
      "Fm",
      "Md",
      "No",
      "Lr",
    ].includes(symbol)
  ) {
    hazards.push({ type: "radioactive", label: "Radioactive", emoji: "☢️" })
  }

  // Toxic elements
  if (
    [
      "Be",
      "As",
      "Pb",
      "Hg",
      "Cd",
      "Tl",
      "Os",
      "Po",
      "Pu",
      "F",
      "Cl",
      "Br",
      "I",
      "Sb",
      "Te",
      "Ba",
      "Cs",
      "Li",
      "Na",
      "K",
      "Rb",
      "V",
      "Cr",
      "Co",
      "Ni",
      "Se",
      "P",
      "U",
    ].includes(symbol)
  ) {
    hazards.push({ type: "toxic", label: "Toxic", emoji: "☠️" })
  }

  // Extremely toxic elements should be marked as very dangerous
  if (["Pb", "Hg", "Cd", "As", "Be", "Tl", "Po", "F"].includes(symbol)) {
    hazards.push({ type: "extreme-toxic", label: "Extremely Toxic", emoji: "⚠️" })
  }

  // Carcinogenic elements
  if (["Be", "Cd", "Ni", "As", "Cr"].includes(symbol)) {
    hazards.push({ type: "carcinogenic", label: "Carcinogenic", emoji: "🧬" })
  }

  // Corrosive elements
  if (["F", "Cl", "Br", "I", "Li", "Na", "K", "Rb", "Cs", "Fr"].includes(symbol)) {
    hazards.push({ type: "corrosive", label: "Corrosive", emoji: "🧪" })
  }

  // Flammable elements
  if (["H", "Li", "Na", "K", "Rb", "Cs", "P", "Mg", "Al", "Fe", "Ti", "Zr", "Ce"].includes(symbol)) {
    hazards.push({ type: "flammable", label: "Flammable", emoji: "🔥" })
  }

  // Reacts with water
  if (["Li", "Na", "K", "Rb", "Cs", "Fr", "Ca", "Sr", "Ba"].includes(symbol)) {
    hazards.push({ type: "water-reactive", label: "Reacts with Water", emoji: "💧" })
  }

  // Asphyxiant gases
  if (["He", "Ne", "Ar", "Kr", "Xe", "Rn", "N", "H"].includes(symbol)) {
    hazards.push({ type: "asphyxiant", label: "Asphyxiant at High Concentrations", emoji: "😮‍💨" })
  }

  // Pyrophoric (ignites in air)
  if (["Li", "Na", "K", "Rb", "Cs", "P", "Ce"].includes(symbol)) {
    hazards.push({ type: "pyrophoric", label: "Pyrophoric", emoji: "💥" })
  }

  // Oxidizer (supports combustion)
  if (["O", "F", "Cl", "Br"].includes(symbol)) {
    hazards.push({ type: "oxidizer", label: "Oxidizer", emoji: "⚗️" })
  }

  // Other special hazards
  switch (symbol) {
    case "H":
      hazards.push({ type: "special", label: "Invisible flame", emoji: "👻" })
      break
    case "C":
      hazards.push({ type: "special", label: "Dust can be explosive", emoji: "💨" })
      break
    case "P":
      hazards.push({ type: "special", label: "White phosphorus glows in dark", emoji: "✨" })
      break
    case "F":
      hazards.push({ type: "special", label: "Most reactive non-metal", emoji: "⚡" })
      break
    case "Hg":
      hazards.push({ type: "special", label: "Bioaccumulates", emoji: "🧠" })
      break
    case "Pb":
      hazards.push({ type: "special", label: "Neurotoxin", emoji: "🧠" })
      break
    case "Te":
      hazards.push({ type: "special", label: "Causes garlic breath", emoji: "🧄" })
      break
    case "Rn":
      hazards.push({ type: "special", label: "Accumulates in buildings", emoji: "🏠" })
      break
    case "W":
      hazards.push({ type: "special", label: "Highest melting point", emoji: "🔆" })
      break
    case "Os":
      hazards.push({ type: "special", label: "Densest natural element", emoji: "🏋️" })
      break
    case "Bi":
      hazards.push({ type: "special", label: "Used in medicines for stomach upset", emoji: "💊" })
      break
  }

  return hazards
}

