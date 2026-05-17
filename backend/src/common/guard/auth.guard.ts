import { verifyToken } from "@clerk/backend";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClerkAuthGuard implements CanActivate {

    constructor(
        private readonly configService: ConfigService
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();  
        
        const token = this.extractTokenFromHeader(request);

        try {
            const payload = await verifyToken(token!, {
                secretKey: this.configService.get("CLERK_SECRET_KEY")!,
            });
            request.user = payload;

            return true
        } catch (error) {
            throw new UnauthorizedException("Invalid Token!")                        
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers["authorization"]?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}