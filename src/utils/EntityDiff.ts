/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, isArray, uniq } from "lodash";
import { isDate } from "moment";

export type DiffType = "created" | "updated" | "deleted";
export type Primitive = number | string | boolean | Date | undefined;
export type Diff = { path: string[]; value?: Entity };
export type Entity = Record<string, any> | Primitive;

export class EntityDiff {
  private created: Diff[] = [];
  private updated: Diff[] = [];
  private deleted: Diff[] = [];

  constructor(private obj1: Entity, private obj2: Entity) {}

  public getDiff(): Record<DiffType, Diff[]> {
    this._diff(this.obj1, this.obj2);
    return {
      created: this.created,
      updated: this.updated,
      deleted: this.deleted,
    };
  }

  public getCreatedDiff(): Diff[] {
    return this.created;
  }

  public getUpdatedDiff(): Diff[] {
    return this.updated;
  }

  public getDeletedDiff(): Diff[] {
    return this.deleted;
  }

  private _diff(entity1: Entity, entity2: Entity, path: string[] = []): void {
    if (this.isPrimitive(entity1) || this.isPrimitive(entity2)) {
      this.updateDiffList(entity1, entity2, path);
      return;
    }

    const obj1 = entity1 as Record<string, any>;
    const obj2 = entity2 as Record<string, any>;

    const keys = uniq([...Object.keys(obj1), ...Object.keys(obj2)]);

    keys.forEach((key) => {
      const newPath = [...path, key];
      this._diff(obj1[key], obj2[key], newPath);
    });
  }

  private compareValues(value1: Entity, value2: Entity): DiffType | void {
    if (value1 === value2) {
      return;
    }
    if (
      isDate(value1) &&
      isDate(value2) &&
      value1.getTime() === value2.getTime()
    ) {
      return;
    }
    if (value1 === undefined) {
      return "created";
    }
    if (value2 === undefined) {
      return "deleted";
    }
    return "updated";
  }

  private isPrimitive(input: Entity): boolean {
    return !isObject(input) && !isArray(input);
  }

  private updateDiffList(value1: Entity, value2: Entity, path: string[]): void {
    const diffType = this.compareValues(value1, value2);
    switch (diffType) {
      case "created": {
        const diff: Diff = { path, value: value2 };
        this.created.push(diff);
        return;
      }
      case "updated": {
        const diff = { path, value: value2 };
        this.updated.push(diff);
        return;
      }
      case "deleted": {
        const diff = { path };
        this.deleted.push(diff);
        return;
      }
    }
    return;
  }
}
