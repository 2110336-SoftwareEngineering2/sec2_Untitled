export const cookieExtractor = function(req) {
    if (req && req.cookies) return req.cookies['token'];
    else return null;}