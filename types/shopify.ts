export type DisplayFinancialStatus = 
  | 'PAID'
  | 'PENDING'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'VOIDED'
  | 'AUTHORIZED';

export type DisplayFulfillmentStatus = 
  | 'FULFILLED'
  | 'UNFULFILLED'
  | 'PARTIALLY_FULFILLED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'SCHEDULED'
  | 'RESTOCKED';

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Customer {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  ordersCount?: number;
}

export interface ShippingAddress {
  name: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string | null;
}

export interface ShippingLine {
  title: string;
  code: string | null;
  price: Money;
  trackingCompany?: string | null;
  trackingNumber?: string | null;
}

export interface LineItem {
  id: string;
  title: string;
  quantity: number;
  sku: string | null;
  variantTitle: string | null;
  imageUrl: string | null;
  unitPrice: Money;
  totalPrice: Money;
}

export interface ShopifyOrder {
  id: string;
  name: string; // Order Number (e.g. #1001)
  createdAt: string;
  processedAt: string;
  note: string | null;
  displayFinancialStatus: DisplayFinancialStatus;
  displayFulfillmentStatus: DisplayFulfillmentStatus;
  totalPrice: Money;
  subtotalPrice: Money;
  totalTax: Money;
  totalShippingPrice: Money;
  customer: Customer | null;
  shippingAddress: ShippingAddress | null;
  shippingLine: ShippingLine | null;
  lineItems: LineItem[];
  rawGraphQLNode?: any;
}

export interface OrdersApiResponse {
  orders: ShopifyOrder[];
  isMock: boolean;
  isLocalGraphQL?: boolean;
  totalCount: number;
  graphQLQueryUsed: string;
  error?: string;
}
