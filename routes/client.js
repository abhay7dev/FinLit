import { Router as ExpressRouter } from "express";
const router = ExpressRouter();

import layouts from "express-ejs-layouts";
router.use(layouts);

import { csp } from "../config.js"
import ejsData from "../middleware/data.js";
import rateLimit from "express-rate-limit";

router.use(rateLimit({
    windowMs: 1000 * 60,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
        res.data.error = errors[429]
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

router.get("/", (_, res) => res.render("index"));

export default router;