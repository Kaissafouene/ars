import { CreateBulletinSoinDto } from './create-bulletin-soin.dto';
declare const UpdateBulletinSoinDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBulletinSoinDto>>;
export declare class UpdateBulletinSoinDto extends UpdateBulletinSoinDto_base {
    etat?: string;
    ownerId?: number;
    observationGlobal?: string;
}
export {};
