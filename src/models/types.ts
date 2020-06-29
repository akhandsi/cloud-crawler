export enum DataFilePath {
    awsAvailableInstances = 'src/data/awsAvailableInstances.json',
    awsPreviousGenerationInstances = 'src/data/awsPreviousGenerationInstances.json',
    awsUserGuideInstances = 'src/data/awsUserGuideInstances.json',
    azureAvailableInstances = 'src/data/azureAvailableInstances.json',
    azurePreviousGenerationInstances = 'src/data/azurePreviousGenerationInstances.json',
}

export interface IMessage {
    message: string;
}

export interface IAwsTierSets {
    purpose: string;
    families: string[];
    tiers: IAwsTier[];
}

export interface IAwsTier {
    [key: string]: string;
}
