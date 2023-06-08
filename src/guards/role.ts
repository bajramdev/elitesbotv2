import {ChatInputCommandInteraction, CommandInteraction} from "discord.js"
import { GuardFunction, SimpleCommandMessage } from "discordx"

import { getLocaleFromInteraction, L } from "@i18n"
import { replyToInteraction } from "@utils/functions"

/**
 * Prevent the command from running on DM
 */
export const Role: GuardFunction<
    | ChatInputCommandInteraction<"cached">
    | SimpleCommandMessage
> = async (arg, client, next) => {

    const hasRoleElite = arg instanceof ChatInputCommandInteraction ? arg.member.roles.cache.has("1110994762695196892"): null

    if(hasRoleElite) return next()
    else {
        throw new Error('Missing required role.'); // Throw an error instead of replying to the interaction.
    }
}
