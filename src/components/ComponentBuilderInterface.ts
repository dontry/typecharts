export interface ComponentBuilderInterface<T, K> {
  getComponent(): K;
  reset(): void;
  build(): void;
}
