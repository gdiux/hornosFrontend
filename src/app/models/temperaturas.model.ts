import { Termometro } from "./termometros.model";

export class Temperatura{
    constructor(
        public temperatura: string,
        public termometro: Termometro,
        public status: boolean,
        public fecha: Date,
        public estado: string,
        public teid?: string,
        public _id?: string,
    ){}
}