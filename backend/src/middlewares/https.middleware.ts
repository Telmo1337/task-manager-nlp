import { Request, Response, NextFunction } from "express";

export function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  // Skip in development
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  // Check for X-Forwarded-Proto header (set by reverse proxies like nginx, Heroku, etc.)
  const proto = req.headers["x-forwarded-proto"];
  
  if (proto === "http") {
    // Redirect to HTTPS
    const host = req.headers.host || req.hostname;
    return res.redirect(301, `https://${host}${req.url}`);
  }

  next();
}
