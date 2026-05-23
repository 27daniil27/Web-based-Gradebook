"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_controller_1 = require("./controllers/users/auth.controller");
const group_entity_1 = require("./entities/group.entity");
const journal_entry_entity_1 = require("./entities/journal_entry.entity");
const lesson_entity_1 = require("./entities/lesson.entity");
const student_entity_1 = require("./entities/student.entity");
const subject_work_entity_1 = require("./entities/subject_work.entity");
const subject_entity_1 = require("./entities/subject.entity");
const submission_entity_1 = require("./entities/submission.entity");
const user_entity_1 = require("./entities/user.entity");
const auth_repository_1 = require("./repositories/users/auth.repository");
const auth_service_1 = require("./services/users/auth.service");
const entities = [
    group_entity_1.Group,
    journal_entry_entity_1.JournalEntry,
    lesson_entity_1.Lesson,
    student_entity_1.Student,
    subject_entity_1.Subject,
    subject_work_entity_1.SubjectWork,
    submission_entity_1.Submission,
    user_entity_1.User,
];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ['src/.env', '.env'],
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const port = Number(config.getOrThrow('DB_PORT'));
                    if (!Number.isInteger(port)) {
                        throw new Error('DB_PORT must be an integer');
                    }
                    return {
                        type: 'postgres',
                        host: config.getOrThrow('DB_HOST'),
                        port,
                        username: config.getOrThrow('DB_USER'),
                        password: config.getOrThrow('DB_PASS'),
                        database: config.getOrThrow('DB_NAME'),
                        entities,
                        retryAttempts: 3,
                        retryDelay: 1000,
                        synchronize: config.get('DB_SYNC') === 'true',
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_repository_1.AuthRepository, auth_service_1.AuthService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map