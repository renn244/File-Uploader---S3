import { ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { Repository } from 'typeorm';
import { ClerkEvent } from './interface/clerk.event.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        @Inject('USER_REPOSITORY') private readonly userRepository: Repository<User>,
    ) {}

    async createPostWebHook(req: Request, body: any) {
    
        const event = await this.verifyWebhook(body, req.headers);
        
        if(event.type === 'user.created') {
            const name = ((event.data.first_name ?? "") + (event.data.last_name ?? ""))

            const user = this.userRepository.create({
                clerkId: event.data.id,
                name: name,
                username: event.data.username || "",
                profileImageUrl: event.data.image_url,
                createdAt: new Date(event.data.created_at),
            })
            this.userRepository.save(user);
        } else if(event.type === 'user.updated') {
            const name =
                `${event.data.first_name ?? ''} ${event.data.last_name ?? ''}`.trim() ||
                'Unnamed User';
            
            await this.userRepository.update(
                { clerkId: event.data.id },
                {
                    name: name,
                    username: event.data.username || null,
                    profileImageUrl: event.data.image_url,
                }
            )
        } else if(event.type === 'user.deleted') {
            await this.userRepository.delete(
                { clerkId: event.data.id }
            )
        }

        return {
            message: "Successfulyl received the event!"
        }
    }

    async verifyWebhook(data: any, headers: Headers) {
        const WEBHOOK_SECRET = this.configService.get<string>('CLERK_WEBHOOK_SECRET')
        
        if(!WEBHOOK_SECRET) throw new InternalServerErrorException();

        const wh = new Webhook(WEBHOOK_SECRET);

        try {
            const event = wh.verify(JSON.stringify(data), {
                "svix-id": headers['svix-id'],
                "svix-signature": headers['svix-signature'],
                "svix-timestamp": headers['svix-timestamp']
            })

            return event as ClerkEvent
        } catch (error) {
            throw new ForbiddenException('Invalid Signature!')
        }
    }
}
