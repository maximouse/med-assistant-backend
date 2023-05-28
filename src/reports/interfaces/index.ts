

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
    filters: any
}
