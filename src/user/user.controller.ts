import { Controller ,Req} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';

import { User } from "@prisma/client"
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {


    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user:User, @GetUser('email') email:string){
        console.log(email)
        return user
    }
}
