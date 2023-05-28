import { ApiProperty } from "@nestjs/swagger";

export class IAuthResponse {
    @ApiProperty({example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlhQHlhLnJ1IiwiaWF0IjoxNjg1MjUwMTQ1LCJleHAiOjE2ODUzMzY1NDV9.NMNfqZd0UESuQD1N5o2akbvYULy95MqfPfPQ7sYdDlI"})
    token: string;
}