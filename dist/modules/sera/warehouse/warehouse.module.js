"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const warehouse_service_1 = require("./warehouse.service");
const warehouse_controller_1 = require("./warehouse.controller");
const warehouse_entity_1 = require("./entities/warehouse.entity");
let WarehouseModule = class WarehouseModule {
};
WarehouseModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([warehouse_entity_1.WarehouseEntity])],
        providers: [warehouse_service_1.WarehouseService,
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'warehouse_served',
                help: 'warehouse_help'
            })
        ],
        controllers: [warehouse_controller_1.WarehouseController]
    })
], WarehouseModule);
exports.WarehouseModule = WarehouseModule;
//# sourceMappingURL=warehouse.module.js.map