import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { GrpcObject, ServiceClientConstructor } from '@grpc/grpc-js';

const PROTO_PATH = path.join(__dirname, './a.proto');

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
]

function addProduct(call: any, callback: any) {
    let product = {
        name: call.request.name,
        description: call.request.description,
        price: call.request.price,
        stock: call.request.stock
    }
    products.push(product);
    callback(null, { product });
}

function getProduct(call: any, callback: any) {
    callback(null, { products});
}

function getProductByName(call: any, callback: any) {
    let product = products.find(p => p.name === call.request.name);
    callback(null, product);
}

const server = new grpc.Server();
server.addService((productProto.ProductService as ServiceClientConstructor).service, {
    addProduct: addProduct,
    getProduct: getProduct,
    getProductByName: getProductByName
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`server is running on ${port}`);
});