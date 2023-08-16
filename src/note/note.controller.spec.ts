import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { PassportModule } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

describe('NoteController', () => {
  let noteController: NoteController;
  let noteService: NoteService;

  const mockNote = {
    _id: '64dada20aa6b96af74cd6a1c',
    title: 'Note 1',
    content: 'Note 1 Content',
    user: '64d8c9cfe874c0693be7a19a',
  };

  const mockUser = {
    _id: '64d8c9cfe874c0693be7a19a',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
  };

  const mockNoteService = {
    createNote: jest.fn(),
    getAllNotes: jest.fn().mockReturnValue([mockNote]),
    getNoteById: jest.fn().mockReturnValue(mockNote),
    updateNote: jest.fn(),
    deleteNote: jest.fn().mockReturnValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [NoteController],
      providers: [{ provide: NoteService, useValue: mockNoteService }],
    }).compile();

    noteController = module.get<NoteController>(NoteController);
    noteService = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(noteController).toBeDefined();
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const newNote = {
        title: 'Note 1',
        content: 'Note 1 Content',
      };

      mockNoteService.createNote = jest.fn().mockReturnValue(mockNote);

      const result = await noteController.createNote(
        newNote as CreateNoteDto,
        mockUser as User,
      );

      expect(noteService.createNote).toHaveBeenCalled();
      expect(result).toEqual(mockNote);
    });
  });

  describe('getAllNotes', () => {
    it('should get all notes', async () => {
      const req = { user: { ...mockUser } };
      const query = {
        keyword: 'test',
        page: '1',
      };

      const result = await noteController.getAllNotes(req, query);

      expect(noteService.getAllNotes).toHaveBeenCalled();
      expect(result).toEqual([mockNote]);
    });
  });

  describe('getNoteById', () => {
    it('should get one note', async () => {
      const result = await noteController.getNoteById(mockNote._id);

      expect(noteService.getNoteById).toHaveBeenCalled();
      expect(result).toEqual(mockNote);
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const updatedNote = { ...mockNote, title: 'Updated title' };
      const note = { title: 'Updated title' };

      mockNoteService.updateNote = jest.fn().mockReturnValue(updatedNote);

      const result = await noteController.updateNote(
        mockNote._id,
        note as UpdateNoteDto,
      );

      expect(noteService.getNoteById).toHaveBeenCalled();
      expect(result).toEqual(updatedNote);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const result = await noteController.deleteNote(mockNote._id);

      expect(noteService.deleteNote).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });
});
