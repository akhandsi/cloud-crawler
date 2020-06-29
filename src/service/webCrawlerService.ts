import {AwsAvailableInstanceProcessor} from "./aws/awsAvailableInstanceProcessor";
import {AwsPreviousGenerationProcessor} from "./aws/awsPreviousGenerationProcessor";
import {AwsUserGuideProcessor} from "./aws/awsUserGuideProcessor";
import {AzureAvailableInstanceProcessor} from "./azure/azureAvailableInstanceProcessor";
import {AzurePreviousGenerationProcessor} from "./azure/azurePreviousGenerationProcessor";

export class WebCrawlerService {

    public static async collect(): Promise<void> {
        try {
            await WebCrawlerService.collectAwsTiers();
            await WebCrawlerService.collectAzureTiers();
        } catch (e) {
            console.error(e);
        }
    }

    private static async collectAwsTiers(): Promise<void> {
        try {
            await new AwsUserGuideProcessor().collect();
            await new AwsAvailableInstanceProcessor().collect();
            await new AwsPreviousGenerationProcessor().collect();
        } catch (e) {
            console.error(e);
        }
    }

    private static async collectAzureTiers(): Promise<void> {
        try {
            await new AzureAvailableInstanceProcessor().collect();
            await new AzurePreviousGenerationProcessor().collect();
        } catch (e) {
            console.error(e);
        }
    }

}
