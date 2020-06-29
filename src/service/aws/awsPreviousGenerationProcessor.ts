import axios from 'axios';
import * as cheerio from 'cheerio';
import {DataFilePath} from '../../models/types';
import {Processor} from '../processor';
import {Crawler} from "../../utils/crawler";

export class AwsPreviousGenerationProcessor extends Processor {
    constructor() {
        super(DataFilePath.awsPreviousGenerationInstances);
    }

    public async collect(): Promise<void> {
        try {
            const previousGeneration = [];
            let response = await axios.get('https://aws.amazon.com/ec2/previous-generation/');
            let $ = cheerio.load(response.data);
            $('#element-b1df7cf0-50a0-4630-a701-ad9a7c7c46ed')
                .each((i, elem) => {
                    const tableScrapper = new Crawler($, elem);
                    previousGeneration.push(...tableScrapper.parseTable());
                });

            this.save(previousGeneration);
        } catch (e) {
            console.error(e);
        }
    }
}
