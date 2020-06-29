import axios from 'axios';
import * as cheerio from 'cheerio';
import {DataFilePath} from '../../models/types';
import {Processor} from '../processor';
import {Crawler} from "../../utils/crawler";

export class AwsUserGuideProcessor extends Processor {
    constructor() {
        super(DataFilePath.awsUserGuideInstances);
    }

    public async collect(): Promise<void> {
        try {
            let response: any = await axios.get('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html');
            let $ = cheerio.load(response.data);

            const availableInstanceTypes = [];
            $('#main-col-body > div:nth-child(12)')
                .each((i, elem) => {
                    const tableScrapper = new Crawler($, elem);
                    availableInstanceTypes.push(...tableScrapper.parseTable());
                });

            const previousGenerationTypes = [];
            $('#main-col-body > div:nth-child(15)')
                .each((i, elem) => {
                    const tableScrapper = new Crawler($, elem);
                    previousGenerationTypes.push(...tableScrapper.parseTable());
                });

            this.save([...availableInstanceTypes, ...previousGenerationTypes]);

        } catch (e) {
            console.error(e);
        }
    }
}
