import { DataParamType } from "@/types/Param";
import { DataValue } from "@/types/DataItem";

export class PlotIdentifier {
  private readonly IDENTITY_SYMBOL = "::";
  private readonly DELIMITER = ";";
  private facet: string;
  private category: string;
  private subgroup: string;

  constructor(
    private valueType: DataParamType = "number",
    facet?: DataValue,
    category?: DataValue,
    subgroup?: DataValue,
  ) {
    this.facet = typeof facet === "string" ? facet : "";
    this.category = typeof category === "string" ? category : "";
    this.subgroup = typeof subgroup === "string" ? subgroup : "";
  }

  public getFacet(): string {
    return this.facet;
  }

  public getSubgroup(): string {
    return this.subgroup;
  }

  public getCategory(): string {
    return this.category;
  }

  public getValueType(): DataParamType {
    return this.valueType;
  }

  public toString(): string {
    const facetExp = this.facet
      ? `facet${this.IDENTITY_SYMBOL}${this.facet}`
      : "";
    const categoryExp = this.category
      ? `category${this.IDENTITY_SYMBOL}${this.category}`
      : "";
    const subgroupExp =
      this.valueType === "string" && this.subgroup // subgroup only available when value type is number
        ? `subgroup${this.IDENTITY_SYMBOL}${this.subgroup}`
        : "";
    const exp = [facetExp, categoryExp, subgroupExp]
      .filter((exp) => exp !== "")
      .join(this.DELIMITER);

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
