This is a replication project for the typescript version of [gpt4free](https://github.com/xtekky/gpt4free)

## Demo [GPTGOD](http://gptgod.site)

In the next two weeks, I will open source all the code for GPTGOD. If you need, Please watch this project or follow me
to receive notifications.

Why now? because there are stil some secret config should be removed from that project.

## Reverse target

Still striving to keep updating.

Have implemented models here:
If you do not want your website to appear here, please raise an issue and I will remove it immediately.
|model|support|status|active time|
|--|--|--|--|
|[forefront.ai](forefront.ai)|GPT-4/gpt3.5|![Active](https://img.shields.io/badge/Active-brightgreen)|after 2023-05-12|
|[aidream](http://aidream.cloud)|GPT-3.5|![Active](https://img.shields.io/badge/Active-brightgreen)|after 2023-05-12|
|[you.com](you.com)|GPT-3.5|![Active](https://img.shields.io/badge/Active-brightgreen)|after 2023-05-12
|[phind.com](https://www.phind.com/)|GPT-4 / Internet / good search|![Active](https://img.shields.io/badge/Active-grey)|
|[bing.com/chat](bing.com/chat)|GPT-4/3.5||
|[poe.com](poe.com)| GPT-4/3.5||
|[writesonic.com](writesonic.com)| GPT-3.5 / Internet||
|[t3nsor.com](t3nsor.com)|GPT-3.5||

## Run local

```shell
# install module
yarn
# start server
yarn start
```

## Run with docker

first, you should create file .env

```env
http_proxy=http://host:port
# you should config this if you use forefront api, this apikey is used for receive register email
# get api key here https://rapidapi.com/calvinloveland335703-0p6BxLYIH8f/api/temp-mail44
rapid_api_key=xxxxxxxxxx
DEBUG=0 # default:0 when you set 1 make sure run with chromium ui
```

```
docker run --env-file .env xiangsx/gpt4free-ts:latest
```

## Deploy with docker-compose

first, you should create file .env; Follow step "Run with docker

deploy

```
docker-compose up --build -d
```

## Test with curl

### params in query

```
prompt: string; // required
```

aidread options

```typescript
interface options {
    parentMessageId: string // if you need context try this
    systemMessage: string // default: You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.
    temperature: number; // default: 1
    top_p: number // default:1
    parse: boolean; //  default:true only valid in stream;if set false,return source data contains parentMessageId...
}
```

forefront options

```
chatId?: string;
actionType?: Action; // 'new' or 'continue'
defaultPersona?: string;
gptmodel?: Model; // gpt-4 or gpt-3.5-turbo
resignup?: number; // default 0 if set 1, auto sign up when gpt4 times use up
// event: error
// data: GPT-4 rate limit exceeded (>5 messages every 3 hours). Time remaining: 179 minutes
// if you see this try set resignup=1 or use gpt-3.5-turbo

// if you want chat with context, set actionType=continue and chatId={Defined constant uuid}
```

### test now!

common request

```shell
# test default model aidream
curl "http://127.0.0.1:3000/ask?prompt=hello&model=aidream"

# test default model chat.forefront.at
# !!!!ATTENTION!!!! It Unstable when the first time use, but support GPT4
# !!!!ATTENTION!!!! You may got timeout when you run this project ant req forefront the first time.
# !!!!ATTENTION!!!! It will run quickly in your next time;
curl "http://127.0.0.1:3000/ask?prompt=hello&model=forefront&gptmodel=gpt-4&resignup=1"

# test you.com
curl "http://127.0.0.1:3000/ask?prompt=hello&model=you"
```

request event-stream

```shell
# test default model aidream
curl "http://127.0.0.1:3000/ask/stream?prompt=hello&model=aidream"

# test chat.forefront.at
# !!!!ATTENTION!!!! It Unstable when the first time use, but support GPT4
# !!!!ATTENTION!!!! You may got timeout when you run this project ant req forefront the first time.
# !!!!ATTENTION!!!! It will run quickly in your next time;
curl "http://127.0.0.1:3000/ask/stream?prompt=hello&model=forefront&gptmodel=gpt-4&resignup=1"

# test you
curl "http://127.0.0.1:3000/ask/stream?prompt=hello&model=you"
```

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=xiangsx/gpt4free-ts&type=Date)](https://star-history.com/#xiangsx/gpt4free-ts&&type=Date)

<p>You may join our discord: <a href="https://discord.com/invite/gpt4free">discord.gg/gpt4free<a> for further updates. <a href="https://discord.gg/gpt4free"><img align="center" alt="gpt4free Discord" width="22px" src="https://raw.githubusercontent.com/peterthehan/peterthehan/master/assets/discord.svg" /></a></p>


<img alt="gpt4free logo" src="https://user-images.githubusercontent.com/98614666/233799515-1a7cb6a3-b17f-42c4-956d-8d2a0664466f.png">

## Legal Notice <a name="legal-notice"></a>

This repository is _not_ associated with or endorsed by providers of the APIs contained in this GitHub repository. This
project is intended **for educational purposes only**. This is just a little personal project. Sites may contact me to
improve their security or request the removal of their site from this repository.

Please note the following:

1. **Disclaimer**: The APIs, services, and trademarks mentioned in this repository belong to their respective owners.
   This project is _not_ claiming any right over them nor is it affiliated with or endorsed by any of the providers
   mentioned.

2. **Responsibility**: The author of this repository is _not_ responsible for any consequences, damages, or losses
   arising from the use or misuse of this repository or the content provided by the third-party APIs. Users are solely
   responsible for their actions and any repercussions that may follow. We strongly recommend the users to follow the
   TOS of the each Website.

3. **Educational Purposes Only**: This repository and its content are provided strictly for educational purposes. By
   using the information and code provided, users acknowledge that they are using the APIs and models at their own risk
   and agree to comply with any applicable laws and regulations.

4. **Copyright**: All content in this repository, including but not limited to code, images, and documentation, is the
   intellectual property of the repository author, unless otherwise stated. Unauthorized copying, distribution, or use
   of any content in this repository is strictly prohibited without the express written consent of the repository
   author.

5. **Indemnification**: Users agree to indemnify, defend, and hold harmless the author of this repository from and
   against any and all claims, liabilities, damages, losses, or expenses, including legal fees and costs, arising out of
   or in any way connected with their use or misuse of this repository, its content, or related third-party APIs.

6. **Updates and Changes**: The author reserves the right to modify, update, or remove any content, information, or
   features in this repository at any time without prior notice. Users are responsible for regularly reviewing the
   content and any changes made to this repository.

By using this repository or any code related to it, you agree to these terms. The author is not responsible for any
copies, forks, or reuploads made by other users. This is the author's only account and repository. To prevent
impersonation or irresponsible actions, you may comply with the GNU GPL license this Repository uses.
