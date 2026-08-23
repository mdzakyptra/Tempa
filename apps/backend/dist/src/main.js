"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Antrean Kota API')
        .setDescription('API pelaporan infrastruktur kota Antrean Kota')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    setupSwagger(app);
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map