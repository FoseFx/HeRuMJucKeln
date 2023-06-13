export function getParentPage(route: ReturnType<typeof useRoute>) {
  return route.fullPath.split("/").slice(0, -1).join("/");
}
