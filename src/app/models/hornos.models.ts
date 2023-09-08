import { Temperatura } from "./temperaturas.model";
import { Termometro } from "./termometros.model";

export class Horno{
    constructor(
        public name: string,
        public alta: Termometro,
        public baja: Termometro,
        public status: boolean,
        public fecha: Date,
        public hid?: string,
        public _id?: string,
        public tempA?: Temperatura,
        public tempB?: Temperatura,
    ){}
}