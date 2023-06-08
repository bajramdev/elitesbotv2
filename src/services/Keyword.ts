import axios from "axios";
import cheerio from "cheerio";
import {singleton} from "tsyringe";

import {Logger} from "@services"

@singleton()
export class Keyword {

    constructor(
        private logger: Logger
    ) {
    }

    isValidEtsyListing = (url: string): boolean => {
        try {
            const etsyListingRegex = /^https?:\/\/(?:www\.)?etsy\.com\/[a-z]{2}-[a-z]{2}\/listing\/\d+\/.+/i;
            return etsyListingRegex.test(url);
        } catch {
            return false;
        }
    };


    getKeywordFromListing = async (url: string): Promise<string | undefined> => {
       // if (this.isValidEtsyListing(url)) {
            try {

                console.log(url)

                const response = await axios.get(url, {
                    headers: {
                        "accept":
                            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                    },
                });

                const html = response.data;
                const $ = cheerio.load(html);

                const element = $(
                    ".ui-toolkit.transitional-wide.is-responsive.no-touch.en-US.SEK.SE > #content > .content-wrap.listing-page-content > .wt-pt-xs-5.listing-page-content-container-wider.wt-horizontal-center > #listing-right-column > div > .other-info > #recs_ribbon_container > .wt-position-relative > div[data-listing-page-lazy-loaded-bottom-section] > div > div"
                );

                const htmlContent = element.html();

                if (htmlContent) {
                    const regex = /<script\s+type="text\/json"\s+data-neu-spec-placeholder-data="1">(.*?)<\/script>/s;
                    const match = regex.exec(htmlContent);
                    if (match) {
                        const jsonData = JSON.parse(match[1]);
                        return jsonData.args.listing_tags;
                    } else {
                        this.logger.log(
                            `JSON Data not found `,
                            'error',
                            true
                        )
                    }
                } else {
                    this.logger.log(
                        `HTML Content not found  ${htmlContent} to URL: ${url} `,
                        'error',
                        true
                    )

                }
            } catch (error: any) {
                this.logger.log(error?.toString(), 'error', true)
            }
      //  }

        return undefined;

    };
}
