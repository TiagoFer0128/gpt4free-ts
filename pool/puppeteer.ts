import puppeteer, {Browser, Page, PuppeteerLaunchOptions} from "puppeteer";
import path from "path";
import run from "node:test";

const runPath = path.join(__dirname, 'run');

export interface PageInfo<T> {
    id: string;
    ready: boolean;
    page?: Page;
    data?: T;
}

type PrepareFunc<T> = (id: string, browser: Browser) => Promise<[Page, T]>

export class BrowserPool<T> {
    private readonly pool: PageInfo<T>[] = [];
    private readonly size: number;
    private readonly prepare: PrepareFunc<T>

    constructor(size: number, initialIDs: string[], prepare: PrepareFunc<T>) {
        this.size = size
        this.prepare = prepare;
        this.init(initialIDs);
    }

    init(initialIDs: string[]) {
        for (let i = 0; i < this.size; i++) {
            const id = initialIDs[i];
            const info: PageInfo<T> = {
                id,
                ready: false,
            }
            this.initOne(id).then(([page, data]) => {
                info.page = page;
                info.data = data;
                info.ready = true;
            }).catch(e => {
                console.error(e);
            })
            this.pool.push(info)
        }
    }

    async initOne(id: string): Promise<[Page, T]> {
        const options: PuppeteerLaunchOptions = {
            headless: process.env.DEBUG === "1" ? false : 'new',
            args: ['--no-sandbox'],
        };
        if (id) {
            options.userDataDir = `run/${id}`;
        }
        const browser = await puppeteer.launch(options);
        return this.prepare(id, browser)
    }

    //@ts-ignore
    get(): [page: Page | undefined, data: T | undefined, done: (data: T) => void, destroy: (newID: string) => void] {
        for (const item of this.pool) {
            if (item.ready) {
                item.ready = false;
                return [
                    item.page,
                    item.data,
                    (data: T) => {
                        item.ready = true
                        item.data = data;
                    },
                    (newID: string) => {
                        item.page?.close();
                        this.initOne(newID).then(([page, data]) => {
                            item.page = page
                            item.data = data;
                            item.ready = true;
                        })
                    }
                ]
            }
        }
        return [] as any;
    }
}
