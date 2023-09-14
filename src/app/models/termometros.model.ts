export class Termometro{
    constructor(
        public code: string,
        public status: boolean,
        public fecha: Date,
        public temperatura: string,
        public tid?: string,
        public _id?: string,
    ){}
}