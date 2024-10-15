import { static as expressStatic, Router as ExpressRouter } from "express";
const router = ExpressRouter();

import { root } from "../config.js";
import { join as pathJoin } from "path";

import minify from "express-minify";
router.use(minify());

router.use((req, res, next) => {

	if (req.path.indexOf("sw.js") !== -1) {
		res.set("Service-Worker-Allowed", "../");
	} else if(req.path.indexOf(".webmanifest") !== -1) {
		res.set("Content-Type", `application/manifest+json; charset=utf-8`);
	} else if(req.path.indexOf(".xml") !== -1) {
		res.set("Content-Type", `text/xml; charset=utf-8`);
	} else if(req.path.indexOf(".svg") !== -1) {
		res.set("Content-Type", `image/svg+xml; charset=utf-8`);
	}
	
	res.set("Cache-Control", "max-age=31536000, immutable");

	res.removeHeader("X-Powered-By");
	res.removeHeader("X-Frame-Options");
	res.removeHeader("Content-Security-Policy");
	
	next();
});

router.use(expressStatic(pathJoin(root, "public")));

export default router;