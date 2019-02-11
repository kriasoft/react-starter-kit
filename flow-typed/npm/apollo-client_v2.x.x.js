// flow-typed signature: 776993e5b435ca317429cf5d829e25b4
// flow-typed version: cdb18a28cf/apollo-client_v2.x.x/flow_>=v0.57.x

declare module 'apollo-client' {
  /**
   * Types From graphql
   * graphql types are maintained in the graphql-js repo
   */
  declare type DocumentNode = any;
  declare type ExecutionResult<T> = {
    data?: T,
    extensions?: { [string]: any },
    errors?: any[],
  };
  declare type GraphQLError = any;
  /** End From graphql */

  declare type OperationVariables = { [key: string]: any };

  declare export function print(ast: any): string;

  declare export class ObservableQuery<T> extends Observable<
    ApolloQueryResult<T>,
  > {
    options: WatchQueryOptions;
    queryId: string;
    variables: { [key: string]: any };
    isCurrentlyPolling: boolean;
    shouldSubscribe: boolean;
    isTornDown: boolean;
    scheduler: QueryScheduler<any>;
    queryManager: QueryManager<any>;
    observers: Observer<ApolloQueryResult<T>>[];
    subscriptionHandles: SubscriptionLINK[];
    lastResult: ApolloQueryResult<T>;
    lastError: ApolloError;
    lastVariables: { [key: string]: any };

    constructor(data: {
      scheduler: QueryScheduler<any>,
      options: WatchQueryOptions,
      shouldSubscribe?: boolean,
    }): this;

    result(): Promise<ApolloQueryResult<T>>;
    currentResult(): ApolloCurrentResult<T>;
    getLastResult(): ApolloQueryResult<T>;
    getLastError(): ApolloError;
    resetLastResults(): void;
    refetch(variables?: any): Promise<ApolloQueryResult<T>>;
    fetchMore(
      fetchMoreOptions: FetchMoreQueryOptions<any> & FetchMoreOptions<any, any>,
    ): Promise<ApolloQueryResult<T>>;
    subscribeToMore(options: SubscribeToMoreOptions<any, any>): () => void;
    setOptions(
      opts: ModifiableWatchQueryOptions,
    ): Promise<ApolloQueryResult<T>>;
    setVariables(
      variables: any,
      tryFetch?: boolean,
      fetchResults?: boolean,
    ): Promise<ApolloQueryResult<T>>;
    updateQuery(
      mapFn: (previousQueryResult: any, options: UpdateQueryOptions) => any,
    ): void;
    stopPolling(): void;
    startPolling(pollInterval: number): void;
  }

  declare class QueryManager<TStore> {
    scheduler: QueryScheduler<TStore>;
    link: ApolloLink;
    mutationStore: MutationStore;
    queryStore: QueryStore;
    dataStore: DataStore<TStore>;

    constructor({
      link: ApolloLink,
      queryDeduplication?: boolean,
      store: DataStore<TStore>,
      onBroadcast?: () => void,
      ssrMode?: boolean,
    }): this;

    mutate<T>(options: MutationOptions<>): Promise<FetchResult<T>>;
    fetchQuery<T>(
      queryId: string,
      options: WatchQueryOptions,
      fetchType?: FetchType,
      fetchMoreForQueryId?: string,
    ): Promise<FetchResult<T>>;
    queryListenerForObserver<T>(
      queryId: string,
      options: WatchQueryOptions,
      observer: Observer<ApolloQueryResult<T>>,
    ): QueryListener;
    watchQuery<T>(
      options: WatchQueryOptions,
      shouldSubscribe?: boolean,
    ): ObservableQuery<T>;
    query<T>(options: WatchQueryOptions): Promise<ApolloQueryResult<T>>;
    generateQueryId(): string;
    stopQueryInStore(queryId: string): void;
    addQueryListener(queryId: string, listener: QueryListener): void;
    updateQueryWatch(
      queryId: string,
      document: DocumentNode,
      options: WatchQueryOptions,
    ): void;
    addFetchQueryPromise<T>(
      requestId: number,
      promise: Promise<ApolloQueryResult<T>>,
      resolve: (result: ApolloQueryResult<T>) => void,
      reject: (error: Error) => void,
    ): void;
    removeFetchQueryPromise(requestId: number): void;
    addObservableQuery<T>(
      queryId: string,
      observableQuery: ObservableQuery<T>,
    ): void;
    removeObservableQuery(queryId: string): void;
    clearStore(): Promise<void>;
    resetStore(): Promise<ApolloQueryResult<any>[]>;
  }

  declare class QueryStore {
    getStore(): { [queryId: string]: QueryStoreValue };
    get(queryId: string): QueryStoreValue;
    initQuery(query: {
      queryId: string,
      document: DocumentNode,
      storePreviousVariables: boolean,
      variables: Object,
      isPoll: boolean,
      isRefetch: boolean,
      metadata: any,
      fetchMoreForQueryId: string | void,
    }): void;
    markQueryResult(
      queryId: string,
      result: ExecutionResult<>,
      fetchMoreForQueryId: string | void,
    ): void;
    markQueryError(
      queryId: string,
      error: Error,
      fetchMoreForQueryId: string | void,
    ): void;
    markQueryResultClient(queryId: string, complete: boolean): void;
    stopQuery(queryId: string): void;
    reset(observableQueryIds: string[]): void;
  }

  declare class QueryScheduler<TCacheShape> {
    inFlightQueries: { [queryId: string]: WatchQueryOptions };
    registeredQueries: { [queryId: string]: WatchQueryOptions };
    intervalQueries: { [interval: number]: string[] };
    queryManager: QueryManager<TCacheShape>;
    constructor({
      queryManager: QueryManager<TCacheShape>,
      ssrMode?: boolean,
    }): this;
    checkInFlight(queryId: string): ?boolean;
    fetchQuery<T>(
      queryId: string,
      options: WatchQueryOptions,
      fetchType: FetchType,
    ): Promise<FetchResult<T>>;
    startPollingQuery<T>(
      options: WatchQueryOptions,
      queryId: string,
      listener?: QueryListener,
    ): string;
    stopPollingQuery(queryId: string): void;
    fetchQueriesOnInterval<T>(interval: number): void;
    addQueryOnInterval<T>(
      queryId: string,
      queryOptions: WatchQueryOptions,
    ): void;
    registerPollingQuery<T>(
      queryOptions: WatchQueryOptions,
    ): ObservableQuery<T>;
    markMutationError(mutationId: string, error: Error): void;
    reset(): void;
  }

  declare class DataStore<TSerialized> {
    constructor(initialCache: ApolloCache<TSerialized>): this;
    getCache(): ApolloCache<TSerialized>;
    markQueryResult(
      result: ExecutionResult<>,
      document: DocumentNode,
      variables: any,
      fetchMoreForQueryId: string | void,
      ignoreErrors?: boolean,
    ): void;
    markSubscriptionResult(
      result: ExecutionResult<>,
      document: DocumentNode,
      variables: any,
    ): void;
    markMutationInit(mutation: {
      mutationId: string,
      document: DocumentNode,
      variables: any,
      updateQueries: { [queryId: string]: QueryWithUpdater },
      update: ((proxy: DataProxy, mutationResult: Object) => void) | void,
      optimisticResponse: Object | Function | void,
    }): void;
    markMutationResult(mutation: {
      mutationId: string,
      result: ExecutionResult<>,
      document: DocumentNode,
      variables: any,
      updateQueries: { [queryId: string]: QueryWithUpdater },
      update: ((proxy: DataProxy, mutationResult: Object) => void) | void,
    }): void;
    markMutationComplete({
      mutationId: string,
      optimisticResponse?: any,
    }): void;
    markUpdateQueryResult(
      document: DocumentNode,
      variables: any,
      newResult: any,
    ): void;
    reset(): Promise<void>;
  }

  declare type QueryWithUpdater = {
    updater: MutationQueryReducer<Object>,
    query: QueryStoreValue,
  };

  declare interface MutationStoreValue {
    mutationString: string;
    variables: Object;
    loading: boolean;
    error: Error | null;
  }

  declare class MutationStore {
    getStore(): { [mutationId: string]: MutationStoreValue };
    get(mutationId: string): MutationStoreValue;
    initMutation(
      mutationId: string,
      mutationString: string,
      variables: Object | void,
    ): void;
  }

  declare export interface FetchMoreOptions<TData, TVariables> {
    updateQuery: (
      previousQueryResult: TData,
      options: {
        fetchMoreResult?: TData,
        variables: TVariables,
      },
    ) => TData;
  }

  declare export interface UpdateQueryOptions {
    variables?: Object;
  }

  declare export type ApolloCurrentResult<T> = {
    data: T | {},
    errors?: Array<GraphQLError>,
    loading: boolean,
    networkStatus: NetworkStatus,
    error?: ApolloError,
    partial?: boolean,
  };

  declare interface ModifiableWatchQueryOptions {
    variables?: { [key: string]: any };
    pollInterval?: number;
    fetchPolicy?: FetchPolicy;
    errorPolicy?: ErrorPolicy;
    fetchResults?: boolean;
    notifyOnNetworkStatusChange?: boolean;
  }

  declare export interface WatchQueryOptions
    extends ModifiableWatchQueryOptions {
    query: DocumentNode;
    metadata?: any;
    context?: any;
  }

  declare type RefetchQueryDescription = Array<string | PureQueryOptions>;

  declare interface MutationBaseOptions<T = { [key: string]: any }> {
    optimisticResponse?: Object | Function;
    updateQueries?: MutationQueryReducersMap<T>;
    optimisticResponse?: Object;
    refetchQueries?:
      | ((result: ExecutionResult<>) => RefetchQueryDescription)
      | RefetchQueryDescription;
    update?: MutationUpdaterFn<T>;
    errorPolicy?: ErrorPolicy;
    variables?: any;
  }

  declare export type MutationOperation<T = Object> = (
    options: MutationBaseOptions<T>,
  ) => Promise<FetchResult<T>>;

  declare export interface MutationOptions<T = { [key: string]: any }>
    extends MutationBaseOptions<T> {
    mutation: DocumentNode;
    context?: any;
    fetchPolicy?: FetchPolicy;
  }

  declare export interface SubscriptionOptions {
    query: DocumentNode;
    variables?: { [key: string]: any };
  }

  declare export type FetchPolicy =
    | 'cache-first'
    | 'cache-and-network'
    | 'network-only'
    | 'cache-only'
    | 'no-cache'
    | 'standby';

  declare export type ErrorPolicy = 'none' | 'ignore' | 'all';

  declare export interface FetchMoreQueryOptions<TVariables> {
    variables: $Shape<TVariables>;
  }

  declare export type SubscribeToMoreOptions<
    TData,
    TSubscriptionData,
    TSubscriptionVariables = void,
  > = {
    document?: DocumentNode,
    variables?: TSubscriptionVariables,
    updateQuery?: (
      previousResult: TData,
      result: {
        subscriptionData: { data?: TSubscriptionData },
        variables: TSubscriptionVariables,
      },
    ) => TData,
    onError?: (error: Error) => void,
  };

  declare export type MutationUpdaterFn<T = OperationVariables> = (
    proxy: DataProxy,
    mutationResult: FetchResult<T>,
  ) => void;

  declare export type NetworkStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  declare export type QueryListener = (
    queryStoreValue: QueryStoreValue,
    newData?: any,
  ) => void;

  declare export type QueryStoreValue = {
    document: DocumentNode,
    variables: Object,
    previousVariables: Object | null,
    networkStatus: NetworkStatus,
    networkError: Error | null,
    graphQLErrors: GraphQLError[],
    metadata: any,
  };

  declare export type PureQueryOptions = {
    query: DocumentNode,
    variables?: { [key: string]: any },
  };

  declare export type ApolloQueryResult<T> = {
    data: T,
    errors?: Array<GraphQLError>,
    loading: boolean,
    networkStatus: NetworkStatus,
    stale: boolean,
  };

  declare export type FetchType = 1 | 2 | 3;

  declare export type MutationQueryReducer<T> = (
    previousResult: { [key: string]: any },
    options: {
      mutationResult: FetchResult<T>,
      queryName: string | void,
      queryVariables: { [key: string]: any },
    },
  ) => { [key: string]: any };

  declare export type MutationQueryReducersMap<T = { [key: string]: any }> = {
    [queryName: string]: MutationQueryReducer<T>,
  };

  declare export class ApolloError extends Error {
    message: string;
    graphQLErrors: Array<GraphQLError>;
    networkError: Error | null;
    extraInfo: any;
    constructor(info: ErrorConstructor): this;
  }

  declare interface ErrorConstructor {
    graphQLErrors?: Array<GraphQLError>;
    networkError?: Error | null;
    errorMessage?: string;
    extraInfo?: any;
  }

  declare interface DefaultOptions {
    +watchQuery?: ModifiableWatchQueryOptions;
    +query?: ModifiableWatchQueryOptions;
    +mutate?: MutationBaseOptions<>;
  }

  declare export type ApolloClientOptions<TCacheShape> = {
    link: ApolloLink,
    cache: ApolloCache<TCacheShape>,
    ssrMode?: boolean,
    ssrForceFetchDelay?: number,
    connectToDevTools?: boolean,
    queryDeduplication?: boolean,
    defaultOptions?: DefaultOptions,
  };

  declare export class ApolloClient<TCacheShape> {
    link: ApolloLink;
    store: DataStore<TCacheShape>;
    cache: ApolloCache<TCacheShape>;
    queryManager: QueryManager<TCacheShape>;
    disableNetworkFetches: boolean;
    version: string;
    queryDeduplication: boolean;
    defaultOptions: DefaultOptions;
    devToolsHookCb: Function;
    proxy: ApolloCache<TCacheShape> | void;
    ssrMode: boolean;
    resetStoreCallbacks: Array<() => Promise<any>>;

    constructor(options: ApolloClientOptions<TCacheShape>): this;
    watchQuery<T>(options: WatchQueryOptions): ObservableQuery<T>;
    query<T>(options: WatchQueryOptions): Promise<ApolloQueryResult<T>>;
    mutate<T>(options: MutationOptions<T>): Promise<FetchResult<T>>;
    subscribe(options: SubscriptionOptions): Observable<any>;
    readQuery<T>(options: DataProxyReadQueryOptions): T | null;
    readFragment<T>(options: DataProxyReadFragmentOptions): T | null;
    writeQuery(options: DataProxyWriteQueryOptions): void;
    writeFragment(options: DataProxyWriteFragmentOptions): void;
    writeData(options: DataProxyWriteDataOptions): void;
    __actionHookForDevTools(cb: () => any): void;
    __requestRaw(payload: GraphQLRequest): Observable<ExecutionResult<>>;
    initQueryManager(): void;
    resetStore(): Promise<Array<ApolloQueryResult<any>> | null>;
    onResetStore(cb: () => Promise<any>): () => void;
    reFetchObservableQueries(
      includeStandby?: boolean,
    ): Promise<ApolloQueryResult<any>[]> | Promise<null>;
    extract(optimistic?: boolean): TCacheShape;
    restore(serializedState: TCacheShape): ApolloCache<TCacheShape>;
  }

  declare export default typeof ApolloClient;

  /* apollo-link types */
  declare export class ApolloLink {
    constructor(request?: RequestHandler): this;

    static empty(): ApolloLink;
    static from(links: Array<ApolloLink>): ApolloLink;
    static split(
      test: (op: Operation) => boolean,
      left: ApolloLink | RequestHandler,
      right: ApolloLink | RequestHandler,
    ): ApolloLink;
    static execute(
      link: ApolloLink,
      operation: GraphQLRequest,
    ): Observable<FetchResult<>>;

    split(
      test: (op: Operation) => boolean,
      left: ApolloLink | RequestHandler,
      right: ApolloLink | RequestHandler,
    ): ApolloLink;

    concat(next: ApolloLink | RequestHandler): ApolloLink;

    request(
      operation: Operation,
      forward?: NextLink,
    ): Observable<FetchResult<>> | null;
  }

  declare interface GraphQLRequest {
    query: DocumentNode;
    variables?: { [key: string]: any };
    operationName?: string;
    context?: { [key: string]: any };
    extensions?: { [key: string]: any };
  }

  declare interface Operation {
    query: DocumentNode;
    variables: { [key: string]: any };
    operationName: string;
    extensions: { [key: string]: any };
    setContext: (context: { [key: string]: any }) => { [key: string]: any };
    getContext: () => { [key: string]: any };
    toKey: () => string;
  }

  declare export type FetchResult<
    C = { [key: string]: any },
    E = { [key: string]: any },
  > = ExecutionResult<C> & { extension?: E, context?: C };

  declare type NextLink = (operation: Operation) => Observable<FetchResult<>>;

  declare type RequestHandler = (
    operation: Operation,
    forward?: NextLink,
  ) => Observable<FetchResult<>> | null;

  declare class Observable<T> {
    subscribe(
      observerOrNext: ((value: T) => void) | ZenObservableObserver<T>,
      error?: (error: any) => void,
      complete?: () => void,
    ): ZenObservableSubscription;

    forEach(fn: (value: T) => void): Promise<void>;

    map<R>(fn: (value: T) => R): Observable<R>;

    filter(fn: (value: T) => boolean): Observable<T>;

    reduce<R>(
      fn: (previousValue: R | T, currentValue: T) => R | T,
      initialValue?: R | T,
    ): Observable<R | T>;

    flatMap<R>(fn: (value: T) => ZenObservableObservableLike<R>): Observable<R>;

    from<R>(
      observable: Observable<R> | ZenObservableObservableLike<R> | Array<R>,
    ): Observable<R>;

    of<R>(...args: Array<R>): Observable<R>;
  }

  declare interface Observer<T> {
    start?: (subscription: SubscriptionLINK) => any;
    next?: (value: T) => void;
    error?: (errorValue: any) => void;
    complete?: () => void;
  }

  declare interface SubscriptionLINK {
    closed: boolean;
    unsubscribe(): void;
  }

  declare interface ZenObservableSubscriptionObserver<T> {
    closed: boolean;
    next(value: T): void;
    error(errorValue: any): void;
    complete(): void;
  }

  declare interface ZenObservableSubscription {
    closed: boolean;
    unsubscribe(): void;
  }

  declare interface ZenObservableObserver<T> {
    start?: (subscription: ZenObservableSubscription) => any;
    next?: (value: T) => void;
    error?: (errorValue: any) => void;
    complete?: () => void;
  }

  declare type ZenObservableSubscriber<T> = (
    observer: ZenObservableSubscriptionObserver<T>,
  ) => void | (() => void) | SubscriptionLINK;

  declare interface ZenObservableObservableLike<T> {
    subscribe?: ZenObservableSubscriber<T>;
  }
  /* apollo-link types */

  /* apollo-cache types */
  declare export class ApolloCache<TSerialized> {
    read<T>(query: CacheReadOptions): T | null;
    write(write: CacheWriteOptions): void;
    diff<T>(query: CacheDiffOptions): CacheDiffResult<T>;
    watch(watch: CacheWatchOptions): () => void;
    evict(query: CacheEvictOptions): CacheEvictionResult;
    reset(): Promise<void>;

    restore(serializedState: TSerialized): ApolloCache<TSerialized>;
    extract(optimistic?: boolean): TSerialized;

    removeOptimistic(id: string): void;

    performTransaction(transaction: Transaction<TSerialized>): void;
    recordOptimisticTransaction(
      transaction: Transaction<TSerialized>,
      id: string,
    ): void;

    transformDocument(document: DocumentNode): DocumentNode;
    transformForLink(document: DocumentNode): DocumentNode;

    readQuery<QueryType>(
      options: DataProxyReadQueryOptions,
      optimistic?: boolean,
    ): QueryType | null;
    readFragment<FragmentType>(
      options: DataProxyReadFragmentOptions,
      optimistic?: boolean,
    ): FragmentType | null;
    writeQuery(options: CacheWriteQueryOptions): void;
    writeFragment(options: CacheWriteFragmentOptions): void;
    writeData(options: CacheWriteDataOptions): void;
  }

  declare type Transaction<T> = (c: ApolloCache<T>) => void;

  declare type CacheWatchCallback = (newData: any) => void;

  declare interface CacheEvictionResult {
    success: boolean;
  }

  declare interface CacheReadOptions extends DataProxyReadQueryOptions {
    rootId?: string;
    previousResult?: any;
    optimistic: boolean;
  }

  declare interface CacheWriteOptions extends DataProxyReadQueryOptions {
    dataId: string;
    result: any;
  }

  declare interface CacheDiffOptions extends CacheReadOptions {
    returnPartialData?: boolean;
  }

  declare interface CacheWatchOptions extends CacheReadOptions {
    callback: CacheWatchCallback;
  }

  declare interface CacheEvictOptions extends DataProxyReadQueryOptions {
    rootId?: string;
  }

  declare type CacheDiffResult<T> = DataProxyDiffResult<T>;
  declare type CacheWriteQueryOptions = DataProxyWriteQueryOptions;
  declare type CacheWriteFragmentOptions = DataProxyWriteFragmentOptions;
  declare type CacheWriteDataOptions = DataProxyWriteDataOptions;
  declare type CacheReadFragmentOptions = DataProxyReadFragmentOptions;

  declare interface DataProxyReadQueryOptions {
    query: DocumentNode;
    variables?: any;
  }

  declare interface DataProxyReadFragmentOptions {
    id: string;
    fragment: DocumentNode;
    fragmentName?: string;
    variables?: any;
  }

  declare interface DataProxyWriteQueryOptions {
    data: any;
    query: DocumentNode;
    variables?: any;
  }

  declare interface DataProxyWriteFragmentOptions {
    data: any;
    id: string;
    fragment: DocumentNode;
    fragmentName?: string;
    variables?: any;
  }

  declare interface DataProxyWriteDataOptions {
    data: any;
    id?: string;
  }

  declare type DataProxyDiffResult<T> = {
    result?: T,
    complete?: boolean,
  };

  declare interface DataProxy {
    readQuery<QueryType>(
      options: DataProxyReadQueryOptions,
      optimistic?: boolean,
    ): QueryType | null;
    readFragment<FragmentType>(
      options: DataProxyReadFragmentOptions,
      optimistic?: boolean,
    ): FragmentType | null;
    writeQuery(options: DataProxyWriteQueryOptions): void;
    writeFragment(options: DataProxyWriteFragmentOptions): void;
    writeData(options: DataProxyWriteDataOptions): void;
  }
  /* End apollo-cache types */
}
