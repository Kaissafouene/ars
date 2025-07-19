import { PrismaService } from '../prisma/prisma.service';
import { FeedbackDto } from './feedback.dto';
export declare class FeedbackController {
    private prisma;
    constructor(prisma: PrismaService);
    submitFeedback(body: FeedbackDto, req: any): Promise<{
        success: boolean;
    }>;
}
