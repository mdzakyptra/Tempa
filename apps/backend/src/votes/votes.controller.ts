import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoteResponseDto } from './dto/vote-response.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiStandardResponse } from '../common/decorators/api-standard-response.decorator';


// Endpoint pembatalan dukungan (unvote) sengaja belum dibuat di JEK-20 ini —
// belum ada kebutuhan produk yang eksplisit (halaman Detail Laporan cuma
// menyebut "tombol dukung"). Bisa ditambah sebagai tiket terpisah kalau
// alur produk memang butuh.
@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  //<---------- create -------------->
  @Post()
  @Auth()
  @ApiStandardResponse(VoteResponseDto, {
    description: 'Berhasil mendukung laporan',
  })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateVoteDto) {
    return this.votesService.vote(user.sub, dto.report_id);
  }
}
