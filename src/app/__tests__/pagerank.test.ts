import { Article } from "../types";
import { buildDense, buildSparse } from "../algorithm/graph";
import { pagerankDense, pagerankSparse } from "../algorithm/pagerank";

describe("PageRank – Полный набор тестов по методикам проектирования", () => {
  // Тестовые графы
  const articlesWithDangling: Article[] = [
    { id: "a", title: "A", authors: [], year: 2020, citations: ["b"] },
    { id: "b", title: "B", authors: [], year: 2020, citations: [] }, // висячая
  ];

  const articlesAllOut: Article[] = [
    { id: "x", title: "X", authors: [], year: 2020, citations: ["y"] },
    { id: "y", title: "Y", authors: [], year: 2020, citations: ["x"] },
  ];

  const graphSparseDangling = buildSparse(articlesWithDangling);
  const graphDenseDangling = buildDense(articlesWithDangling);

  const graphSparseNoDangling = buildSparse(articlesAllOut);
  const graphDenseNoDangling = buildDense(articlesAllOut);

  const emptyGraph = { n: 0, outLinks: [], inLinks: [], outDegree: [] };
  const singleNodeGraph = buildSparse([
    { id: "s", title: "S", authors: [], year: 2020, citations: [] },
  ]);

  // 1. ТЕСТЫ НА ОСНОВЕ РАЗБИЕНИЯ НА КЛАССЫ ЭКВИВАЛЕНТНОСТИ (EP)
  describe("Equivalence Partitioning (EP)", () => {
    // Неоптимизированные тесты (один тест – один TESTCOVER)
    describe("Неоптимизированные тесты (табл. 2.2 – 2.5)", () => {
      // TESTCOVER 1-2 (iterations)
      test("TC1: iterations=20 (валидный) – TESTCOVER 1", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr).toHaveLength(2);
      });
      test("TC2: iterations=0 (невалидный) – TESTCOVER 2", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, 0)).toThrow(
          /Iterations must be >= 1/
        );
      });

      // Таблица 2.3: TESTCOVER 3-5 (damping)
      test("TC3: damping=0.85 (валидный) – TESTCOVER 3", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr).toHaveLength(2);
      });
      test("TC4: damping=0 (невалидный) – TESTCOVER 4", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0, 20)).toThrow(
          /Damping must be in \(0,1\)/
        );
      });
      test("TC5: damping=1.0 (невалидный) – TESTCOVER 5", () => {
        expect(() => pagerankSparse(graphSparseDangling, 1.0, 20)).toThrow(
          /Damping must be in \(0,1\)/
        );
      });

      // Таблица 2.4: TESTCOVER 6-7 (размер графа)
      test("TC6: n=7 (непустой граф) – TESTCOVER 6", () => {
        const graph7 = buildSparse(
          Array(7).fill({
            id: "x",
            title: "X",
            authors: [],
            year: 2020,
            citations: [],
          })
        );
        const pr = pagerankSparse(graph7, 0.85, 20);
        expect(pr).toHaveLength(7);
      });
      test("TC7: n=0 (пустой граф) – TESTCOVER 7", () => {
        const pr = pagerankSparse(emptyGraph, 0.85, 20);
        expect(pr).toEqual([]);
      });

      // Таблица 2.5: TESTCOVER 8-9 (висячие вершины)
      test("TC8: есть висячая вершина – TESTCOVER 8", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr).toBeDefined();
      });
      test("TC9: нет висячих вершин – TESTCOVER 9", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 20);
        expect(pr).toBeDefined();
      });
    });

    // Оптимизированные тесты (один тест – несколько TESTCOVER)
    describe("Оптимизированные тесты (табл. 2.6)", () => {
      test("MIN-1: покрывает TESTCOVER 1,3,6,8,10", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr).toHaveLength(2);
        expect(pr[0]).toBeGreaterThan(0);
      });
      test("MIN-2: покрывает TESTCOVER 2,11", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, 0)).toThrow();
      });
      test("MIN-3: покрывает TESTCOVER 4,11", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0, 20)).toThrow();
      });
      test("MIN-4: покрывает TESTCOVER 5,11", () => {
        expect(() => pagerankSparse(graphSparseDangling, 1.0, 20)).toThrow();
      });
      test("MIN-5: покрывает TESTCOVER 1,3,6,9,10", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 20);
        expect(pr).toHaveLength(2);
        expect(pr[0]).toBeCloseTo(pr[1], 5);
      });
    });
  });

  // 2. ТЕСТЫ НА ОСНОВЕ АНАЛИЗА ГРАНИЧНЫХ ЗНАЧЕНИЙ (BVA)
  describe("Boundary Value Analysis (BVA)", () => {
    // Неоптимизированные тесты (табл. 2.8)
    describe("Неоптимизированные тесты (табл. 2.8)", () => {
      test("TC1: iterations = 1 (мин. валидное) – TESTCOVER 1", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toHaveLength(2);
      });
      test("TC2: iterations = 0 – TESTCOVER 2", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, 0)).toThrow();
      });
      test("TC3: iterations = -1 – TESTCOVER 3", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, -1)).toThrow();
      });
      test("TC4: damping = 0.01 – TESTCOVER 4", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.01, 20);
        expect(pr).toHaveLength(2);
      });
      test("TC5: damping = 0.99 – TESTCOVER 5", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.99, 20);
        expect(pr).toHaveLength(2);
      });
      test("TC6: damping = 0 – TESTCOVER 6", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0, 20)).toThrow();
      });
      test("TC7: damping = 1 – TESTCOVER 7", () => {
        expect(() => pagerankSparse(graphSparseDangling, 1, 20)).toThrow();
      });
      test("TC8: n = 1 – TESTCOVER 8", () => {
        const pr = pagerankSparse(singleNodeGraph, 0.85, 20);
        expect(pr).toHaveLength(1);
        expect(pr[0]).toBeCloseTo(1.0, 5);
      });
      test("TC9: n = 0 – TESTCOVER 9", () => {
        const pr = pagerankSparse(emptyGraph, 0.85, 20);
        expect(pr).toEqual([]);
      });
    });

    // Для BVA оптимизация не предполагалась, но можно добавить параметризованный тест как пример оптимизации
    test("Параметризованный BVA тест (оптимизация через test.each)", () => {
      const cases = [
        [1, 0.85, "success"],
        [0, 0.85, "error"],
        [-1, 0.85, "error"],
        [20, 0.01, "success"],
        [20, 0.99, "success"],
        [20, 0, "error"],
        [20, 1, "error"],
      ] as const;
      cases.forEach(([iter, damp, expected]) => {
        if (expected === "error") {
          expect(() =>
            pagerankSparse(graphSparseDangling, damp, iter)
          ).toThrow();
        } else {
          expect(() =>
            pagerankSparse(graphSparseDangling, damp, iter)
          ).not.toThrow();
        }
      });
    });
  });

  // 3. ТЕСТИРОВАНИЕ ОПЕРАТОРОВ (STATEMENT TESTING)
  describe("Statement Testing", () => {
    // Неоптимизированные тесты (по одному на каждый оператор)
    describe("Неоптимизированные тесты (14 операторов)", () => {
      test("ST1: Statement 2 – if (iterations < 1) throw... (TRUE)", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, 0)).toThrow();
      });
      test("ST2: Statement 3 – if (damping <=0 || damping>=1) throw... (TRUE)", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0, 20)).toThrow();
      });
      test("ST3: Statement 4 – const { n, outDegree, outLinks } = graph", () => {
        // Выполняется всегда при успешном вызове
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr).toBeDefined();
      });
      test("ST4: Statement 5 – let pr = Array(n).fill(1/n)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr[0]).toBeCloseTo(0.35); // начальное приближение проверяется косвенно
      });
      test("ST5: Statement 6 – for (let k=0; k<iterations; k++)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toHaveLength(2);
      });
      test("ST6: Statement 7 – const newPr = Array(n).fill((1-damping)/n)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("ST7: Statement 8 – for (let v=0; v<n; v++)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toHaveLength(2);
      });
      test("ST8: Statement 9 – if (outDegree[v] > 0) (TRUE)", () => {
        // Используем граф, где у всех outDegree>0
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("ST9: Statement 10 – const c = (damping * pr[v]) / outDegree[v]", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("ST10: Statement 11 – for (const j of outLinks[v]) newPr[j] += c", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("ST11: Statement 13 – const c = (damping * pr[v]) / n (else branch)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1); // у второй вершины outDegree=0
        expect(pr).toBeDefined();
      });
      test("ST12: Statement 14 – for (let j=0; j<n; j++) newPr[j] += c", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("ST13: Statement 17 – pr = newPr", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 2);
        expect(pr).toBeDefined();
      });
      test("ST14: Statement 19 – return pr", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toBeInstanceOf(Array);
      });
    });

    // Оптимизированные тесты (табл. 2.10)
    describe("Оптимизированные тесты (табл. 2.10)", () => {
      test("MIN-ST1: покрывает TESTCOVER 1 (iterations = 0)", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, 0)).toThrow();
      });
      test("MIN-ST2: покрывает TESTCOVER 2 (damping = 0)", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0, 20)).toThrow();
      });
      test("MIN-ST3: покрывает TESTCOVER 3,4,5,6,7,8,9,10,13,14 (граф без висячих)", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 20);
        expect(pr).toHaveLength(2);
        expect(pr[0]).toBeCloseTo(0.5, 5);
      });
      test("MIN-ST4: покрывает TESTCOVER 3,4,5,6,7,8,11,12,13,14 (граф с висячей вершиной)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr).toHaveLength(2);
        expect(pr[1]).toBeGreaterThan(pr[0]);
      });
    });
  });

  // 4. ТЕСТИРОВАНИЕ ВЕТВЛЕНИЙ (BRANCH TESTING)
  describe("Branch Testing", () => {
    // Неоптимизированные тесты (по одному на каждый исход)
    describe("Неоптимизированные тесты (13 исходов)", () => {
      test("BR1: if (iterations<1) – TRUE", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, 0)).toThrow();
      });
      test("BR2: if (iterations<1) – FALSE", () => {
        expect(() =>
          pagerankSparse(graphSparseDangling, 0.85, 20)
        ).not.toThrow();
      });
      test("BR3: if (damping<=0||damping>=1) – TRUE", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0, 20)).toThrow();
      });
      test("BR4: if (damping<=0||damping>=1) – FALSE", () => {
        expect(() =>
          pagerankSparse(graphSparseDangling, 0.85, 20)
        ).not.toThrow();
      });
      test("BR5: for (let k...) – TRUE (хотя бы одна итерация)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("BR6: for (let k...) – FALSE (iterations=0)", () => {
        // iterations=0 уже обработано в BR1
      });
      test("BR7: for (let v...) – TRUE (n>0)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toHaveLength(2);
      });
      test("BR8: for (let v...) – FALSE (n=0)", () => {
        const pr = pagerankSparse(emptyGraph, 0.85, 1);
        expect(pr).toEqual([]);
      });
      test("BR9: if (outDegree[v]>0) – TRUE", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("BR10: if (outDegree[v]>0) – FALSE", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("BR11: for (const j of outLinks[v]) – TRUE (есть соседи)", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("BR12: for (const j of outLinks[v]) – FALSE (нет соседей, outLinks[v] пуст)", () => {
        const graphIsolated = buildSparse([
          { id: "i", title: "I", authors: [], year: 2020, citations: [] },
        ]);
        const pr = pagerankSparse(graphIsolated, 0.85, 1);
        expect(pr).toBeDefined();
      });
      test("BR13: for (let j=0; j<n; j++) – TRUE (в ветке else)", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 1);
        expect(pr).toBeDefined();
      });
    });

    // Оптимизированные тесты (табл. 2.12)
    describe("Оптимизированные тесты (табл. 2.12)", () => {
      test("MIN-BR1: покрывает TESTCOVER 1,6", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0.85, 0)).toThrow();
      });
      test("MIN-BR2: покрывает TESTCOVER 3", () => {
        expect(() => pagerankSparse(graphSparseDangling, 0, 20)).toThrow();
      });
      test("MIN-BR3: покрывает TESTCOVER 2,4,5,7,9,11", () => {
        const pr = pagerankSparse(graphSparseNoDangling, 0.85, 20);
        expect(pr).toBeDefined();
      });
      test("MIN-BR4: покрывает TESTCOVER 2,4,5,7,9,10,13", () => {
        const pr = pagerankSparse(graphSparseDangling, 0.85, 20);
        expect(pr).toBeDefined();
      });
      test("MIN-BR5: покрывает TESTCOVER 8", () => {
        const pr = pagerankSparse(emptyGraph, 0.85, 20);
        expect(pr).toEqual([]);
      });
      test("MIN-BR6: покрывает TESTCOVER 12", () => {
        const graphIsolated = buildSparse([
          { id: "i", title: "I", authors: [], year: 2020, citations: [] },
        ]);
        const pr = pagerankSparse(graphIsolated, 0.85, 20);
        expect(pr).toHaveLength(1);
      });
    });
  });

  // 5. СРАВНЕНИЕ РЕЗУЛЬТАТОВ ДВУХ АЛГОРИТМОВ (обязательно по заданию)
  describe("Сравнение pagerankSparse и pagerankDense", () => {
    test("Результаты совпадают с высокой точностью для графа с висячей вершиной", () => {
      const prSparse = pagerankSparse(graphSparseDangling, 0.85, 30);
      const prDense = pagerankDense(graphDenseDangling, 0.85, 30);
      prSparse.forEach((val, i) => {
        expect(val).toBeCloseTo(prDense[i], 9);
      });
    });

    test("Результаты совпадают для графа без висячих вершин", () => {
      const prSparse = pagerankSparse(graphSparseNoDangling, 0.85, 30);
      const prDense = pagerankDense(graphDenseNoDangling, 0.85, 30);
      prSparse.forEach((val, i) => {
        expect(val).toBeCloseTo(prDense[i], 9);
      });
    });
  });
});
