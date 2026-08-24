import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AiAssistantService } from './ai-assistant.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { AiAnswerDto } from './dto/ai-answer.dto';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator';
import { ApiStandardResponse } from '../common/decorators/api-standard-response.decorator';


@ApiTags('AI Assistant')
@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  //<---------- ask -------------->
  @Post('ask')
  @OptionalAuth()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @ApiStandardResponse(AiAnswerDto, {
    description: 'Jawaban asisten, digrounding dari data skor asli',
  })
  ask(@Body() dto: AskQuestionDto) {
    return this.aiAssistantService.ask(dto);
  }
}
