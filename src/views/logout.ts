
import { Request, Response } from 'express';

function logout(req: Request, res: Response) {

    if (req.session.user !== undefined)
        delete req.session.user
    req.session.save(() => {
        res.redirect('/');
    })
};

export {
    logout
}