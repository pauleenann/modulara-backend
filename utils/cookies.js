export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    path: '/'
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
    path: '/'
  });
};
