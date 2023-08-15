import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { addMinutes } from 'date-fns';
import { Otp, Token } from './return-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  private generateOtp() {
    return {
      resetPasswordOtp: Math.floor(10000000 + Math.random() * 90000000),
      resetOtpExpiry: addMinutes(Date.now(), 5),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<Token> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ id: user._id });

      return { token };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('This email is already registered.');
      }
    }
  }

  async login(loginDto: LoginDto): Promise<Token> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const token = await this.jwtService.signAsync({ id: user._id });

    return { token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<Otp> {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid email address.');
    }

    const otp = this.generateOtp();

    await this.userModel.findByIdAndUpdate(user._id, otp);

    return otp;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { resetPasswordOtp, newPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({ resetPasswordOtp });

    if (!user || user.resetOtpExpiry < new Date()) {
      throw new BadRequestException('Your OTP is invalid.');
    }

    const password = await bcrypt.hash(newPassword, 10);

    const update = { password, resetPasswordOtp: null, resetOtpExpiry: null };

    await this.userModel.findByIdAndUpdate(user._id, update);

    return user._id;
  }
}
