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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './schemas/note.schema';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('notes')
@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Note })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req,
  ): Promise<Note> {
    return this.noteService.createNote(createNoteDto, req.user);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async getAllNotes(@Query() query): Promise<Note[]> {
    return this.noteService.getAllNotes(query);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async getNoteById(@Param('id') id: string): Promise<Note> {
    return this.noteService.getNoteById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.noteService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Note })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async deleteNote(@Param('id') id: string): Promise<Note> {
    return this.noteService.deleteNote(id);
  }
}
