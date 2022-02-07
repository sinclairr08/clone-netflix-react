export function makeImagePath(id: string, format?: string) {
  if (id === "") return ``;
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function makeOverviewShorten(overview: string) {
  if (overview === "") {
    return "No Overview on this content";
  } else if (overview.length < 200) {
    return overview;
  } else {
    return `${overview.slice(0, 200)}...`;
  }
}
