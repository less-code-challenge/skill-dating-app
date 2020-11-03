export function splitSkills(commaSeparatedSkills: string | undefined | null): string[] {
  return (commaSeparatedSkills && commaSeparatedSkills.split(',')) || [];
}
