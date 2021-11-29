import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";  
import { UserService } from "src/user/user.service";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private userService: UserService
    ) {
        super({
           
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),    

            ignoreExpiration: false, 
            secretOrKey: process.env.JWT_SECRET_KEY, 
        })
    }

    async validate(payload: any) { 
        let user = await this.userService.findOne(payload.id)
        
        let payload_loginController: any = {}
        if (payload.tampilkan_semua_payload && payload.tampilkan_semua_payload.loginController_payload) {
            payload_loginController = JSON.parse(JSON.stringify(payload.tampilkan_semua_payload.loginController_payload))
            
            delete payload_loginController.password 
        }
 
        if (user) {
            let res_json: any = {
                id: user.id, 
                nama_user: user.nama_user, 
                payload_login_controller: payload_loginController 
            }
            return res_json
        }
        else {
            throw new UnauthorizedException()
        }
    }

}