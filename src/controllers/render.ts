import { Request, Response } from "express";

export const render = (viewName: string) => async (req: Request, res: Response) => {
    res.render(viewName);
};