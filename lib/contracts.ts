// Contract Addresses (Sepolia Testnet)
export const BOOKING_TOKEN_ADDRESS = "0xc98E63aFB782C96eb24af410c3c63091Db663a73";
export const BOOKING_SYSTEM_ADDRESS = "0xeAaDD7C8200FcC208eA126FF945F6D03a59378A0";

export const SEPOLIA_CHAIN_ID = 11155111;

export const BOOKING_TOKEN_ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "allowance", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "approve", inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "balanceOf", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "mint", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "name", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "owner", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "totalSupply", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "transfer", inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "transferFrom", inputs: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "event", name: "Approval", inputs: [{ name: "owner", type: "address", indexed: true }, { name: "spender", type: "address", indexed: true }, { name: "value", type: "uint256", indexed: false }] },
  { type: "event", name: "Transfer", inputs: [{ name: "from", type: "address", indexed: true }, { name: "to", type: "address", indexed: true }, { name: "value", type: "uint256", indexed: false }] },
] as const;

export const BOOKING_SYSTEM_ABI = [
  { type: "constructor", inputs: [{ name: "tokenAddress", type: "address" }], stateMutability: "nonpayable" },
  { type: "function", name: "addService", inputs: [{ name: "name", type: "string" }, { name: "price", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "book", inputs: [{ name: "serviceId", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "bookingCount", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "bookings", inputs: [{ name: "", type: "uint256" }], outputs: [{ name: "user", type: "address" }, { name: "serviceId", type: "uint256" }, { name: "amountPaid", type: "uint256" }, { name: "cancelled", type: "bool" }, { name: "timestamp", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "cancel", inputs: [{ name: "bookingId", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "getBooking", inputs: [{ name: "id", type: "uint256" }], outputs: [{ name: "", type: "tuple", components: [{ name: "user", type: "address" }, { name: "serviceId", type: "uint256" }, { name: "amountPaid", type: "uint256" }, { name: "cancelled", type: "bool" }, { name: "timestamp", type: "uint256" }] }], stateMutability: "view" },
  { type: "function", name: "getService", inputs: [{ name: "id", type: "uint256" }], outputs: [{ name: "", type: "tuple", components: [{ name: "name", type: "string" }, { name: "price", type: "uint256" }, { name: "active", type: "bool" }] }], stateMutability: "view" },
  { type: "function", name: "owner", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "pause", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "paused", inputs: [], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
  { type: "function", name: "paymentToken", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  { type: "function", name: "serviceCount", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "services", inputs: [{ name: "", type: "uint256" }], outputs: [{ name: "name", type: "string" }, { name: "price", type: "uint256" }, { name: "active", type: "bool" }], stateMutability: "view" },
  { type: "function", name: "unpause", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "updateService", inputs: [{ name: "id", type: "uint256" }, { name: "newPrice", type: "uint256" }, { name: "active", type: "bool" }], outputs: [], stateMutability: "nonpayable" },
  { type: "event", name: "Booked", inputs: [{ name: "bookingId", type: "uint256", indexed: true }, { name: "user", type: "address", indexed: true }, { name: "serviceId", type: "uint256", indexed: true }] },
  { type: "event", name: "Cancelled", inputs: [{ name: "bookingId", type: "uint256", indexed: true }] },
  { type: "event", name: "ServiceAdded", inputs: [{ name: "id", type: "uint256", indexed: true }, { name: "name", type: "string", indexed: false }, { name: "price", type: "uint256", indexed: false }] },
  { type: "event", name: "ServiceUpdated", inputs: [{ name: "id", type: "uint256", indexed: true }, { name: "newPrice", type: "uint256", indexed: false }, { name: "active", type: "bool", indexed: false }] },
] as const;
