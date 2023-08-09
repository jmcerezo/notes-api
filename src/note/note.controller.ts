import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './schemas/note.schema';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.noteService.createNote(createNoteDto);
  }

  @Get()
  async getAllNotes(@Query() query): Promise<Note[]> {
    return this.noteService.getAllNotes(query);
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string): Promise<Note> {
    return this.noteService.getNoteById(id);
  }

  @Put(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.noteService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  async deleteNote(@Param() id: string): Promise<Note> {
    return this.noteService.deleteNote(id);
  }
}
