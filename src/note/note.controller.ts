import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NoteService } from './note.service';
import { Note } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Note })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req: any,
  ): Promise<Note> {
    return await this.noteService.createNote(createNoteDto, req.user);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiQuery({ name: 'keyword', type: String, required: false })
  async getAllNotes(@Req() req: any, @Query() query: any): Promise<Note[]> {
    return await this.noteService.getAllNotes(req.user._id, query);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async getNoteById(@Param('id') id: string): Promise<Note> {
    return await this.noteService.getNoteById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return await this.noteService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async deleteNote(@Param('id') id: string): Promise<Note> {
    return await this.noteService.deleteNote(id);
  }
}
