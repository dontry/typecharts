export interface ComponentBuilderInterface<T, K> {
  getComponent(): K;
  build(): void;
}
