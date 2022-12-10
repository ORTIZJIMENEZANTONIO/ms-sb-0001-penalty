"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLegalAffairDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const legal_affair_dto_1 = require("./legal-affair.dto");
class UpdateLegalAffairDto extends (0, swagger_1.PartialType)(legal_affair_dto_1.LegalAffairDto) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'identificador numérico' }),
    __metadata("design:type", Number)
], UpdateLegalAffairDto.prototype, "idToUpdate", void 0);
exports.UpdateLegalAffairDto = UpdateLegalAffairDto;
//# sourceMappingURL=update-legal-affair.dto.js.map