import { PrismaService } from '../prisma/prisma.service';
export interface Template {
    id: string;
    name: string;
    subject: string;
    body: string;
    variables: string[];
}
export declare class TemplateService {
    private prisma;
    constructor(prisma: PrismaService);
    listTemplates(): Promise<Template[]>;
    getTemplate(id: string): Promise<Template>;
    createTemplate(template: Omit<Template, 'id'>): Promise<Template>;
    updateTemplate(id: string, update: Partial<Template>): Promise<Template>;
    deleteTemplate(id: string): Promise<void>;
    renderTemplate(templateBody: string, variables: Record<string, string>): string;
}
