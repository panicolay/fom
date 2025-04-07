export function calculateTotalBars(
  length: number, // en secondes
  bpm: number,
  timeSignature: string,
): number {
  if (!length || !bpm || !timeSignature) {
    return 0
  }

  // Extraire le numérateur de la signature rythmique
  const [beatsPerBar] = timeSignature.split('/').map(Number)

  // Calculer le nombre total de temps
  const totalBeats = (length * bpm) / 60

  // Calculer le nombre de mesures
  const totalBars = Math.ceil(totalBeats / beatsPerBar)

  return totalBars
}
