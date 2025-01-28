/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
  constructor(
    private readonly allowedMimeTypes: string[],
    private readonly maxSize: number,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file: Express.Multer.File = request.file;
    if (!file) {
      throw new BadRequestException("Aucun fichier n'a été téléchargé.");
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Le fichier doit être de type PNG ou GPEG.',
      );
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `La taille du fichier ne doit pas dépasser ${this.maxSize} octets.`,
      );
    }

    return next.handle();
  }
}
