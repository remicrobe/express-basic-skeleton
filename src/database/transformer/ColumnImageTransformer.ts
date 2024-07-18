/// ColumnNumericTransformer
export class ColumnImageTransformer {
    to(data: any): any {
        return data;
    }
    from(data: string): string {
        if(!data) {
            return
        }
        return process.env.IMAGE_URL + data;
    }
}