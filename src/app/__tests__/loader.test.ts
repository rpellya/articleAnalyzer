import fs from "fs";
import { loadArticlesFromFile, normalizeArticles } from "../algorithm/loader";
import { RawArticle } from "../types";

jest.mock("fs");

describe("Loader and Validator", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("normalizeArticles throws error on missing id", async () => {
    const raw = [{ title: "No ID" }];
    await expect(normalizeArticles(raw as RawArticle[])).rejects.toThrow(
      /103.*id/
    );
  });

  test("normalizeArticles throws error on invalid year", async () => {
    const raw = [{ id: "1", title: "Test", year: "not a number" }];
    await expect(
      normalizeArticles(raw as unknown as RawArticle[])
    ).rejects.toThrow(/103.*year/);
  });

  test("loadArticlesFromFile throws error 101 if file not found", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    await expect(loadArticlesFromFile("missing.json", true)).rejects.toThrow(
      /101/
    );
  });

  test("loadArticlesFromFile throws error 102 on invalid JSON", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("invalid json");
    await expect(loadArticlesFromFile("invalid.json", true)).rejects.toThrow(
      /102/
    );
  });

  test("loadArticlesFromFile successfully loads valid articles", async () => {
    const mockArticles = [
      { id: "a1", title: "Article 1", year: 2020, citations: [] },
    ];
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockArticles)
    );
    const result = await loadArticlesFromFile("valid.json", true);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a1");
  });
});
