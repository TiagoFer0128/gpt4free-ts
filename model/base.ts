import {EventStream, getTokenSize} from "../utils";

export interface ChatOptions {
}

export interface ChatResponse {
    content?: string;
    error?: string;
}

export type Message = {
    role: string;
    content: string;
}

export enum ModelType {
    GPT3p5 = 'gpt3.5',
    GPT4 = 'gpt4',
}

export interface ChatRequest {
    prompt: string;
    model: ModelType;
}

export function PromptToString(prompt: string | Message[], limit: number): string {
    if (typeof prompt === "string") {
        return prompt;
    }
    let result: Message[] = [];

    let tokenSize = 0;
    for (let i = prompt.length - 1; i >= 0; i--) {
        const item = prompt[i];
        const {role, content} = item;
        tokenSize += getTokenSize(content);
        if (tokenSize > limit) {
            break;
        }
        result.push(item);
    }
    return result.reverse().map(item => `${item.role}: ${item.content}`).join('\n');
}

export abstract class Chat {
    protected options: ChatOptions | undefined;

    protected constructor(options?: ChatOptions) {
        this.options = options;
    }

    public abstract support(model: ModelType): number

    public abstract ask(req: ChatRequest): Promise<ChatResponse>

    public abstract askStream(req: ChatRequest, stream: EventStream): Promise<void>
}
