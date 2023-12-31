import { environment } from "../../environments/environment"

const base_url = environment.base_url;

export class User {

    constructor (
        public usuario: string,
        public name: string,
        public role: 'ADMIN' | 'STAFF',
        public password?: string,
        public img?: string,
        public status?: boolean,
        public fecha?: Date,
        public uid?: string,
        public _id?: string,
    ){}

    /** ================================================================
    *   GET IMAGE
    ==================================================================== */    
    get getImage(){        
        
        if (this.img) {            
            return `${base_url}/uploads/user/${this.img}`;
        }else{
            return `${base_url}/uploads/user/no-image`;
        }
    }
    
}