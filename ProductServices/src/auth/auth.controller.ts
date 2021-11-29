import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }

  @Get()
  @ApiBearerAuth() 
  @UseGuards(JwtGuard) 
  checkUserController(@Request() req) {
     
    return req.user
  }

  @Post()
  async loginController(@Body() authDto: AuthDto) {
    let user = await this.authService.checkUser(authDto.username, authDto.password)
    return this.authService.generateToken({ 
      id: user.id,   
      loginController_payload : user
    })
  }

}
