import axios from 'axios';
import * as cheerio from 'cheerio';
import {DataFilePath, IAwsTier, IAwsTierSets} from '../../models/types';
import {Processor} from '../processor';
import {Crawler} from "../../utils/crawler";

export class AwsAvailableInstanceProcessor extends Processor {
    constructor() {
        super(DataFilePath.awsAvailableInstances);
    }

    public async collect(): Promise<void> {
        try {
            const tierSets: IAwsTierSets[] = [];

            let response = await axios.get('https://aws.amazon.com/ec2/instance-types/');
            let $ = cheerio.load(response.data);
            $('main > .lb-grid > .lb-row.lb-row-max-large.lb-snap > .lb-col.lb-tiny-24.lb-mid-24')
                .each((i, elem) =>
                    tierSets.push(this.createModel($, elem))
                );

            // save data
            this.save(tierSets.filter(tierSet => tierSet.purpose !== '' && tierSet.families.length > 0));

        } catch (e) {
            console.error(e);
        }
    }

    public createModel($: any, elem: any): IAwsTierSets {
        const scrapper: Crawler = new Crawler($, elem);
        const purpose = scrapper.findText('.lb-h2.lb-title');
        const families: string[] = [];
        const tiers: IAwsTier[] = [];

        scrapper.findSelections('.lb-tabs-content')
            .each((i, ulElem) => {
                const ulScrapper = new Crawler($, ulElem);

                ulScrapper.findSelections('li.lb-tabs-accordion-trigger')
                    .each((j, liElem) => {
                        const liScrapper = new Crawler($, liElem);
                        families.push(liScrapper.findText('.lb-txt-none.lb-txt'))
                    });

                ulScrapper.findSelections('li.lb-tabs-content-item.lb-comp-content-container')
                    .each((j, liElem) => {
                        const liScrapper = new Crawler($, liElem);
                        tiers.push(...liScrapper.parseTable());
                    });
            });

        return {
            purpose,
            families,
            tiers
        };
    }
}
