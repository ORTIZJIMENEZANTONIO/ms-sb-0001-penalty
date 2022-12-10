"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const station_entity_1 = require("./entities/station.entity");
const station_service_1 = require("./station.service");
const station_controller_1 = require("./station.controller");
let StationModule = class StationModule {
};
StationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([station_entity_1.StationEntity])],
        providers: [station_service_1.StationService,
            (0, nestjs_prometheus_1.makeCounterProvider)({
                name: 'station_sae_served',
                help: 'station_sae_help'
            })
        ],
        controllers: [station_controller_1.StationController]
    })
], StationModule);
exports.StationModule = StationModule;
//# sourceMappingURL=station.module.js.map