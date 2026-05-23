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
exports.JournalEntry = void 0;
const typeorm_1 = require("typeorm");
const lesson_entity_1 = require("./lesson.entity");
const student_entity_1 = require("./student.entity");
let JournalEntry = class JournalEntry {
    id;
    lesson;
    student;
    attendance;
    grade;
    note;
};
exports.JournalEntry = JournalEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JournalEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lesson_entity_1.Lesson, { onDelete: 'CASCADE' }),
    __metadata("design:type", lesson_entity_1.Lesson)
], JournalEntry.prototype, "lesson", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student, (s) => s.journalEntries, { onDelete: 'CASCADE' }),
    __metadata("design:type", student_entity_1.Student)
], JournalEntry.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'present' }),
    __metadata("design:type", String)
], JournalEntry.prototype, "attendance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', nullable: true }),
    __metadata("design:type", Object)
], JournalEntry.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], JournalEntry.prototype, "note", void 0);
exports.JournalEntry = JournalEntry = __decorate([
    (0, typeorm_1.Entity)({ name: 'journal_entries' }),
    (0, typeorm_1.Unique)(['lesson', 'student'])
], JournalEntry);
//# sourceMappingURL=journal_entry.entity.js.map