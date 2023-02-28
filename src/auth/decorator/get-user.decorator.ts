//This decorator is made so we have access to request object and from there we'll fetch user data

import {createParamDecorator,ExecutionContext} from '@nestjs/common'

export const GetUser = createParamDecorator(
    (data:string | undefined,ctx:ExecutionContext)=>{
        const request:Express.Request = ctx.switchToHttp().getRequest();
        //if a parameter is passed in params to get a specific field from user object that parameter will be available in data
        if(data){
            return request.user[data]
        }
        return request.user;
    }
)