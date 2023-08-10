import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';

class Token {
  @ApiProperty()
  token: string;
}

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @ApiCreatedResponse({ type: Token })
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: Token })
  @ApiUnauthorizedResponse({ description: 'Incorrect email or password.' })
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return await this.authService.login(loginDto);
  }
}
