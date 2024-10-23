import { Router as ExpressRouter } from "express";
const router = ExpressRouter();

import layouts from "express-ejs-layouts";
router.use(layouts);

import { csp, root } from "../config.js"
import ejsData from "../middleware/data.js";
import rateLimit from "express-rate-limit";

import * as changeCase from "change-case";

import { join } from "path";

const pagesDir = join(root, "articles");

import fs from "fs/promises";

import { marked } from "marked";

marked.use({
    async: true,
    pedantic: false,
    gfm: true,
});

router.use(rateLimit({
    windowMs: 1000 * 60,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
        res.data.error = "429 Too Many Requests"
        res.render("error", {
            data: res.data
        });
    }
}));
router.use(ejsData);

router.use((_, res, next) => {

    /*
     * Future Directives:
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
     */

    res.set({
		"Content-Security-Policy": csp,
        "X-XSS-Protection": "0",
		"X-Content-Type-Options": "nosniff",
		"Content-Type": "text/html; charset=utf-8",
		"Cache-Control": "no-cache",
        "Referrer-Policy": "no-referrer",
        "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
	});

	res.removeHeader("X-Frame-Options");
    
    next();
});

router.get("/", async (_, res) => {

    try {
        const dir = await fs.readdir(pagesDir);
        res.data.articles = [];
        dir.forEach((val) => {
            let valToAdd = changeCase.capitalCase(val);
            let hrefCC = changeCase.snakeCase(val);
            res.data.articles.push(`<a href="/article/${hrefCC.substring(0, hrefCC.length - 3)}">${valToAdd.substring(0, valToAdd.length - 3)}</a>`);
        });
        res.render("index");
    } catch(error) {
        router.use((_, res) => {
            res.data.error = 500;
            res.status(500).render("error");
        });
    } 

});

router.get("/contact", (_, res) => res.render("contact"));

router.get("/article/:id", async (req, res) => {
    const art = changeCase.snakeCase(req.params.id);
    
    try {
        const accessed = await fs.access(join(pagesDir, art + ".md"));
        const data = "" + Buffer.from(await fs.readFile(join(pagesDir, art + ".md")));
        const toRet = await marked.parse(data);
        
        res.data.content = toRet; //DOMPurify.sanitize(toRet, { USE_PROFILES: { html: true }});
        res.data.title = changeCase.sentenceCase(art);
        res.render("article");
    } catch (error) {
        console.log(error);
        res.data.error = 404;
        res.status(404).render("error");
    }

});

export default router;