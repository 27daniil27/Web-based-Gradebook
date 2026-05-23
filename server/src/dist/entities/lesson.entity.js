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
exports.Lesson = void 0;
const typeorm_1 = require("typeorm");
const subject_entity_1 = require("./subject.entity");
const group_entity_1 = require("./group.entity");
const user_entity_1 = require("./user.entity");
let Lesson = class Lesson {
    id;
    subject;
    group;
    teacher;
    lessonType;
    date;
    topic;
};
exports.Lesson = Lesson;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Lesson.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject, (s) => s.lessons, { onDelete: 'CASCADE' }),
    __metadata("design:type", subject_entity_1.Subject)
], Lesson.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_entity_1.Group, (g) => g.lessons, { onDelete: 'CASCADE' }),
    __metadata("design:type", group_entity_1.Group)
], Lesson.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Lesson.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lesson_type' }),
    __metadata("design:type", String)
], Lesson.prototype, "lessonType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Lesson.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lesson.prototype, "topic", void 0);
exports.Lesson = Lesson = __decorate([
    (0, typeorm_1.Entity)({ name: 'lessons' })
], Lesson);
//# sourceMappingURL=lesson.entity.js.map