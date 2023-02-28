import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime'
import {ConfigService} from "@nestjs/config"
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { JwtService } from "@nestjs/jwt/dist";

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService , private jwt: JwtService ,private config: ConfigService ){}
    
    async login(dto:AuthDto){
        const user = await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            }
        })
        if(!user){
            throw new ForbiddenException("Credentials incorrect")
        }
        const pwMatches = await argon.verify(user.hash,dto.password)
        if(!pwMatches){
            throw new ForbiddenException("Credentials incorrect")
        }
        delete user.hash;
        return this.signToken(user.id,user.email)

    }

    async signUp(dto:AuthDto ){
        //Generate the password hash
        const hash = await argon.hash(dto.password);

        // save the new user in DB
        try {
            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash
                },
                //Return only selected Fields
                select:{
                    id:true,
                    email:true,
                    createdAt:true
                }
            })
            return user;
            
        } catch (error) {
            if(error.code =='P2002'){
                throw new ForbiddenException("Credentials taken")
            }
            throw error;
        }
    }

    async signToken(userId:string,email:string): Promise<{access_token :string}>{
        const payload = {
            sub:userId,
            email
        };
        const secret = this.config.get("JWT_SECRET")
        const token =await this.jwt.signAsync(payload,{
            expiresIn:"15m",
            secret
        })
        return {access_token: token,}
    }

}