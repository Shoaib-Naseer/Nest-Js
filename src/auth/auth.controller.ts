import { Controller, Post,HttpCode } from "@nestjs/common";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}
    
    
    @HttpCode(200)
    @Post('signup')
    signup(@Body() dto: AuthDto){
        console.log(dto)
        return this.authService.signUp(dto)

    }
    @Post("login")
    login(@Body() dto:AuthDto){
        return this.authService.login(dto)
    }

}