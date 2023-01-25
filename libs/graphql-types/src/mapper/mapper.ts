export abstract class GraphqlResultMapper<E, R> {
  abstract toError(error: Error): R;

  abstract toResult(entity: E): R;
}
