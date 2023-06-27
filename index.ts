import Koa, {Context, Middleware, Next} from 'koa';
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser';
import {ChatModelFactory, Site} from "./model";
import dotenv from 'dotenv';
import {ChatRequest, ChatResponse, ModelType, PromptToString} from "./model/base";
import {Event, EventStream} from "./utils";

process.setMaxListeners(30);  // 将限制提高到20个

dotenv.config();

const app = new Koa();
const router = new Router();
const errorHandler = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err: any) {
        console.error(err);
        ctx.body = JSON.stringify(err);
        ctx.res.end();
    }
};
app.use(errorHandler);
app.use(bodyParser({jsonLimit: '10mb'}));
const chatModel = new ChatModelFactory();

interface AskReq extends ChatRequest {
    site: Site;
}

interface AskRes extends ChatResponse {
}

const AskHandle: Middleware = async (ctx) => {
    const {prompt, model = ModelType.GPT3p5Turbo, site = Site.You} = {...ctx.query as any, ...ctx.request.body as any} as AskReq;
    if (!prompt) {
        ctx.body = {error: `need prompt in query`} as AskRes;
        return;
    }
    const chat = chatModel.get(site);
    if (!chat) {
        ctx.body = {error: `not support site: ${site} `} as AskRes;
        return;
    }
    const tokenLimit = chat.support(model);
    if (!tokenLimit) {
        ctx.body = {error: `${site} not support model ${model}`} as AskRes;
        return;
    }
    ctx.body = await chat.ask({prompt: PromptToString(prompt, tokenLimit), model});
}

const AskStreamHandle: Middleware = async (ctx) => {
    const {prompt, model = ModelType.GPT3p5Turbo, site = Site.You} = {...ctx.query as any, ...ctx.request.body as any} as AskReq;
    ctx.set({
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    const es = new EventStream();
    ctx.body = es.stream();
    if (!prompt) {
        es.write(Event.error, {error: 'need prompt in query'})
        es.end();
        return;
    }
    const chat = chatModel.get(site);
    if (!chat) {
        es.write(Event.error, {error: `not support site: ${site} `})
        es.end();
        return;
    }
    const tokenLimit = chat.support(model);
    if (!tokenLimit) {
        es.write(Event.error, {error: `${site} not support model ${model}`})
        es.end();
        return;
    }
    await chat.askStream({prompt: PromptToString(prompt, tokenLimit), model}, es);
    ctx.body = es.stream();
}

router.get('/ask', AskHandle);
router.post('/ask', AskHandle);
router.get('/ask/stream', AskStreamHandle)
router.post('/ask/stream', AskStreamHandle)

app.use(router.routes());

(async () => {
    const server = app.listen(3000, () => {
        console.log("Now listening: 127.0.0.1:3000");
    });
    process.on('SIGINT', () => {
        server.close(() => {
            process.exit(0);
        });
    });
    process.on('uncaughtException', (e) => {
        console.error(e);
    })
})()

