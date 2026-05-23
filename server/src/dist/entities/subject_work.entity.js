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
exports.SubjectWork = void 0;
const typeorm_1 = require("typeorm");
const subject_entity_1 = require("./subject.entity");
const submission_entity_1 = require("./submission.entity");
let SubjectWork = class SubjectWork {
    id;
    subject;
    title;
    description;
    deadline;
    submissions;
};
exports.SubjectWork = SubjectWork;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SubjectWork.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject, (s) => s.works, { onDelete: 'CASCADE' }),
    __metadata("design:type", subject_entity_1.Subject)
], SubjectWork.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SubjectWork.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SubjectWork.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], SubjectWork.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => submission_entity_1.Submission, (sub) => sub.work),
    __metadata("design:type", Array)
], SubjectWork.prototype, "submissions", void 0);
exports.SubjectWork = SubjectWork = __decorate([
    (0, typeorm_1.Entity)({ name: 'subject_works' })
], SubjectWork);
//# sourceMappingURL=subject_work.entity.js.map