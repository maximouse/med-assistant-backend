import { Prop } from "@nestjs/mongoose";
import { ApiParam, ApiProperty, ApiRequestTimeoutResponse, ApiResponse } from "@nestjs/swagger";

export class IAllReportsResponse  {

    @ApiProperty({example: "880f371df5c93c0301e21ad66666b031"})
    fileId: string;

    @ApiProperty({example: "Dataset.xlsx"})
    fileName: string;

    @ApiProperty({example: "processing"})
    status: string;

    @ApiProperty({example: { 
        doctors: [ "врач-оториноларинголог"],
        diagnosis:  [ "J30.2","H65.9", "I25.1"],
        dates: [ 	"18.04.2023", "14.04.2023", "10.04.2023"]
    }})
    filters: {
        diagnosis: Array<string> | null;
        doctors: Array<string> | null;
        codes: Array<string> | null;
    }
}



export class ISubReport {

    @ApiProperty({example: "47"})
    patient: string;

    @ApiProperty({example: "Врач-кардиолог"})
    doctor: string;

    @ApiProperty({example: "J30.2"})
    code: string;

    @ApiProperty({example: { 
        reference: "Клинический анализ крови",
        protocol:  "Клинический анализ крови",
        match: "match",
        score: 1,
        references: ["Клинический анализ крови"],
        appointments: [
            "Рентгенография околоносовых пазух",
            "Клинический анализ крови"
        ],
        total: 0.5
    }})
    report: {
        reference: string;
        protocol: string;
        match: string;
        score: number;
        references: Array<string>;
        appointments: Array<string>;
        total: number;
    }
}

export class IReportResponse {
    reports: Array<ISubReport>

    @ApiProperty({example: 100})
    total: number

    doctorsStat: any
}

export class IUploadProtocolResponse {
    @ApiProperty({example: "880f371df5c93c0301e21ad66666b031"})
    fileId: string;

    @ApiProperty({example: "processing"})
    status: string;
}