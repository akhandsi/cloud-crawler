import axios from 'axios';
import * as cheerio from 'cheerio';
import {DataFilePath} from '../../models/types';
import {Processor} from '../processor';
import {Crawler} from "../../utils/crawler";

export class AzurePreviousGenerationProcessor extends Processor {
    constructor() {
        super(DataFilePath.azurePreviousGenerationInstances);
    }

    public async collect(): Promise<void> {
        try {
            let response: any = await axios.get('https://docs.microsoft.com/en-us/azure/virtual-machines/sizes-previous-gen');
            let $ = cheerio.load(response.data);

            const headings = new Set<string>();
            $('#main > h2,h3')
                .each((i, elem) => {
                    let idx = 0;
                    let tableElement = elem;
                    while(idx < 20 && tableElement) {
                        if (tableElement.name === 'table') {
                            // @ts-ignore
                            headings.add(elem.children[0].data);
                        }
                        tableElement = tableElement.nextSibling;
                        idx++;
                    }
                });
            const familyTypeList = Array.from(headings).filter(heading => {
                return heading !== 'Older generations of virtual machine sizes' &&
                    heading !== 'Standard A0 - A4 using CLI and PowerShell';
            });
            const instances = [];
            $('#main > table')
                .each((i, elem) => {
                    const tableScrapper = new Crawler($, elem);
                    // @ts-ignore
                    instances.push({
                        type: familyTypeList[i],
                        instance: tableScrapper.parseTable()
                    });
                });
            this.save([...instances]);

        } catch (e) {
            console.error(e);
        }
    }
}
