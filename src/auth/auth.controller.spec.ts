import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser = {
    _id: '64d8c9cfe874c0693be7a19a',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
  };

  const jwtToken = 'jwtToken';

  const otp = {
    resetPasswordOtp: 12345678,
    resetOtpExpiry: new Date(),
  };

  const mockAuthService = {
    signUp: jest.fn().mockReturnValue(jwtToken),
    login: jest.fn().mockReturnValue(jwtToken),
    forgotPassword: jest.fn().mockReturnValue(otp),
    resetPassword: jest.fn().mockReturnValue(mockUser._id),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should register the new user', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '12345678',
      };

      const result = await authController.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });

  describe('login', () => {
    it('should login the user', async () => {
      const loginDto = {
        email: 'johndoe@gmail.com',
        password: '12345678',
      };

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });

  describe('forgot-password', () => {
    it('should get an otp', async () => {
      const forgotPasswordDto = {
        email: 'johndoe@gmail.com',
      };

      const result = await authController.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalled();
      expect(result).toEqual(otp);
    });
  });

  describe('reset-password', () => {
    it('should return a user id', async () => {
      const resetPasswordDto = {
        newPassword: 'Password123',
        resetPasswordOtp: 12345678,
      };

      const result = await authController.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalled();
      expect(result).toEqual(mockUser._id);
    });
  });
});
