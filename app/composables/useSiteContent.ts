import site from "~~/content/site.json";
import projects from "~~/content/projects.json";
import categories from "~~/content/categories.json";
import news from "~~/content/news.json";

export function useSiteContent() {
  return {
    site,
    projects,
    categories,
    news,
    getProject(uid: string) {
      return projects.find((p) => p.uid === uid);
    },
    getMember(uid: string) {
      return site.members.find((m) => m.uid === uid);
    },
    featuredProjects() {
      const uids = site.homepage.featuredUids || [];
      return uids
        .map((uid) => projects.find((p) => p.uid === uid))
        .filter(Boolean);
    },
    filterProjects(category: string | null) {
      if (!category || category === "All") return projects;
      const needle = category.toLowerCase();
      return projects.filter((p) =>
        p.categories.some((c) => c.toLowerCase() === needle),
      );
    },
  };
}

export type Project = (typeof projects)[number];
