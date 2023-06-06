import {Category, PermissionGuard} from "@discordx/utilities"
import {CommandInteraction, EmbedBuilder, Message} from "discord.js"
import {Client, Guard} from "discordx"


import {Discord, Slash, SlashOption} from "@decorators"

import { Keyword } from "@services"
import {injectable} from "tsyringe";
import {Role} from "@guards";
import {ApplicationCommandOptionType, User} from "discord.js";
import {getColor} from "@utils/functions";
import {generalConfig} from "@configs";


@Discord()
@injectable()
@Category('General')
export default class KeyCommand {

    constructor(
        private keyword: Keyword
    ) {}

    @Slash({
        name: 'keyword'
    })
    @Guard(
       Role
    )
    async keyHandler(
        @SlashOption({ name: 'url', type: ApplicationCommandOptionType.String, required: true }) url: string,
        interaction: CommandInteraction,
        client: Client,
        { localize }: InteractionData
    ) {

        const msg = (await interaction.followUp({ content: "Fetching keywords...", fetchReply: true })) as Message

        // @ts-ignore
        const keywords : string = await this.keyword.getKeywordFromListing(url)


        const content = localize["COMMANDS"]["KEYWORD"]["MESSAGE"]({
            keyword: keywords
        })

        await msg.edit(content)
    }


    getEmbed(author: User, link: string): EmbedBuilder {

        return new EmbedBuilder()
            .setAuthor({
                name: author.username,
                iconURL: author.displayAvatarURL({ forceStatic: false })
            })
            .setColor(getColor('primary'))
            .setImage(link)
    }

}