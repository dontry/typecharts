export interface ComponentBuilderInterface<K> {
  getComponent(): K;
  build(): void;
}
