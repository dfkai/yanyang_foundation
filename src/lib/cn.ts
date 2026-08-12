/** 极简 class 拼接。本项目的用法很规整，不需要引入 clsx / tailwind-merge。 */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
