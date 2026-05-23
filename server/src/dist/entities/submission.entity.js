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
exports.Submission = void 0;
const typeorm_1 = require("typeorm");
const subject_work_entity_1 = require("./subject_work.entity");
const student_entity_1 = require("./student.entity");
let Submission = class Submission {
    id;
    work;
    student;
    status;
    solution_url;
    grade;
    submitted_at;
};
exports.Submission = Submission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Submission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_work_entity_1.SubjectWork, (w) => w.submissions, { onDelete: 'CASCADE' }),
    __metadata("design:type", subject_work_entity_1.SubjectWork)
], Submission.prototype, "work", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (s) => s.submissions, { onDelete: 'CASCADE' }),
    __metadata("design:type", student_entity_1.Student)
], Submission.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Submission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Submission.prototype, "solution_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', nullable: true }),
    __metadata("design:type", Object)
], Submission.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Submission.prototype, "submitted_at", void 0);
exports.Submission = Submission = __decorate([
    (0, typeorm_1.Entity)({ name: 'submissions' })
], Submission);
//# sourceMappingURL=submission.entity.js.map