import { EntityDiff } from "@/utils/EntityDiff";

describe("EntityDiff", () => {
  test("obj is unchanged", () => {
    const obj1 = { a: 3 };
    const obj2 = { a: 3 };
    const instance = new EntityDiff(obj1, obj2);
    const diff = instance.getDiff();

    expect(diff.created.length).toBe(0);
    expect(diff.updated.length).toBe(0);
    expect(diff.deleted.length).toBe(0);
  });
  test("obj is deleted", () => {
    const obj1 = { a: 3 };
    const obj2 = undefined;
    const instance = new EntityDiff(obj1, obj2);
    const diff = instance.getDiff();

    expect(diff.created.length).toBe(0);
    expect(diff.updated.length).toBe(0);
    expect(diff.deleted.length).toBe(1);
    expect(diff.deleted[0]).toEqual({ path: [] });
  });

  test("obj.a is updated", () => {
    const obj1 = { a: 3 };
    const obj2 = { a: 5 };
    const instance = new EntityDiff(obj1, obj2);
    const diff = instance.getDiff();

    expect(diff.created.length).toBe(0);
    expect(diff.updated).toEqual([{ path: ["a"], value: 5 }]);
    expect(diff.deleted.length).toBe(0);
  });

  test("obj.b is created", () => {
    const obj1 = { a: 3 };
    const obj2 = { a: 3, b: 1 };
    const instance = new EntityDiff(obj1, obj2);
    const diff = instance.getDiff();

    expect(diff.created).toEqual([{ path: ["b"], value: 1 }]);
    expect(diff.updated.length).toBe(0);
    expect(diff.deleted.length).toBe(0);
  });

  test("obj.a.a2 is created, object.c is updated, object.d is deleted", () => {
    const obj1 = { a: { a1: 1 }, b: 2, c: 3, d: 4 };
    const obj2 = { a: { a1: 1, a2: 2 }, b: 2, c: 6 };
    const instance = new EntityDiff(obj1, obj2);
    const diff = instance.getDiff();

    expect(diff.created).toEqual([{ path: ["a", "a2"], value: 2 }]);
    expect(diff.updated).toEqual([{ path: ["c"], value: 6 }]);
    expect(diff.deleted).toEqual([{ path: ["d"] }]);
  });
});
