import { readFileSync, writeFileSync } from 'fs';

export abstract class Processor {
    protected constructor(private readonly filePath: string) {}

    public abstract async collect(): Promise<void>;

    public read(): any[] {
        return JSON.parse(readFileSync(this.filePath).toString());
    }

    public save(dataSet: any[]): void {
        writeFileSync(this.filePath, JSON.stringify(dataSet, null, 4));
    }
}
