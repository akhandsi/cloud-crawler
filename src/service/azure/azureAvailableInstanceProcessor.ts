import axios from 'axios';
import * as cheerio from 'cheerio';
import {DataFilePath} from '../../models/types';
import {Processor} from '../processor';
import {Crawler} from "../../utils/crawler";

export class AzureAvailableInstanceProcessor extends Processor {
    constructor() {
        super(DataFilePath.azureAvailableInstances);
    }

    public async collect(): Promise<void> {
        try {
            let response: any = await axios.get('https://docs.microsoft.com/en-us/azure/cloud-services/cloud-services-sizes-specs');
            let $ = cheerio.load(response.data);

            const headings = new Set<string>();
            $('#main > h2')
                .each((i, elem) => {
                    let idx = 0;
                    let tableElement = elem;
                    while(idx < 7 && tableElement) {
                        if (tableElement.name === 'table') {
                            // @ts-ignore
                            headings.add(elem.children[0].data);
                        }
                        tableElement = tableElement.nextSibling;
                        idx++;
                    }
                });

            const familyTypeList = Array.from(headings);
            const instances = [];
            $('#main > table')
                .each((i, elem) => {
                    if (i > 0) {
                        const tableScrapper = new Crawler($, elem);
                        // @ts-ignore
                        instances.push({
                            type: familyTypeList[i-1],
                            instance: tableScrapper.parseTable()
                        });
                    }
                });
            this.save([...instances]);

        } catch (e) {
            console.error(e);
        }
    }
}
