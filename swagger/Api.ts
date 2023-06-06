/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

// we added this, it is not used when talking to the API
export type Line = {
  id: string;
  name: string;
};

export interface SubscriptionResponse {
  subscriptionId?: string;
}

export interface GpsPosition {
  latitude: number;
  longitude: number;
}

export interface BusIdentification {
  uid: string;
  displayText: string;
}

export interface BusDestination {
  lastStopName: string;
}

export interface VehicleDeviation {
  value: number;
  prefix: string;
  semantics: string;
  obsolescenceStage: string;
}
export interface DisruptionReportsResponse {
  data?: DisruptionReport[];
}

export interface Deviation {
  value?: number;
  semantics?: "ON_TIME" | "PROBLEMATIC" | "SUBOPTIMAL" | "WAITING";
  prefix?: string;
  obsolescenceStage?: string;
}

export interface DisruptionReport {
  uid?: string;
  tenant?: string;
  category?: any;
  /** @format date */
  operatingDay?: string;
  type?: string;
  creationTime?: any;
  origin?: any;
  text?: string;
  /** @format int32 */
  priority?: number;
  line?: any;
  position?: any;
  destination?: any;
  user?: string;
  vehicle?: any;
  /** voice radio ID of the vehicle */
  voiceRadioId?: string;
  deviation?: Deviation;
  driver?: any;
  occupancy?: any;
  trailers?: any;
  remainingRange?: any;
  stateOfCharge?: any;
  block?: any;
  trip?: any;
}

export type DisruptionReportsAssignmentBody = any;

export interface DisruptionReportsSubscriptionRequestBody {
  filterKeys?: DisruptionReportsFilterSpec[];
}

export interface DisruptionReportsFilterSpec {
  tenant?: string[];
}

export type DisruptionReportChange = {
  value: DisruptionReport;
};

export interface EventsResponse {
  data?: Event[];
}

export interface Event {
  uid: string;
  creationTime: any;
  text: string;
  type: string;
  /** the objects which are affected by this event */
  affectedObjects?: {
    vehicles?: any[];
  };
}

export interface EventsSubscriptionRequestBody {
  /** @example [{"vehicleUid":["i~STO~2308"]}] */
  filterKeys?: EventsFilterSpec[];
}

export interface EventsFilterSpec {
  vehicleUid?: string[];
}

export type EventChange = {
  value: Event;
};

export enum InstructionType {
  PREDEFINED = "PREDEFINED",
  USER_DEFINED = "USER_DEFINED",
}

export interface InstructionTemplatesResponse {
  data?: InstructionTemplatesResponseData;
}

export interface InstructionTemplatesResponseData {
  predefinedTemplates?: InstructionTemplate[];
  userDefinedTemplates?: InstructionTemplate[];
}

/** The identification property of an instruction template is read-only. */
export interface InstructionTemplate {
  tenant: string;
  identification?: InstructionTemplateIdentification;
  text: string;
  /** If present, indicates to the preset whether the addressed driver shall acknowledge the receipt. */
  driverAcknowledgement?: boolean;
}

export interface Instruction {
  tenant?: string;
  template?: InstructionTemplateIdentification;
  /** not applicable when type is 'PREDEFINED' */
  text?: string;
  /** Indicates whether the addressed driver shall acknowledge the receipt. */
  driverAcknowledgement?: boolean;
  recipients?: InstructionRecipients;
}

export interface InstructionTemplateIdentification {
  type?: InstructionType;
  uid?: string;
}

export interface InstructionRecipients {
  vehicles?: any[];
}

export interface NetPointsResponse {
  data?: NetPointsResponseData;
}

export interface NetPointsResponseData {
  stopPoints?: any[];
  depotPoints?: any[];
  beacons?: any[];
  linkPoints?: any[];
}

/** A page of operations log entries including the data itself and information about the pagination. */
export interface OperationsLogPage {
  /** @format int32 */
  limit?: number;
  /** @format int32 */
  offset?: number;
  /**
   * The UID of the first entry in the data set being returned.
   * @format int64
   */
  firstEntry?: number;
  /**
   * The UID of the last entry in the data set being returned.
   * @format int64
   */
  lastEntry?: number;
  data?: OperationsLogEntry[];
}

/** A single entry of the operations log. */
export interface OperationsLogEntry {
  /** Unique identifier for the entry. */
  uid?: string;
  /**
   * The timestamp for logging this entry, i.e. storing it in the operations log.
   * @format date-time
   */
  logTimestamp?: string;
  /**
   * The timestamp of the event. In case of a logged disruption report logTimestamp will be after this timestamp since the disruption report was created at the eventTimestamp and was moved to the operations log after acknowledgment. The timestamp of the acknowledgement matches the logTimestamp.
   * @format date-time
   */
  eventTimestamp?: string;
  /** Is the enumeration for the 'H' column in the old client. */
  category?: OperationsLogCategory;
  tenant: string;
  /**
   * The text content of the operations log entry
   * @maxLength 512
   */
  text: string;
  /** @format date */
  operatingDay?: string;
  block?: any;
  line?: any;
  trip?: any;
  vehicle?: any;
  /** voice radio ID of the vehicle */
  voiceRadioId?: string;
  deviation?: Deviation;
  driver?: any;
  occupancy?: any;
  trailers?: any;
  remainingRange?: any;
  stateOfCharge?: any;
  position?: any;
  destination?: any;
  user: string;
  /** Will be empty for the beginning. */
  comment?: string;
}

/** Is the enumeration for the 'H' column in the old client. */
export enum OperationsLogCategory {
  CALL = "CALL",
  DISPATCH_ACTION = "DISPATCH_ACTION",
  CALL_WITH_MANUAL_LOG_ENTRY = "CALL_WITH_MANUAL_LOG_ENTRY",
  MANUAL_LOG_ENTRY = "MANUAL_LOG_ENTRY",
  ACKNOWLEDGMENT = "ACKNOWLEDGMENT",
  MONITORING = "MONITORING",
  AUTO_ACKNOWLEDGMENT = "AUTO_ACKNOWLEDGMENT",
  ENCODED_INSTRUCTION = "ENCODED_INSTRUCTION",
  FAILED_ACTION = "FAILED_ACTION",
  TEXT_INSTRUCTION = "TEXT_INSTRUCTION",
  JOBMANAGEMENT = "JOBMANAGEMENT",
  INITIATED_BY_DRIVER = "INITIATED_BY_DRIVER",
  EXTERNALLY_INITIATED = "EXTERNALLY_INITIATED",
  EMPTY = "EMPTY",
}

export interface RadioMessagesResponse {
  data?: RadioMessage[];
}

export interface RadioMessage {
  uid?: string;
  tenant?: string;
  category?: any;
  /** @format date */
  operatingDay?: string;
  type?: RadioMessageType;
  /** @format int64 */
  codedMessageId?: number;
  creationTime?: any;
  origin?: any;
  text?: string;
  /** @format int32 */
  priority?: number;
  line?: any;
  position?: any;
  destination?: any;
  user?: string;
  vehicle?: any;
  /** voice radio ID of the vehicle */
  voiceRadioId?: string;
  deviation?: Deviation;
  driver?: any;
  occupancy?: any;
  trailers?: any;
  remainingRange?: any;
  stateOfCharge?: any;
  block?: any;
  trip?: any;
}

export enum RadioMessageType {
  EMERGENCY_CALL = "EMERGENCY_CALL",
  INCIDENT_CALL = "INCIDENT_CALL",
  PRIORITY_CALL = "PRIORITY_CALL",
  CONTROL_CENTER_CALL = "CONTROL_CENTER_CALL",
  CODED_MESSAGE = "CODED_MESSAGE",
  CUSTOM_TEXT_MESSAGE = "CUSTOM_TEXT_MESSAGE",
}

export type RadioMessagesAssignmentBody = any;

export interface RadioMessagesSubscriptionRequestBody {
  filterKeys?: RadioMessagesFilterSpec[];
}

export interface RadioMessagesFilterSpec {
  tenant?: string[];
}

export type RadioMessageChange = {
  value: RadioMessage;
};

/** An object representing a tenant. */
export interface Tenant {
  displayText?: string;
  uid?: string;
}

/** An object providing a list of all available tenants in the data field. */
export interface TenantsResponse {
  data?: Tenant[];
}

export interface CondensedBlocksResponse {
  data?: CondensedBlock[];
}

/** Condensed view of a block. */
export type CondensedBlock = BasicBlock & {
  /** List of all trips (represented in a condensed view) of the block in the correct order, i.e. the first entry of the list is the first trip of the block, the second entry is the second trip etc. */
  trips?: CondensedTrip[];
};

/** Common properties for every representation of a block. */
export interface BasicBlock {
  identification?: any;
  tenant?: string;
  /** @format date */
  operatingDay?: string;
  lastModified?: any;
}

/** Representation of a full block. */
export type Block = BasicBlock & {
  /** List of all trips of the block in the correct order, i.e. the first entry of the list is the first trip of the block, the second entry is the second trip etc. */
  trips?: Trip[];
};

/** Representation of a full trip. */
export type Trip = BasicTrip & {
  block?: any;
  line?: any;
  /** A trip itinerary consists of a trip's route (i.e. its geographical route through the region) and trip specific information like the arrival and departure times and information about passenger demands, dispatching and so on. An itinerary mainly consists of its served links that are consisting of a start and an end node. Those nodes are associated to net points of the traffic network. */
  itinerary?: TripItinerary;
};

/** Common properties for every representation of a trip. Of the two fields plannedTimes and actualTimes only the planned times are always present. If the trip will begin soon, the actual trip times will be present. The actual trip times will start as a prediction of the times. After the trip was started, the start timestamp will switch to a logged one. After the trip was finished, the end timestamp will switch to a logged one. */
export interface BasicTrip {
  identification: {
    uid?: string;
    displayText?: string;
    numberInBlock?: number;
  };
  /** @format date */
  operatingDay?: string;
  destination?: string;
  plannedTimes: TripTimes;
  actualTimes?: ActualTripTimes;
  /** True iff the whole trip is cancelled. */
  cancelled?: boolean;
  /** Contains a list of cancelled trip segments. If the property cancelled is set to true, a single segment containing the whole itinerary is given. */
  cancelledSegments?: CancelledSegment[];
}

/** A condensed view of a trip. */
export type CondensedTrip = BasicTrip & {
  firstTripItineraryNode?: NetPoint;
  lastTripItineraryNode?: NetPoint;
};

export interface BlockSubscriptionRequestBody {
  /** @example [{"vehicleUid":["i~STO~1","i~STO~2308"]},{"blockUid":["IVU~1560~18"]}] */
  filterKeys?: BlockFilterSpec[];
}

export interface BlockFilterSpec {
  vehicleUid?: string[];
  blockUid?: string[];
}

export type CondensedBlockChange = {
  /** Condensed view of a block. */
  value: CondensedBlock;
};

export interface TripItinerariesSubscriptionRequestBody {
  /** @example [{"vehicleUid":["i~STO~1","i~STO~2308"]},{"blockUid":["IVU~1560~18"]},{"tripUid":["IVU~-19945489~28"]}] */
  filterKeys?: TripItinerariesFilterSpec[];
}

export interface TripItinerariesFilterSpec {
  vehicleUid?: string[];
  blockUid?: string[];
  tripUid?: string[];
}

export type TripItineraryChange = {
  /** A trip itinerary consists of a trip's route (i.e. its geographical route through the region) and trip specific information like the arrival and departure times and information about passenger demands, dispatching and so on. An itinerary mainly consists of its served links that are consisting of a start and an end node. Those nodes are associated to net points of the traffic network. */
  value: TripItinerary;
};

export interface TripItinerariesResponse {
  data?: TripItinerary[];
}

export interface Route {
  displayText: string;
  uid: string;
}

/** A trip itinerary consists of a trip's route (i.e. its geographical route through the region) and trip specific information like the arrival and departure times and information about passenger demands, dispatching and so on. An itinerary mainly consists of its served links that are consisting of a start and an end node. Those nodes are associated to net points of the traffic network. */
export interface TripItinerary {
  identification?: any;
  route?: Route;
  links?: TripItineraryLink[];
}

/** Link between the start and end node of the itinerary */
export interface TripItineraryLink {
  /** Length of the link in meters */
  length?: LinkLength;
  /** This is a node of the itinerary. It describes a net point of our net. This node does not have to be associated to a stop point. The type of the underlying net point can be found in the 'identification' property. */
  start?: TripItineraryNode;
  /** This is a node of the itinerary. It describes a net point of our net. This node does not have to be associated to a stop point. The type of the underlying net point can be found in the 'identification' property. */
  end?: TripItineraryNode;
}

/**
 * Length of the link in meters
 * @format int32
 */
export type LinkLength = number;

/** This is a node of the itinerary. It describes a net point of our net. This node does not have to be associated to a stop point. The type of the underlying net point can be found in the 'identification' property. */
export interface TripItineraryNode {
  identification?: NetPoint;
  gpsPosition?: {
    latitude?: number;
    longitude?: number;
  };
  /** The arrival and departure times of this itinerary's node. Only the pair of the planned times is always present. If the trip will begin soon, the actual time info will be present. The actual time info will start as a prediction of the times. After serving the node, it will switch to a logged timestamp. */
  timeInfo?: TimeInfo;
  cancelled?: boolean;
  demandStop?: boolean;
  /** Is true iff the arrival and departure time are logged i.e. the vehicle actually arrived at (if it is not the very first node) and departed (if it is not the very last node) from this node. */
  wasServed?: boolean;
  passengerDemand?: PassengerDemand;
  behaviorAtStop?: BehaviorAtStop;
}

export enum BehaviorAtStop {
  NORMAL = "NORMAL",
  PASS = "PASS",
  NO_ENTRY = "NO_ENTRY",
  NO_EXIT = "NO_EXIT",
  SERVICE_STOP = "SERVICE_STOP",
}

/** @example {"type":"BOTH","deboardingCount":2,"onboardingPassengers":[{"name":"Mrs. Smith","count":2},{"name":"Mr. Doe","count":5}]} */
export interface PassengerDemand {
  type?: DemandType;
  /**
   * number of the de-boarding passengers
   * @format int32
   */
  deboardingCount?: number;
  /** The passenger groups that will be on-boarding */
  onboardingPassengers?: PassengerGroup[];
}

export interface PassengerGroup {
  name?: string;
  /** @format int32 */
  count?: number;
}

/** The arrival and departure times of this itinerary's node. Only the pair of the planned times is always present. If the trip will begin soon, the actual time info will be present. The actual time info will start as a prediction of the times. After serving the node, it will switch to a logged timestamp. */
export interface TimeInfo {
  planned: ArrivalDepartureTime;
  actual?: ActualArrivalDepartureTimes;
}

export interface ActualArrivalDepartureTimes {
  predicted?: boolean;
  times?: ArrivalDepartureTime;
}

export interface ArrivalDepartureTime {
  arrival?: string;
  departure?: string;
}

export enum DemandType {
  NO_DEMAND = "NO_DEMAND",
  ONBOARDING = "ONBOARDING",
  DEBOARDING = "DEBOARDING",
  BOTH = "BOTH",
}

export interface TripTimes {
  start?: any;
  end?: any;
}

export type ActualTripTimes = TripTimes & {
  startPredicted?: boolean;
  endPredicted?: boolean;
};

/** Represents a segment of cancelled trip stops, i.e. all stops between (and including) start and end node are cancelled. */
export interface CancelledSegment {
  /** Represents a cancelled node. Contains its identification (including posInRoute) and the planned arrival and departure time. */
  startNode?: CancellationNode;
  /** Represents a cancelled node. Contains its identification (including posInRoute) and the planned arrival and departure time. */
  endNode?: CancellationNode;
}

/** Represents a cancelled node. Contains its identification (including posInRoute) and the planned arrival and departure time. */
export interface CancellationNode {
  identification?: any;
  timeInfo?: ArrivalDepartureTime;
}

export interface VehicleStatesSubscriptionRequestBody {
  /** @example [{"tenant":["IVU"]},{"vehicleUid":["i{STO}#{1}","i{STO}#{2308}"]}] */
  filterKeys?: VehicleStatesFilterSpec[];
}

export interface VehicleStatesFilterSpec {
  tenant?: string[];
  vehicleUid?: string[];
}

export type VehicleStateChange = {
  /** The operational data is present iff the registration state is OPERATIONAL or EXTERNAL. This does not necessarily hold for the sub values. They could be non-existing even if the operational data itself is present. For example, the driver data might not be present though the vehicle is operationally registered. Note that the value of the property registrationState of items in the response will never be UNREGISTERED as unregistered vehicles simply do not have a vehicle state. */
  value: VehicleState;
  modifier: "CREATE" | "UPDATE" | "DELETE";
};

export interface DutyIdentification {
  uid?: string;
  displayText?: string;
}

/**
 * speed in m per h (to allow for up to 3 positions after decimal point)
 * @format int32
 */
export type Speed = number;

export interface RemainingTrips {
  /**
   * number of remaining trips for e-vehicles otherwise null
   * @format int32
   */
  predicted?: number;
  /**
   * number of trips till the end of the block; current trip excluded
   * @format int32
   */
  target?: number;
}

export interface GeoDirection {
  /** @format int32 */
  angle?: number;
  displayText?: string;
}

export interface PositionState {
  /**
   * distance in per mill (of link between fromNetPoint and toNetPoint) measured from fromNetPoint
   * @format float
   */
  distance?: number;
  fromNetPoint?: NetPoint;
  toNetPoint?: NetPoint;
}

export interface VehicleTypeIdentification {
  uid?: string;
  displayText?: string;
}

export enum VehicleRegistrationState {
  UNREGISTERED = "UNREGISTERED",
  TECHNICAL = "TECHNICAL",
  OPERATIONAL = "OPERATIONAL",
  EXTERNAL = "EXTERNAL",
}

export interface SelectableVehiclesResponse {
  data?: SelectableVehicle[];
}

/**
 * The operational data is present iff the registration state is OPERATIONAL or EXTERNAL. This does not necessarily hold for the sub values. They could be non-existing even if the operational data itself is present. For example, the driver data might not be present though the vehicle is operationally registered.
 * @example {"tenant":"STO","identification":{"uid":"STO-1","displayText":"STO/1"},"voiceRadioId":"+49241470510","registrationState":"OPERATIONAL","workingSet":{"displayText":"Aachen Nord"},"type":{"displayText":"Citaro G"},"operational":{"line":{"displayText":"STO/E"},"block":{"displayText":"123"},"trip":{"numberInBlock":1,"displayText":"STO/5/1"},"driver":{"displayText":"Max Mustermann"}}}
 */
export interface SelectableVehicle {
  tenant: string;
  identification: {
    uid?: string;
    displayText?: string;
  };
  voiceRadioId?: string;
  registrationState: VehicleRegistrationState;
  operational?: VehicleOperationalData;
  workingSet?: WorkingSetIdentification;
  type?: VehicleTypeIdentification;
}

export interface VehicleOperationalData {
  line?: {
    uid?: string;
    displayText?: string;
  };
  block?: any;
  trip?: {
    displayText?: string;
    numberInBlock?: number;
    uid?: string;
  };
  driver?: {
    uid?: string;
    displayText?: string;
  };
  duty?: DutyIdentification;
  route?: Route;
}

export interface WorkingSetIdentification {
  uid?: string;
  displayText?: string;
}

export interface VehicleStatesResponse {
  data?: VehicleState[];
}

export interface NetPoint {
  posInRoute?: number;
  netPoint?: {
    displayText?: string;
    uid?: string;
    type?: "STOP_POINT";
  };
}

export interface Occupancy {
  passengerCount?: number;
  // I am assuming that range will never have more than two entries
  range?: [] | [number] | [number, number];
}

/** The operational data is present iff the registration state is OPERATIONAL or EXTERNAL. This does not necessarily hold for the sub values. They could be non-existing even if the operational data itself is present. For example, the driver data might not be present though the vehicle is operationally registered. Note that the value of the property registrationState of items in the response will never be UNREGISTERED as unregistered vehicles simply do not have a vehicle state. */
export interface VehicleState {
  tenant: string;
  identification: BusIdentification;
  voiceRadioId?: string;
  registrationState: VehicleRegistrationState;
  operational?: VehicleOperationalData;
  workingSet?: WorkingSetIdentification;
  type?: VehicleTypeIdentification;
  lastUpdate: any;
  deviation?: Deviation;
  gpsPosition?: GpsPosition;
  geoDirection?: GeoDirection;
  positionState?: PositionState;
  position?: any;
  destination?: BusDestination;
  occupancy?: Occupancy;
  trailers?: any;
  remainingRange?: any;
  stateOfCharge?: any;
  remainingTrips?: RemainingTrips;
  /** speed in m per h (to allow for up to 3 positions after decimal point) */
  speed?: Speed;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/fl";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal: cancelToken
          ? this.createAbortSignal(cancelToken)
          : requestParams.signal,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Disruption Reports
 * @version 1.0.0
 * @baseUrl /fl
 *
 * Specifications of the API endpoints of disruption reports.
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  gw = {
    /**
     * @description Returns all currently available disruption reports.
     *
     * @tags Disruption reports
     * @name RetrieveDisruptionReports
     * @request GET:/gw/disruptionReports
     * @response `200` `DisruptionReportsResponse` The data of all disruption reports matching the given query parameters.
     * @response `400` `void`
     * @response `403` `void`
     * @response `404` `void`
     */
    retrieveDisruptionReports: (params: RequestParams = {}) =>
      this.request<DisruptionReportsResponse, void>({
        path: `/gw/disruptionReports`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Method to acknowledge i.e. delete disruption reports.
     *
     * @tags Disruption reports
     * @name AcknowledgeDisruptionReport
     * @request DELETE:/gw/disruptionReports
     * @response `200` `DisruptionReportsAssignmentBody` The acknowledgment was executed. The actual status of a single acknowledgement must be checked in the response body. It is stated there for each disruption report whether it was acknowledged or not. If not, the reason for the failure is presented. If the disruption report is not present at the server it will still return the internal status of 200 since the goal of this API method was achieved - the disruption report does not exist. Hence, the method is idempotent. The number of results in the response is equal to the number of ids being present as query parameters.
     * @response `400` `void`
     * @response `401` `void`
     */
    acknowledgeDisruptionReport: (
      query: {
        /** UIDs of the disruption reports */
        uid: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/gw/disruptionReports`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Method to assign a disruption report to a user or unassign to no one.
     *
     * @tags Disruption reports
     * @name AssignDisruptionReport
     * @request PATCH:/gw/disruptionReports
     * @response `200` `DisruptionReportsAssignmentBody` The assignment was executed. The actual status of a single assignment must be checked in the response body. It is stated there for each disruption report whether it was assigned or not. If not, the reason for the failure is presented. If the disruption report is already assigned to the user, it will still return the internal status of 200 since the goal of this API method was achieved - the disruption report is assigned to the requested user. Hence, the method is idempotent. The number of results in the response is equal to the number of ids being present as query parameters.
     * @response `400` `void`
     * @response `401` `void`
     */
    assignDisruptionReport: (
      query: {
        /** UIDs of the disruption reports */
        uid: string[];
      },
      data: DisruptionReportsAssignmentBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/gw/disruptionReports`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all currently available events matching the query parameter criteria.
     *
     * @tags Events
     * @name RetrieveEvents
     * @request GET:/gw/events
     * @response `200` `EventsResponse` The data of all events matching the given query parameters.
     * @response `400` `string` Will be returned e.g. if the query parameter vehicleUid is missing or not understood.
     * @response `403` `void`
     * @response `404` `string` Will be returned e.g. if the query parameter vehicleUid is referencing an unknown vehicle.
     */
    retrieveEvents: (
      query: {
        /** The UID of the vehicle to return the currently associated events for. */
        vehicleUid: string;
        /** The beginning of the time frame to query events from. The time frame condition is applied to the point in time an event was created / began to exist. If this parameter is not provided by the client a default value is used. Must be provided as ISO 8601-1 string. */
        timeFrameStart?: string;
        /** The end of the time frame to query events from. The time frame condition is applied to the point in time an event was created / began to exist. If this parameter is not provided by the client it defaults to the current time (now). Must be provided as ISO 8601-1 string. */
        timeFrameEnd?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<EventsResponse, string | void>({
        path: `/gw/events`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves data related to the instruction templates queried. The method shall be used with at least the tenant query parameter set (to a non-empty array). Note that currently, the contents of the response like the text property will be in the language which was used in the plan data.
     *
     * @tags Communication
     * @name RetrieveInstructionTemplates
     * @request GET:/gw/instructionTemplates
     * @response `200` `InstructionTemplatesResponse` The data of all known instruction templates matching the given parameters is returned.
     * @response `400` `void` Will be returned if filtering parameter are missing as described above.
     * @response `403` `void`
     * @response `404` `void`
     */
    retrieveInstructionTemplates: (
      query?: {
        /** Type of instruction (message). 'PREDEFINED' stands for coded instructions predefined by the system, the templates for which cannot be altered. 'USER_DEFINED' stands for custom text instructions defined by a user, the templates for which can be altered. */
        type?: InstructionType[];
      },
      params: RequestParams = {}
    ) =>
      this.request<InstructionTemplatesResponse, void>({
        path: `/gw/instructionTemplates`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new user-defined instruction template.
     *
     * @tags Communication
     * @name CreateInstructionTemplate
     * @request POST:/gw/instructionTemplates
     * @response `200` `InstructionTemplate` Will be returned if the template was created successfully. The returned instruction template will contain the identification property and thus the UID of the template.
     * @response `400` `void` Will be returned if the request body is missing or does not contain a valid instruction template.
     * @response `403` `void` __Upcoming after introduction of auth__ Will be returned if the client requests to create an instruction template for a tenant that it is not authorized for.
     * @response `404` `void`
     * @response `500` `void` Will be returned if, for any other reason than a malformed request, there was a failure to save the instruction template to the database on the server side.
     */
    createInstructionTemplate: (
      data: InstructionTemplate,
      params: RequestParams = {}
    ) =>
      this.request<InstructionTemplate, void>({
        path: `/gw/instructionTemplates`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Replaces a user-defined instruction template.
     *
     * @tags Communication
     * @name ReplacesInstructionTemplate
     * @request PUT:/gw/instructionTemplates
     * @response `200` `InstructionTemplate` Will be returned if the template was replaced successfully.
     * @response `400` `any`
     * @response `403` `void` __Upcoming after introduction of auth__ Will be returned if the client requests to replace an instruction template for a tenant that it is not authorized for.
     * @response `404` `void` Will be returned if the referenced instruction template cannot be found.
     */
    replacesInstructionTemplate: (
      uid: string,
      data: InstructionTemplate,
      params: RequestParams = {}
    ) =>
      this.request<InstructionTemplate, void>({
        path: `/gw/instructionTemplates`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a single instruction template. The instruction template must be of type USER_DEFINED. Templates of other types cannot be deleted.
     *
     * @tags Communication
     * @name DeleteInstructionTemplate
     * @request DELETE:/gw/instructionTemplates
     * @response `200` `void` Will be returned if the referenced instruction template was successfully deleted. This code will also be returned if the instruction template has already been deleted before the delete request being responded to or if it has never existed at all.
     * @response `400` `any`
     * @response `403` `void` Will be returned if the referenced instruction template is not of type USER_DEFINED and therefore cannot be deleted. __Upcoming after introduction of auth__ Will be returned as well if the client requests to delete an instruction template belonging to a tenant he is not authorized for.
     */
    deleteInstructionTemplate: (uid: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/gw/instructionTemplates`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Sends an instruction (predefined or user-defined instruction). The request must at least contain the UID of a predefined instruction if the request is of type 'PREDEFINED'. If the request is of type 'USER_DEFINED', then wanting to use a template and not changing the text can be expressed by using the uid of the desired template. The other cases of type 'USER_DEFINED' shall set the text property. The text will not be internationalized and will be presented to every user as it was given, independently of an individual user's language.
     *
     * @tags Communication
     * @name SendInstruction
     * @request POST:/gw/instructions
     * @response `200` `Instruction` Will be returned if the instruction was sent. The sent message with all its data is present in the response body.
     * @response `400` `void` Will be returned if the request body is missing, does not contain the required information or exceeds any limitations (e.g. number of characters of the displayText). It may also be returned if the given UID of an instruction template cannot be matched to an instruction template in the database.
     * @response `403` `void` __Upcoming after introduction of auth__ Will be returned if the client tries to send an instruction for a tenant it is not authorized for.
     * @response `404` `void`
     * @response `500` `void` Will be returned if, for any reason other than a malformed request, the sending of the instruction failed. The client may try again although the actual reason for the previous request's failure might be something that cannot be influenced by the client. A fixed number of retries would be advisable.
     */
    sendInstruction: (data: Instruction, params: RequestParams = {}) =>
      this.request<Instruction, void>({
        path: `/gw/instructions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves net points of the given tenant. Only one of the query parameters 'tenant' or 'lineUid' may be used at the same time. They are mutually exclusive.
     *
     * @tags NetPoints
     * @name RetrieveNetPoints
     * @request GET:/gw/netPoints
     * @response `200` `NetPointsResponse` The net points of a given type, or if no type is given all net points.
     * @response `400` `void` Will be returned if the tenant and lineUid parameter are both missing or both present, or if an unknown type is given.
     * @response `403` `void`
     * @response `404` `void`
     */
    retrieveNetPoints: (
      query?: {
        /** Type of net point. */
        type?: any[];
        /**
         * UIDs of lines. If this query parameter is used, only net points of the desired types that are used on routes (both planned and those dynamically created through dispatching) of the referenced lines will be returned.
         * @example ["IVU~66","IVU~100"]
         */
        lineUid?: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<NetPointsResponse, void>({
        path: `/gw/netPoints`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all the currently available operations log entries sorted by logTimestamp in descending order.
     *
     * @tags Operations logs
     * @name RetrieveOperationsLogs
     * @request GET:/gw/operationsLogs
     * @response `200` `OperationsLogPage` An object holding the entries of the operations log entries and meta data regarding the pagination. The result might not hold data for all given tenants. If a tenant is unknown or the user is not authorized for, the tenant will be omitted.
     * @response `400` `void` Will be returned if the tenant is missing or there is no positive limit. Additionally, either an offset or firstEntry or a lastEntry can be given. A combination of any of the three is illegal.
     * @response `403` `void`
     * @response `404` `void` Will be returned iff tenants are unknown or the firstEntry/lastEntry is unknown.
     */
    retrieveOperationsLogs: (
      query: {
        /**
         * Maximum number of operations log entries in the response
         * @format int32
         * @example 100
         */
        limit: number;
        /**
         * The offset of the entries. The entries are sorted by log timestamp. E.g. an offset of 100 omits the first 100 most recent entries.
         * @format int32
         */
        offset?: number;
        /** The id of the last entry that was already loaded by the client of this API. The entries 'after' this entry will be returned. Hence, it can be used to load a page 'after' an already loaded one. */
        lastEntry?: string;
        /** The id of the first entry that was already loaded by the client of this API. The entries 'before' this entry will be returned. Hence, it can be used to load a page 'before' an already loaded one. */
        firstEntry?: string;
        /** The beginning of the time frame to query operations logs from. The time frame condition is applied to the point in time an operations log entry was last modified at. If this parameter is not provided by the client it defaults to the start of the current day. Must be provided as ISO 8601-1 string. */
        timeFrameStart?: string;
        /** The end of the time frame to query operations logs from. The time frame condition is applied to the point in time an operations log entry was last modified at. If this parameter is not provided by the client it defaults the current time (now). Must be provided as ISO 8601-1 string. */
        timeFrameEnd?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<OperationsLogPage, void>({
        path: `/gw/operationsLogs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new operations log entry. The entry must at least contain a text, a tenant and the user. If the new entry shall be associated to a vehicle, then the property vehicle->uid shall be set. The text will not be internationalized. It will be presented to every user as it was specified independently of the user's language.
     *
     * @tags Operations logs
     * @name CreateOperationsLogEntry
     * @request POST:/gw/operationsLogs
     * @response `200` `OperationsLogEntry` Will be returned if the entry was created. The new entry with all its data is present in the response body.
     * @response `400` `void` Will be returned if the request body is missing, does not contain the required information or exceeds any limitations (e.g. number of characters of the text).
     * @response `403` `void` __Upcoming after introduction of auth__ Will be returned if the client tries to create an entry for a tenant it is not authorized for.
     */
    createOperationsLogEntry: (
      data: OperationsLogEntry,
      params: RequestParams = {}
    ) =>
      this.request<OperationsLogEntry, void>({
        path: `/gw/operationsLogs`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all currently available radio messages.
     *
     * @tags Radio messages
     * @name RetrieveRadioMessages
     * @request GET:/gw/radioMessages
     * @response `200` `RadioMessagesResponse` The data of all radio messages matching the given query parameters.
     * @response `400` `void`
     * @response `403` `void`
     * @response `404` `void`
     */
    retrieveRadioMessages: (params: RequestParams = {}) =>
      this.request<RadioMessagesResponse, void>({
        path: `/gw/radioMessages`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Method to acknowledge i.e. delete radio messages.
     *
     * @tags Radio messages
     * @name AcknowledgeRadioMessages
     * @request DELETE:/gw/radioMessages
     * @response `200` `DisruptionReportsAssignmentBody` The acknowledgment was executed. The actual status of a single acknowledgement must be checked in the response body. It is stated there for each radio messages whether it was acknowledged or not. If not, the reason for the failure is presented. If the radio message is not present at the server it will still return the internal status of 200 since the goal of this API method was achieved - the radio message does not exist. Hence, the method is idempotent. The number of results in the response is equal to the number of ids being present as query parameters.
     * @response `400` `void`
     * @response `401` `void`
     */
    acknowledgeRadioMessages: (
      query: {
        /** UIDs of the radio messages */
        uid: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/gw/radioMessages`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Method to assign a radio message to a user or unassign to no one.
     *
     * @tags Radio messages
     * @name AssignRadioMessage
     * @request PATCH:/gw/radioMessages
     * @response `200` `DisruptionReportsAssignmentBody` The assignment was executed. The actual status of a single assignment must be checked in the response body. It is stated there for each radio message whether it was assigned or not. If not, the reason for the failure is presented. If the radio message is already assigned to the user, it will still return the internal status of 200 since the goal of this API method was achieved - the radio message is assigned to the requested user. Hence, the method is idempotent. The number of results in the response is equal to the number of ids being present as query parameters.
     * @response `400` `void`
     * @response `401` `void`
     */
    assignRadioMessage: (
      query: {
        /** UIDs of the radio messages */
        uid: string[];
      },
      data: RadioMessagesAssignmentBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/gw/radioMessages`,
        method: "PATCH",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of all tenants available in the system.
     *
     * @tags Tenants
     * @name RetrieveTenants
     * @request GET:/gw/tenants
     * @response `200` `TenantsResponse` The list of all tenants.
     */
    retrieveTenants: (params: RequestParams = {}) =>
      this.request<TenantsResponse, any>({
        path: `/gw/tenants`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a condensed view of the blocks matching the given query parameters. If a vehicle is registered but not currently serving a block, it won't appear in the result. Thus, the result might come back empty.
     *
     * @tags Blocks
     * @name RetrieveCondensedBlocks
     * @request GET:/gw/blocks/condensed
     * @response `200` `CondensedBlocksResponse` The condensed view of all known blocks matching the given parameters is returned.
     * @response `400` `any`
     * @response `403` `void`
     */
    retrieveCondensedBlocks: (
      query?: {
        /** The UIDs of the vehicles to return the currently associated blocks for. */
        vehicleUid?: string[];
        /** The UIDs of the blocks that should be returned. */
        blockUid?: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<CondensedBlocksResponse, void>({
        path: `/gw/blocks/condensed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves data about the trip itineraries queried. At least one parameter has to be given. The parameters vehicleUid and tripUid can be combined, but when given a blockUid the other parameters are not permitted. Conversely, if tripUid, vehicleUid or both are present, a blockUid must not be present. Please also note that at most one blockUid can be provided.
     *
     * @tags Trips
     * @name RetrieveTripItineraries
     * @request GET:/gw/tripItineraries
     * @response `200` `TripItinerariesResponse` The trip itineraries of all known trips matching the given parameters are returned.
     * @response `400` `void` Missing parameters or invalid combination of parameters.
     * @response `403` `void`
     */
    retrieveTripItineraries: (
      query?: {
        /** The UIDs of the vehicles whose tripItineraries should be returned. If a vehicle has no associated trip it will not be represented in the result set. Only vehicles with registration state "OPERATIONAL" will have a trip itinerary. */
        vehicleUid?: string[];
        /**
         * The UIDs of the trips whose tripItineraries should be returned.
         * @example "IVU~-19945489~28"
         */
        tripUid?: string[];
        /** The UID of the block whose tripItineraries should be returned. */
        blockUid?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<TripItinerariesResponse, void>({
        path: `/gw/tripItineraries`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves data about the vehicles queried.
     *
     * @tags Vehicles
     * @name RetrieveSelectableVehicles
     * @request GET:/gw/selectableVehicles
     * @response `200` `SelectableVehiclesResponse` The data of all known vehicles matching the given parameters is returned.
     * @response `400` `void` Will be returned if the tenant is missing or the registration state does not comply with the defined enum values.
     * @response `403` `void`
     * @response `404` `void`
     */
    retrieveSelectableVehicles: (
      query?: {
        /** Registration state of the vehicles. Only vehicles with the requested states will be returned in the result. If no registrationState is given, all vehicles will be returned independently of their registration state. */
        registrationState?: VehicleRegistrationState[];
      },
      params: RequestParams = {}
    ) =>
      this.request<SelectableVehiclesResponse, void>({
        path: `/gw/selectableVehicles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves data related to states of the vehicles queried. The method shall be used with at least one query parameter set (to a non-empty array).
     *
     * @tags Vehicles
     * @name RetrieveVehicleStates
     * @request GET:/gw/vehicleStates
     * @response `200` `VehicleStatesResponse` The data of all known vehicle states matching the given parameters is returned.
     * @response `400` `void` Will be returned if no filtering parameter at all is used.
     * @response `403` `void`
     * @response `404` `void`
     */
    retrieveVehicleStates: (
      query?: {
        /**
         * uid portion of VehicleIdentification. Only vehicle states matching will be returned in the result.
         * @example ["i~IVU~2619"]
         */
        vehicleUid?: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<VehicleStatesResponse, void>({
        path: `/gw/vehicleStates`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  disruptionReports = {
    /**
     * @description Creates a subscription for updates. The response contains the ID to identify the subscription by.
     *
     * @tags Updates on disruption reports
     * @name RegisterForDisruptionReportUpdates
     * @request POST:/disruptionReports/updates/subscriptions
     * @response `200` `DisruptionReportsAssignmentBody` OK
     * @response `400` `void`
     */
    registerForDisruptionReportUpdates: (
      data: DisruptionReportsSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/disruptionReports/updates/subscriptions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the subscription with the given subscription ID.
     *
     * @tags Updates on disruption reports
     * @name DeregisterForDisruptionReportUpdates
     * @request DELETE:/disruptionReports/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    deregisterForDisruptionReportUpdates: (
      subscriptionId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/disruptionReports/updates/subscriptions/${subscriptionId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Changes an existing subscription to the parameters supplied with the request body. This method can be used while already retrieving the update stream of the subscription. The changes are applied immediately.
     *
     * @tags Updates on disruption reports
     * @name ModifySubscriptionForDisruptionReports
     * @request PUT:/disruptionReports/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    modifySubscriptionForDisruptionReports: (
      subscriptionId: string,
      data: DisruptionReportsSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/disruptionReports/updates/subscriptions/${subscriptionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves the update stream for a previously registered subscription identified by its subscription ID.
     *
     * @tags Updates on disruption reports
     * @name RetrieveUpdatesForDisruptionReports
     * @request GET:/disruptionReports/updates
     * @response `200` `(DisruptionReportChange)[]` OK
     * @response `400` `void`
     * @response `404` `void`
     */
    retrieveUpdatesForDisruptionReports: (params: RequestParams = {}) =>
      this.request<DisruptionReportChange[], void>({
        path: `/disruptionReports/updates`,
        method: "GET",
        ...params,
      }),
  };
  events = {
    /**
     * @description Creates a subscription for updates. The response contains the ID to identify the subscription by.
     *
     * @tags Updates on events
     * @name RegisterForEventUpdates
     * @request POST:/events/updates/subscriptions
     * @response `200` `DisruptionReportsAssignmentBody` OK
     * @response `400` `void`
     */
    registerForEventUpdates: (
      data: EventsSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/events/updates/subscriptions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the subscription with the given subscription ID.
     *
     * @tags Updates on events
     * @name DeregisterForEventUpdates
     * @request DELETE:/events/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    deregisterForEventUpdates: (
      subscriptionId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/events/updates/subscriptions/${subscriptionId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Changes an existing subscription to the parameters supplied with the request body. This method can be used while already retrieving the update stream of the subscription. The changes are applied immediately.
     *
     * @tags Updates on events
     * @name ModifySubscriptionForEvents
     * @request PUT:/events/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    modifySubscriptionForEvents: (
      subscriptionId: string,
      data: EventsSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/events/updates/subscriptions/${subscriptionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves the update stream for a previously registered subscription identified by its subscription ID.
     *
     * @tags Updates on events
     * @name RetrieveUpdatesForEvents
     * @request GET:/events/updates
     * @response `200` `(EventChange)[]` OK
     * @response `400` `void`
     * @response `404` `void`
     */
    retrieveUpdatesForEvents: (params: RequestParams = {}) =>
      this.request<EventChange[], void>({
        path: `/events/updates`,
        method: "GET",
        ...params,
      }),
  };
  radioMessages = {
    /**
     * @description Creates a subscription for updates. The response contains the ID to identify the subscription by.
     *
     * @tags Updates on radio messages
     * @name RegisterForRadioMessageUpdates
     * @request POST:/radioMessages/updates/subscriptions
     * @response `200` `DisruptionReportsAssignmentBody` OK
     * @response `400` `void`
     */
    registerForRadioMessageUpdates: (
      data: RadioMessagesSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/radioMessages/updates/subscriptions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the subscription with the given subscription ID.
     *
     * @tags Updates on radio messages
     * @name DeregisterForRadioMessageUpdates
     * @request DELETE:/radioMessages/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    deregisterForRadioMessageUpdates: (
      subscriptionId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/radioMessages/updates/subscriptions/${subscriptionId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Changes an existing subscription to the parameters supplied with the request body. This method can be used while already retrieving the update stream of the subscription. The changes are applied immediately.
     *
     * @tags Updates on radio messages
     * @name ModifySubscriptionForRadioMessages
     * @request PUT:/radioMessages/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    modifySubscriptionForRadioMessages: (
      subscriptionId: string,
      data: RadioMessagesSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/radioMessages/updates/subscriptions/${subscriptionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves the update stream for a previously registered subscription identified by its subscription ID.
     *
     * @tags Updates on radio messages
     * @name RetrieveUpdatesForRadioMessages
     * @request GET:/radioMessages/updates
     * @response `200` `(RadioMessageChange)[]` OK
     * @response `400` `void`
     * @response `404` `void`
     */
    retrieveUpdatesForRadioMessages: (params: RequestParams = {}) =>
      this.request<RadioMessageChange[], void>({
        path: `/radioMessages/updates`,
        method: "GET",
        ...params,
      }),
  };
  blocks = {
    /**
     * @description Creates a subscription for updates. The response contains the ID to identify the subscription by.
     *
     * @tags Updates on blocks
     * @name RegisterForCondensedBlockUpdates
     * @request POST:/blocks/condensed/updates/subscriptions
     * @response `200` `DisruptionReportsAssignmentBody` OK
     * @response `400` `void`
     */
    registerForCondensedBlockUpdates: (
      data: BlockSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/blocks/condensed/updates/subscriptions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the subscription with the given subscription ID.
     *
     * @tags Updates on blocks
     * @name DeregisterForCondensedBlockUpdates
     * @request DELETE:/blocks/condensed/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    deregisterForCondensedBlockUpdates: (
      subscriptionId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/blocks/condensed/updates/subscriptions/${subscriptionId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Changes an existing subscription to the parameters supplied with the request body. This method can be used while already retrieving the update stream of the subscription. The changes are applied immediately.
     *
     * @tags Updates on blocks
     * @name ModifySubscriptionForCondensedBlocks
     * @request PUT:/blocks/condensed/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    modifySubscriptionForCondensedBlocks: (
      subscriptionId: string,
      data: BlockSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/blocks/condensed/updates/subscriptions/${subscriptionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves the update stream for a previously registered subscription identified by its subscription ID.
     *
     * @tags Updates on blocks
     * @name RetrieveUpdatesForCondensedBlocks
     * @request GET:/blocks/condensed/updates
     * @response `200` `(CondensedBlockChange)[]` OK
     * @response `400` `void`
     * @response `404` `void`
     */
    retrieveUpdatesForCondensedBlocks: (params: RequestParams = {}) =>
      this.request<CondensedBlockChange[], void>({
        path: `/blocks/condensed/updates`,
        method: "GET",
        ...params,
      }),
  };
  tripItineraries = {
    /**
     * @description Creates a subscription for updates. The response contains the ID to identify the subscription by.
     *
     * @tags Updates on trip itineraries
     * @name RegisterForTripItinerariesUpdates
     * @request POST:/tripItineraries/updates/subscriptions
     * @response `200` `DisruptionReportsAssignmentBody` OK
     * @response `400` `void`
     */
    registerForTripItinerariesUpdates: (
      data: TripItinerariesSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/tripItineraries/updates/subscriptions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the subscription with the given subscription ID.
     *
     * @tags Updates on trip itineraries
     * @name DeregisterForTripItinerariesUpdates
     * @request DELETE:/tripItineraries/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    deregisterForTripItinerariesUpdates: (
      subscriptionId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/tripItineraries/updates/subscriptions/${subscriptionId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Changes an existing subscription to the parameters supplied with the request body. This method can be used while already retrieving the update stream of the subscription. The changes are applied immediately.
     *
     * @tags Updates on trip itineraries
     * @name ModifySubscriptionForTripItineraries
     * @request PUT:/tripItineraries/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    modifySubscriptionForTripItineraries: (
      subscriptionId: string,
      data: TripItinerariesSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/tripItineraries/updates/subscriptions/${subscriptionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves the update stream for a previously registered subscription identified by its subscription ID.
     *
     * @tags Updates on trip itineraries
     * @name RetrieveUpdatesForTripItineraries
     * @request GET:/tripItineraries/updates
     * @response `200` `(TripItineraryChange)[]` OK
     * @response `400` `void`
     * @response `404` `void`
     */
    retrieveUpdatesForTripItineraries: (params: RequestParams = {}) =>
      this.request<TripItineraryChange[], void>({
        path: `/tripItineraries/updates`,
        method: "GET",
        ...params,
      }),
  };
  vehicleStates = {
    /**
     * @description Creates a subscription for updates. The response contains the ID to identify the subscription by.
     *
     * @tags Updates on vehicle states
     * @name RegisterForVehicleStateUpdates
     * @request POST:/vehicleStates/updates/subscriptions
     * @response `200` `DisruptionReportsAssignmentBody` OK
     * @response `400` `void`
     */
    registerForVehicleStateUpdates: (
      data: VehicleStatesSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<DisruptionReportsAssignmentBody, void>({
        path: `/vehicleStates/updates/subscriptions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the subscription with the given subscription ID.
     *
     * @tags Updates on vehicle states
     * @name DeregisterForVehicleStateUpdates
     * @request DELETE:/vehicleStates/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    deregisterForVehicleStateUpdates: (
      subscriptionId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/vehicleStates/updates/subscriptions/${subscriptionId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Changes an existing subscription to the parameters supplied with the request body. This method can be used while already retrieving the update stream of the subscription. The changes are applied immediately.
     *
     * @tags Updates on vehicle states
     * @name ModifySubscriptionForVehicleStates
     * @request PUT:/vehicleStates/updates/subscriptions/{subscriptionId}
     * @response `200` `void`
     * @response `400` `void`
     * @response `404` `void`
     */
    modifySubscriptionForVehicleStates: (
      subscriptionId: string,
      data: VehicleStatesSubscriptionRequestBody,
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/vehicleStates/updates/subscriptions/${subscriptionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves the update stream for a previously registered subscription identified by its subscription ID.
     *
     * @tags Updates on vehicle states
     * @name RetrieveUpdatesForVehicleStates
     * @request GET:/vehicleStates/updates
     * @response `200` `(VehicleStateChange)[]` OK
     * @response `400` `void`
     * @response `404` `void`
     */
    retrieveUpdatesForVehicleStates: (params: RequestParams = {}) =>
      this.request<VehicleStateChange[], void>({
        path: `/vehicleStates/updates`,
        method: "GET",
        ...params,
      }),
  };
}
