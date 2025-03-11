import { Pattern } from "../types/patternTypes";

export function generatePatternTimeline(patterns: Pattern[], totalBars: number) {
    // Validation des entrées
    if (totalBars <= 0) throw new Error("Total bars must be positive");
    if (!Array.isArray(patterns)) throw new Error("Patterns must be an array");

    const timeline: (Pattern | null)[] = [];
  
    for (let bar = 1; bar <= totalBars; bar++) {
      // Chercher un pattern qui commence à cette mesure
      const pattern = patterns.find((p) => p.start === bar);
  
      // Vérifier si cette mesure est incluse dans un pattern existant
      // En tenant compte de la longueur du pattern et du nombre de répétitions
      const isCovered = patterns.some((p) => {
        const patternEnd = (p.start + p.length) * p.repeat;
        return p.start < bar && patternEnd >= bar;
      });
  
      if (pattern) {
        timeline.push(pattern);
      } else if (!isCovered) {
        timeline.push(null);
      }
    }
  
    return timeline;
}