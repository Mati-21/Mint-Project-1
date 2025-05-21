import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        if (!token_decode || token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authAdmin;