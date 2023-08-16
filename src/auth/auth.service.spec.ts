import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockUser = {
    _id: '64d8c9cfe874c0693be7a19a',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
  };

  const token = 'jwtToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: getModelToken(User.name), useValue: mockAuthService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined;
  });

  describe('signUp', () => {
    const signUpDto = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345678',
    };

    it('should register the new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest
        .spyOn(userModel, 'create')
        .mockImplementation(() => Promise.resolve(mockUser).then());

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should throw email is already registered', async () => {
      jest
        .spyOn(userModel, 'create')
        .mockImplementation(() => Promise.reject({ code: 11000 }));

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'johndoe@gmail.com',
      password: '12345678',
    };

    it('should login the user and return the token', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(result).toEqual({ token });
    });

    it('should throw incorrect email error', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw incorrect password error', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgot-password', () => {
    const otp = {
      resetPasswordOtp: 12345678,
      resetOtpExpiry: new Date(),
    };

    it('should return otp', async () => {
      const updatedUser = { ...mockUser, ...otp };
      const { resetPasswordOtp, resetOtpExpiry } = updatedUser;

      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

      expect(otp).toEqual({ resetPasswordOtp, resetOtpExpiry });
    });

    it('should throw BadRequestException if email is invalid', async () => {
      const forgotPasswordDto = { email: 'test@gmail.com' };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(
        authService.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow(BadRequestException);

      expect(userModel.findOne).toHaveBeenLastCalledWith(forgotPasswordDto);
    });
  });

  describe('reset-password', () => {
    const resetPasswordDto = {
      resetPasswordOtp: 12345678,
      newPassword: 'Password123',
    };

    it('should return user id', async () => {
      const updatedUser = { ...mockUser, ...resetPasswordDto };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

      const result = await authService.resetPassword(resetPasswordDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual(mockUser._id);
    });

    it('should throw BadRequestException if otp is invalid', async () => {
      const { resetPasswordOtp } = resetPasswordDto;

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(userModel.findOne).toHaveBeenLastCalledWith({ resetPasswordOtp });
    });
  });
});
