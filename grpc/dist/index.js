"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const PROTO_PATH = path_1.default.join(__dirname, './a.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
}); //load the proto file
const productProto = grpc.loadPackageDefinition(packageDefinition);
const products = [
    {
        name: 'product1',
        description: 'product1',
        price: 100,
        stock: 100
    },
    {
        name: 'product2',
        description: 'product2',
        price: 200,
        stock: 200
    },
];
function addProduct(call, callback) {
    let product = {
        name: call.request.name,
        description: call.request.description,
        price: call.request.price,
        stock: call.request.stock
    };
    products.push(product);
    callback(null, { product });
}
function getProduct(call, callback) {
    callback(null, { products });
}
function getProductByName(call, callback) {
    let product = products.find(p => p.name === call.request.name);
    callback(null, product);
}
const server = new grpc.Server();
server.addService(productProto.ProductService.service, {
    addProduct: addProduct,
    getProduct: getProduct,
    getProductByName: getProductByName
});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`server is running on ${port}`);
});
