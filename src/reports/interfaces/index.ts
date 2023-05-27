export interface ICandidate{
    reference: string,
    protocol: string,
    match: string,
    score: number,
    keywords?: Array<string>
}