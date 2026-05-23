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
exports.Subject = void 0;
const typeorm_1 = require("typeorm");
const lesson_entity_1 = require("./lesson.entity");
const subject_work_entity_1 = require("./subject_work.entity");
let Subject = class Subject {
    id;
    name;
    lessons;
    works;
};
exports.Subject = Subject;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Subject.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subject.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lesson_entity_1.Lesson, (l) => l.subject),
    __metadata("design:type", Array)
], Subject.prototype, "lessons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subject_work_entity_1.SubjectWork, (w) => w.subject),
    __metadata("design:type", Array)
], Subject.prototype, "works", void 0);
exports.Subject = Subject = __decorate([
    (0, typeorm_1.Entity)({ name: 'subjects' })
], Subject);
//# sourceMappingURL=subject.entity.js.map