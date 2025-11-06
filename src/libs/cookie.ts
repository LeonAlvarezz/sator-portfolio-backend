import type { CookieOptions, Request, Response } from "express";

export enum COOKIE_ENTITY {
  ADMIN = "admin",
  USER = "user",
  SITE_USER = "site_user",
}

export const cookie = {
  set: (res: Response, name: string, value: string) => {
    const options: CookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 15,
    };
    res.cookie(name, value, options);
  },
  delete: (res: Response, name: string) => {
    res.clearCookie(name, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
  },

  get: (req: Request, entity: COOKIE_ENTITY) => req.cookies[entity],
};
