import {Category, PermissionGuard} from "@discordx/utilities"
import {CommandInteraction, EmbedBuilder, EmbedField, Message} from "discord.js"
import {Client, Guard} from "discordx"


import {Discord, Slash, SlashOption} from "@decorators"

import {Keyword} from "@services"
import {injectable} from "tsyringe";
import {Role} from "@guards";
import {ApplicationCommandOptionType, User} from "discord.js";
import {getColor} from "@utils/functions";
import {generalConfig} from "@configs";
import packageJson from "../../../package.json";


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

        try {

            const keywords: string | undefined = await this.keyword.getKeywordFromListing(url);
            const formattedKeywords: string = keywords ? formatKeywords(keywords) : '';

            function formatKeywords(keywords: string): string {
                // @ts-ignore
                return keywords.join('\n');
            }


        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle("Keywords")
            .setThumbnail(client.user!.displayAvatarURL())
            .setColor(getColor('primary'))
            .setDescription(formattedKeywords || 'Unable to fetch keywords')

        if (keywords) {
            await interaction.followUp({
                embeds: [embed],
                ephemeral: true
            })


            //await msg.reply({ content: JSON.stringify(content) });
        } else {
           await interaction.reply({ content: "Unable to fetch keywords.", ephemeral: true });
        }
        } catch (e) {
            console.log(e)
        }
    }

}