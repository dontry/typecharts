import { deepMerge } from "@/utils/misc"

describe('deepMerge', () => {
  it("should combine two properties on same level ", () => {
    const a = {a:1}
    const b = {b:1}
    expect(deepMerge(a,b)).toEqual({a:1,b:1})
  })

  it("should overwrite property on same level ", () => {
    const a = {a:1}
    const a2 = {a:2}
    expect(deepMerge(a,a2)).toEqual({a:2})
  })

  it("should merge nested object", () => {

    const obj1 = {a: {
      a1:1,
      a2:2
    }}
    const obj2 = {
      a: {a1:3, a3:5},
      b: 5
    }
    expect(deepMerge(obj1, obj2)).toEqual({
      a: {
        a1: 3,
        a2: 2,
        a3: 5
      },
      b:5
    })
  })

  it("should merge two arrays", () => {
    const obj1= {a: [1,2,3,4]};
    const obj2 = {a: [5,6]};
    expect(deepMerge(obj1, obj2)).toEqual({a: [5,6,3,4]})
  })
})

