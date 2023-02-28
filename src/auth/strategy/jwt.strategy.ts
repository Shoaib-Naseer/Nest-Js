import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){

    // reason why config is not private and prisma is private
    // if it is private it mean that simply that object is created and is accessible through this
    // if we made config private then that will available through this and this will be created after super
    // is called but we want before super is called so we dont give private 
    constructor(config:ConfigService,private prisma:PrismaService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:config.get('JWT_SECRET')
        })
    }

    //token is converted into payload and pass it into the validate method 
    //and this validate automatically append the req object with these values 
    async validate(payload: {sub:string,email:string}) {
        const user = await this.prisma.user.findUnique({
            where:{
                id:payload.sub
            }
        })
      const {hash ,...result} = user
      return result 
      }   

}