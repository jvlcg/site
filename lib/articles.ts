import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ArticleFaq = { question: string; answer: string };

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  faq: ArticleFaq[];
};

export type Article = ArticleMeta & { content: string };

const ARTICLES_DIR = path.join(process.cwd(), "content", "artigos");

function parseFile(filename: string): Article {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).length;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated,
    category: data.category ?? "Medicina",
    tags: data.tags ?? [],
    faq: data.faq ?? [],
    readingMinutes: Math.max(2, Math.round(words / 200)),
    content,
  };
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parseFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  const file = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  return parseFile(`${slug}.mdx`);
}
