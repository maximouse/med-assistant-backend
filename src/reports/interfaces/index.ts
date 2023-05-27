export interface ICandidate{
    reference: string,
    protocol: string,
    match: string,
    score: number,
    keywords?: Array<string>
}
export interface IReport {
    fileId: string,
    fileName: string,
    status: string,
    protocols: Array<any>,
    filters: Object
}
export interface IResponse  {
    fileId: string;
    filters: {
        diagnosis: Array<string> | null;
        doctors: Array<string> | null;
        dates: Array<string> | null;
        codes: Array<string> | null;
    };
}