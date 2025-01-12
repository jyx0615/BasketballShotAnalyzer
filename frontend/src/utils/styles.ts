type ClassName = string | undefined | null | false;

export function cn(...classes: ClassName[]): string {
  return classes.filter(Boolean).join(' ');
}