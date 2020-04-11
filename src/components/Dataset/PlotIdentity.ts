import { DataParamType } from "@/types/Param";

export class PlotIdentifier {
  private readonly IDENTITY_SYMBOL = "::";
  private readonly DELIMITER = ";";

  constructor(
    private valueType: DataParamType = "number",
    private facet: string = "",
    private subgroup: string = "",
    private category: string = "",
  ) {}

  public getFacet(): string {
    return this.facet;
  }

  public getSubgroup(): string {
    return this.subgroup;
  }

  public getCategory(): string {
    return this.category;
  }

  public getvalueType(): DataParamType {
    return this.valueType;
  }

  public toString(): string {
    const facetExp = this.facet
      ? `facet${this.IDENTITY_SYMBOL}${this.facet}`
      : "";
    const categoryExp =
      this.valueType === "string" && this.category
        ? `subgroup${this.IDENTITY_SYMBOL}${this.subgroup}`
        : "";
    const subgroupExp = this.subgroup
      ? `subgroup${this.IDENTITY_SYMBOL}${this.subgroup}`
      : "";
    const exp = [facetExp, categoryExp, subgroupExp].join(this.DELIMITER);

    return exp;
  }

  public isEqual(identity: PlotIdentifier): boolean {
    return (
      this.valueType === identity.valueType &&
      this.facet === identity.facet &&
      this.subgroup === identity.subgroup &&
      this.category === identity.category
    );
  }

  public toSymbol(): symbol {
    const description = this.toString();
    return Symbol(description);
  }
}
