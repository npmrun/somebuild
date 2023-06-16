import path from "node:path";
import { promises as fs } from "node:fs";
import { Plugin } from "vite";

const readHtmlTemplate = async (templatePath) => {
    return await fs.readFile(templatePath, { encoding: 'utf8' })
};

const getHtmlContent = async (payload) => {
    const { templatePath, pageEntry } = payload
    let content = ''

    try {
        content = await readHtmlTemplate(templatePath);
    }
    catch (e) {
        console.error(e)
    }

    if (pageEntry) {
        content = content.replace(
            '</body>',
            `  <script type="module" src="${pageEntry}"></script>\n</body>`
        )
    }
    return content
}

const virtualHtmlTemplatePlugin = (options): Plugin => {
    let resolve
    let relative
    return {
        name: 'vite-plugin-virtual-html-template',
        enforce: "pre",
        configResolved(config) {
            if (config.root) {
                resolve = (p) => path.resolve(config.root, p)
                relative = (p) => path.relative(config.root, p)
            } else {
                resolve = (p) => path.resolve(process.cwd(), p)
                relative = (p) => path.relative(process.cwd(), p)
            }
        },
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                // @ts-ignore
                const url = req._parsedUrl.pathname;
                let pageName;

                if (url === '/') {
                    pageName = 'index';
                }
                else {
                    pageName = path.posix.join(path.dirname(url), path.basename(url, '.html')).slice(1);
                }

                const page = options?.pages?.[pageName];

                if (!page) {
                    return next();
                }

                const templateOption = page.template;
                const templatePath = templateOption ? resolve(templateOption) : resolve('public/index.html');

                const content = await getHtmlContent({
                    templatePath,
                    pageEntry: page.entry
                });

                res.end(content)
            })
        },

        resolveId(id) {
            if (path.extname(id) === '.html') {
                const relativeId = relative(id);
                const pageName = path.posix.join(path.dirname(relativeId), path.basename(relativeId, '.html'));

                const page = options?.pages?.[pageName];
                if (page) {
                    return id;
                }
            }

            return null;
        },

        load(id) {
            if (path.extname(id) === '.html') {
                const relativeId = relative(id);
                const pageName = path.posix.join(path.dirname(relativeId), path.basename(relativeId, '.html'));

                const page = options?.pages?.[pageName];
                if (page) {
                    const templateOption = page.template;
                    const templatePath = templateOption ? resolve(templateOption) : resolve('public/index.html');

                    return getHtmlContent({
                        templatePath,
                        pageEntry: page.entry
                    });
                }
            }

            return null;
        }
    }
}

export default virtualHtmlTemplatePlugin;