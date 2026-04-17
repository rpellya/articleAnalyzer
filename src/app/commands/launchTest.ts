import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { BOLD, CYAN, GRAY, GREEN, HR, NL, RED } from "../tools";

const ROOT = path.join(__dirname, "../../../");

export function cmdTest(group: string, verbose: boolean) {
  const jestBin = path.join(ROOT, "node_modules", ".bin", "jest");
  const jestOk = fs.existsSync(jestBin);

  console.log("jestBin", jestBin);
  console.log("jestOk", jestOk);

  NL();
  console.log(HR("═"));
  console.log(BOLD(CYAN("  МОДУЛЬНОЕ ТЕСТИРОВАНИЕ  ·  Jest + ts-jest")));
  console.log(
    GRAY("  Дисциплина: Методы тестирования программного обеспечения")
  );
  console.log(HR("═"));
  NL();

  if (jestOk) {
    const jestArgs = ["--colors", "--verbose"];
    if (!verbose) jestArgs.push("--silent"); // убираем лишний шум
    if (group !== "all") {
      // Фильтруем по файлу/группе{
      const fileMap = {
        equiv: "loader.test.ts|validator.test.ts",
        boundary: "pagerank.test.ts|loader.test.ts",
        branch: "graph.test.ts|pagerank.test.ts",
        condition: "validator.test.ts",
      };
      if (fileMap[group as keyof typeof fileMap]) {
        jestArgs.push(
          "--testPathPattern",
          fileMap[group as keyof typeof fileMap]
        );
      }
    }

    NL();

    const result = spawnSync(
      jestBin,
      [
        "--colors",
        "--verbose",
        ...(group !== "all"
          ? [
              "--testPathPattern",
              {
                equiv: "loader|validator",
                boundary: "pagerank|loader",
                branch: "graph|pagerank",
                condition: "validator",
              }[group] || "",
            ]
          : ["--testPathPatterns", "__tests__"]),
      ],
      {
        cwd: ROOT,
        stdio: "inherit",
        shell: process.platform === "win32",
      }
    );

    NL();
    if (result.status === 0) {
      console.log(GREEN(BOLD("  ✓ All tests passed")));
    } else {
      console.log(RED(BOLD("  ✗ Some tests failed")));
    }
  }
}
