export class HttpError extends Error {
    constructor(
        public status: number, 
        public message: string, 
        public details: any[] = []
    ) {
        super(message);
    }
}