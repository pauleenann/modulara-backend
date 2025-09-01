import useragent from 'express-useragent';

export const getDeviceInfo = (req)=>{
    const userAgent = req.useragent;
    const deviceInfo = {
        browser: userAgent.browser,
        version: userAgent.version,
        os: userAgent.os,
        platform: userAgent.platform,
        source: userAgent.source
    }

    return deviceInfo
}