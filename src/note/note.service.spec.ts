import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';
import mongoose, { Model } from 'mongoose';
import { Note } from './schemas/note.schema';
import { User } from '../auth/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('NoteService', () => {
  let noteService: NoteService;
  let noteModel: Model<Note>;

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
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        { provide: getModelToken(Note.name), useValue: mockNoteService },
      ],
    }).compile();

    noteService = module.get<NoteService>(NoteService);
    noteModel = module.get<Model<Note>>(getModelToken(Note.name));
  });

  describe('createBook', () => {
    it('should create and return a note', async () => {
      const newNote = {
        title: 'Note 1',
        content: 'Note 1 Content',
      };

      jest
        .spyOn(noteModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockNote).then());

      const result = await noteService.createNote(
        newNote as CreateNoteDto,
        mockUser as User,
      );

      expect(result).toEqual(mockNote);
    });
  });

  describe('getAllNotes', () => {
    it('should return an array of notes', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(noteModel, 'find').mockImplementation(
        () =>
          ({
            where: () => ({
              equals: () => ({
                sort: jest.fn().mockResolvedValue([mockNote]),
              }),
            }),
          } as any),
      );

      const result = await noteService.getAllNotes(mockUser._id, query);

      expect(result).toEqual([mockNote]);
    });
  });

  describe('getNoteById', () => {
    it('should return a single note', async () => {
      jest.spyOn(noteModel, 'findById').mockResolvedValue(mockNote);

      const result = await noteService.getNoteById(mockNote._id);

      expect(noteModel.findById).toHaveBeenLastCalledWith(mockNote._id);
      expect(result).toEqual(mockNote);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(noteService.getNoteById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIdMock).toHaveBeenLastCalledWith(id);
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(noteModel, 'findById').mockResolvedValue(null);

      await expect(noteService.getNoteById(mockNote._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(noteModel.findById).toHaveBeenLastCalledWith(mockNote._id);
    });
  });

  describe('updateNote', () => {
    it('should update and return a note', async () => {
      const updatedNote = { ...mockNote, title: 'Updated title' };
      const note = { title: 'Updated title' };

      jest.spyOn(noteModel, 'findByIdAndUpdate').mockResolvedValue(updatedNote);

      const result = await noteService.updateNote(mockNote._id, note as any);

      expect(noteModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockNote._id,
        note,
        { new: true },
      );

      expect(result.title).toEqual(note.title);
    });
  });

  describe('deleteNote', () => {
    it('should delete and return a note', async () => {
      jest.spyOn(noteModel, 'findByIdAndDelete').mockResolvedValue(mockNote);

      const result = await noteService.deleteNote(mockNote._id);

      expect(noteModel.findByIdAndDelete).toHaveBeenCalledWith(mockNote._id);

      expect(result).toEqual(mockNote);
    });
  });
});
