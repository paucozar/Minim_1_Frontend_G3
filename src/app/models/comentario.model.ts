export interface Comentario {
    _id: string;
    content: string;
    userId: string; 
    gymId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateComentarioDTO {
    content: string;
    userId: string; 
    gymId: string;
}

export class Comentario implements Comentario {
    constructor() {}
}