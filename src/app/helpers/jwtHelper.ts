import jwt, { JwtPayload } from "jsonwebtoken";

const generateToken = (payload: any, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });

    return token;
};

const verifyToken = (token: string, secret: string) => {
    const decodedData = jwt.verify(token, secret) as JwtPayload;

    return decodedData;
};

export const jwtHelper = {
    generateToken,
    verifyToken,
};
