
class DefaultKeywordMentions {
    
}

class DefaultMentions {
    card(nameOrId: string|number, quantity: number) : string
}

declare namespace prettycards {
    declare const defaultMentions: DefaultMentions;
}

export function getArrayLength(arr: any[]): number;
export const maxInterval: 12;