import {WebCrawlerService} from "./service/webCrawlerService";

class Runner {
    public static run(){
        console.log('running')
        WebCrawlerService.collect()
            .catch(e => console.error(e));
    }
}

Runner.run();
