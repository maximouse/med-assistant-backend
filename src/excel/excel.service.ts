import { Injectable } from '@nestjs/common';
const Excel = require('exceljs')

@Injectable()
export class ExcelService {
  private readonly workbook = new Excel.Workbook();
  private worksheet;
  // getWorksheet(){
  //   if(this.worksheet) return this.worksheet;
  // }
  getVal(letter: string, rowNumber: number){
    return this.worksheet.getCell(`${letter}${rowNumber}`).value;
  }
  async getWorkSheet(filePath){
    let book = await this.workbook.xlsx.readFile(filePath);
    this.worksheet = await book.getWorksheet()
    return this.worksheet
  }
}
