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
exports.Student = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const group_entity_1 = require("./group.entity");
const journal_entry_entity_1 = require("./journal_entry.entity");
const submission_entity_1 = require("./submission.entity");
let Student = class Student {
    id;
    user;
    group;
    journalEntries;
    submissions;
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Student.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_entity_1.Group, (g) => g.students, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", Object)
], Student.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => journal_entry_entity_1.JournalEntry, (je) => je.student),
    __metadata("design:type", Array)
], Student.prototype, "journalEntries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => submission_entity_1.Submission, (s) => s.student),
    __metadata("design:type", Array)
], Student.prototype, "submissions", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)({ name: 'students' })
], Student);
//# sourceMappingURL=student.entity.js.map