import { HttpInterceptorFn } from '@angular/common/http';

export const authHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: { 'ngrok-skip-browser-warning': 'cipher-choice' },
  });
  return next(req);
};
