export const toValidFileName = (s: string): string => {
  return s.trim().replace(/[/\\?%*:|"<>]/g, '-').replace(/-+/g, '-')
}